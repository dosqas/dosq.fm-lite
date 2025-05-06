using System.Net.WebSockets;
using System.Text;
using backend.Data;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;
using backend.Utils;

namespace backend.Services;

public class WebSocketManager
{
    private readonly AppDbContext _context;
    
    // Static dictionary to ensure the same instance is used across requests
    private static readonly Dictionary<int, WebSocket> _userSockets = new();
    private static readonly object _lockObject = new(); // For thread safety
    private static readonly Dictionary<int, CancellationTokenSource> _userCancellationTokens = new();

    public WebSocketManager(AppDbContext context)
    {
        _context = context;
    }

    public async Task HandleWebSocketAsync(HttpContext context)
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            // Authenticate the user and get their ID
            var userId = UserUtils.GetAuthenticatedUserId(context.User);

            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            
            lock (_lockObject)
            {
                if (_userSockets.ContainsKey(userId))
                {
                    Console.WriteLine($"Replacing existing WebSocket for user {userId}");
                    // Gracefully close existing connection if possible
                    try 
                    {
                        _userSockets[userId].CloseAsync(WebSocketCloseStatus.NormalClosure, 
                            "New connection initiated", CancellationToken.None).Wait(1000);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error closing existing connection: {ex.Message}");
                        // Fallback to abort if graceful close fails
                        _userSockets[userId].Abort();
                    }
                    _userSockets.Remove(userId);
                    
                    // Also cancel any ongoing auto-generation
                    if (_userCancellationTokens.ContainsKey(userId))
                    {
                        _userCancellationTokens[userId].Cancel();
                        _userCancellationTokens.Remove(userId);
                    }
                }

                _userSockets[userId] = webSocket;
                Console.WriteLine($"WebSocket added for user {userId}. Total connections: {_userSockets.Count}");
            }

            Console.WriteLine($"User {userId} connected");

            try
            {
                await ReceiveMessagesAsync(webSocket, userId);
            }
            catch (Exception ex) 
            {
                Console.WriteLine($"Error in WebSocket communication with user {userId}: {ex.Message}");
            }
            finally 
            {
                lock (_lockObject)
                {
                    if (_userSockets.TryGetValue(userId, out var socket) && socket == webSocket)
                    {
                        _userSockets.Remove(userId);
                        Console.WriteLine($"WebSocket removed for user {userId}. Remaining connections: {_userSockets.Count}");
                    }
                    
                    // Cancel any auto-generation if the websocket disconnects
                    if (_userCancellationTokens.ContainsKey(userId))
                    {
                        _userCancellationTokens[userId].Cancel();
                        _userCancellationTokens.Remove(userId);
                    }
                }
                
                Console.WriteLine($"User {userId} disconnected");
            }
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }

    private async Task ReceiveMessagesAsync(WebSocket webSocket, int userId)
    {
        var buffer = new byte[1024 * 4];
        while (webSocket.State == WebSocketState.Open)
        {
            try
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Close)
                {
                    Console.WriteLine($"WebSocket closed by user {userId}");
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by client", CancellationToken.None);
                    return;
                }
                else
                {
                    var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    Console.WriteLine($"Received message from user {userId}: {message}");
                    
                    // You can add message handling logic here if needed
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error receiving message from user {userId}: {ex.Message}");
                return; // Exit the loop on error
            }
        }
    }

    public async Task<bool> StartAutoGenerationAsync(int userId)
    {
        CancellationTokenSource tokenSource;
        
        lock (_lockObject)
        {
            // Check if there's already an auto-generation process running
            if (_userCancellationTokens.ContainsKey(userId))
            {
                Console.WriteLine($"Auto-generation is already running for user {userId}");
                return false;
            }
            
            // Check if the user has an active WebSocket connection
            if (!_userSockets.ContainsKey(userId))
            {
                Console.WriteLine($"No active WebSocket connection for user {userId}");
                return false;
            }

            // Create a new cancellation token source for this auto-generation process
            tokenSource = new CancellationTokenSource();
            _userCancellationTokens[userId] = tokenSource;
        }

        Console.WriteLine($"Starting auto-generation for user {userId}");
        
        // Send a status update to the client
        await SendMessageToUserAsync(userId, new { type = "AUTO_GENERATION_STATUS", payload = new { isActive = true } });

        try
        {
            while (!tokenSource.Token.IsCancellationRequested)
            {
                // Check if the WebSocket is still available and open before generating
                bool canProceed;
                lock (_lockObject)
                {
                    canProceed = _userSockets.TryGetValue(userId, out var socket) && 
                                socket.State == WebSocketState.Open;
                }
                
                if (!canProceed)
                {
                    Console.WriteLine($"WebSocket for user {userId} is no longer available or open");
                    break;
                }

                try
                {
                    // Generate a random song
                    var randomSong = await SongUtils.GenerateRandomSongAsync(_context);
                    randomSong.UserId = userId; // Set the user ID for the song
                    
                    // Add more detailed logging for debugging
                    Console.WriteLine($"Generated song: {randomSong.Title} by {randomSong.Artist?.Name ?? "Unknown"} (ID: {randomSong.SongId})");
                    
                    // Explicitly begin a database transaction
                    using (var transaction = await _context.Database.BeginTransactionAsync(tokenSource.Token))
                    {
                        try
                        {
                            _context.Songs.Add(randomSong);
                            
                            // Log before saving
                            Console.WriteLine($"Attempting to save song to database");
                            
                            // Save with explicit error handling
                            int rowsAffected = await _context.SaveChangesAsync(tokenSource.Token);
                            
                            // Log the result
                            Console.WriteLine($"SaveChangesAsync completed. Rows affected: {rowsAffected}");
                            
                            // Commit the transaction
                            await transaction.CommitAsync(tokenSource.Token);
                            Console.WriteLine($"Transaction committed successfully");
                            
                            // Verify the song was added by fetching it back
                            var savedSong = await _context.Songs
                                .FindAsync(new object[] { randomSong.SongId }, tokenSource.Token);
                            
                            if (savedSong != null)
                            {
                                Console.WriteLine($"Verified song exists in database: {savedSong.Title}");
                            }
                            else
                            {
                                Console.WriteLine($"WARNING: Could not verify song {randomSong.SongId} exists after save!");
                            }

                            // Map the random song to a DTO with null checking
                            var randomSongDto = new SongDto
                            {
                                SongId = randomSong.SongId,
                                Title = randomSong.Title ?? "Unknown Title",
                                Album = randomSong.Album ?? "Unknown Album",
                                DateListened = randomSong.DateListened.ToString("o"),
                                Artist = randomSong.Artist != null 
                                    ? new ArtistDto
                                    {
                                        ArtistId = randomSong.Artist.ArtistId,
                                        Name = randomSong.Artist.Name ?? "Unknown Artist"
                                    } 
                                    : new ArtistDto
                                    {
                                        ArtistId = 0,
                                        Name = "Unknown Artist"
                                    }
                            };

                            // Send the new song to the specific user
                            var newSongMessage = new { type = "NEW_SONG", payload = randomSongDto };
                            await SendMessageToUserAsync(userId, newSongMessage);
                        }
                        catch (Exception ex)
                        {
                            // Roll back transaction on error
                            await transaction.RollbackAsync(tokenSource.Token);
                            Console.WriteLine($"Transaction rolled back due to error: {ex.Message}");
                            throw; // Re-throw to be caught by outer catch block
                        }
                    }

                    // Delay for auto-generation with cancellation support
                    await Task.Delay(1500, tokenSource.Token);
                }
                catch (TaskCanceledException)
                {
                    // Expected exception when cancellation is requested
                    break;
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"Error during auto-generation for user {userId}: {ex.Message}");
                    await Task.Delay(5000, tokenSource.Token); // Add a longer delay on error
                }
            }
        }
        catch (TaskCanceledException)
        {
            // Expected when cancellation occurs
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Unhandled error in auto-generation for user {userId}: {ex.Message}");
        }
        finally
        {
            lock (_lockObject)
            {
                if (_userCancellationTokens.ContainsKey(userId))
                {
                    _userCancellationTokens.Remove(userId);
                }
            }
            Console.WriteLine($"Auto-generation stopped for user {userId}");
            
            // Notify the client that auto-generation has stopped
            try
            {
                // Check if user still has an active WebSocket connection
                if (_userSockets.TryGetValue(userId, out var socket) && socket.State == WebSocketState.Open)
                {
                    // Fire and forget to avoid deadlock in finally block
                    _ = SendMessageToUserAsync(userId, new { type = "AUTO_GENERATION_STATUS", payload = new { isActive = false } });
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error sending stop notification: {ex.Message}");
            }
        }
        
        return true; // Successfully started auto-generation
    }

    public bool StopAutoGeneration(int userId)
    {
        lock (_lockObject)
        {
            if (_userCancellationTokens.TryGetValue(userId, out var tokenSource))
            {
                tokenSource.Cancel();
                Console.WriteLine($"Cancellation requested for auto-generation for user {userId}");
                return true;
            }
            else
            {
                Console.WriteLine($"No auto-generation process found for user {userId}");
                return false;
            }
        }
    }
    
    public bool IsAutoGenerationActive(int userId)
    {
        lock (_lockObject)
        {
            return _userCancellationTokens.ContainsKey(userId);
        }
    }

    public async Task HandleGroupedSongsRequestAsync(HttpContext context)
    {
        try
        {
            // Extract the user ID from the HttpContext
            var userId = UserUtils.GetAuthenticatedUserId(context.User);

            // Read the WebSocket message payload
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Text)
            {
                var payloadString = Encoding.UTF8.GetString(buffer, 0, result.Count);

                if (string.IsNullOrEmpty(payloadString))
                {
                    Console.WriteLine("Payload is null or empty for REQUEST_GROUPED_SONGS");
                    return;
                }

                var filterCriteria = System.Text.Json.JsonSerializer.Deserialize<GroupedSongsRequest>(payloadString);
                if (filterCriteria == null)
                {
                    Console.WriteLine("Invalid payload for REQUEST_GROUPED_SONGS");
                    return;
                }

                // Determine the range type and filter songs
                var songsQuery = _context.Songs.Where(s => s.UserId == userId);

                if (filterCriteria.RangeType == "year" && filterCriteria.Year.HasValue)
                {
                    songsQuery = songsQuery.Where(s => s.DateListened.Year == filterCriteria.Year.Value);
                }
                else if (filterCriteria.RangeType == "month" && filterCriteria.Year.HasValue && filterCriteria.Month.HasValue)
                {
                    songsQuery = songsQuery.Where(s =>
                        s.DateListened.Year == filterCriteria.Year.Value &&
                        s.DateListened.Month == filterCriteria.Month.Value);
                }
                else if (filterCriteria.RangeType == "day" && filterCriteria.Year.HasValue && filterCriteria.Month.HasValue && filterCriteria.Day.HasValue)
                {
                    songsQuery = songsQuery.Where(s =>
                        s.DateListened.Year == filterCriteria.Year.Value &&
                        s.DateListened.Month == filterCriteria.Month.Value &&
                        s.DateListened.Day == filterCriteria.Day.Value);
                }

                // Group songs by artist or album (example: grouped by artist)
                var groupedSongs = await songsQuery
                    .GroupBy(s => s.Artist)
                    .Select(g => new
                    {
                        ArtistId = g.Key.ArtistId,
                        ArtistName = g.Key.Name,
                        SongCount = g.Count()
                    })
                    .ToListAsync();

                // Send the grouped data back to the client
                var response = new
                {
                    type = "GROUPED_SONGS",
                    payload = groupedSongs
                };

                var responseString = System.Text.Json.JsonSerializer.Serialize(response);
                var responseBytes = Encoding.UTF8.GetBytes(responseString);

                await webSocket.SendAsync(new ArraySegment<byte>(responseBytes), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error handling grouped songs request: {ex.Message}");
        }
    }

    private async Task SendMessageToUserAsync(int userId, object message)
    {
        WebSocket? webSocket;
        
        lock (_lockObject)
        {
            if (!_userSockets.TryGetValue(userId, out webSocket))
            {
                Console.Error.WriteLine($"WebSocket for user {userId} is not found in the dictionary.");
                return;
            }

            if (webSocket.State != WebSocketState.Open)
            {
                Console.Error.WriteLine($"WebSocket for user {userId} is not in an open state. Current state: {webSocket.State}");
                _userSockets.Remove(userId); // Remove the closed socket
                return;
            }
        }

        try
        {
            var serializedMessage = Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(message));
            await webSocket.SendAsync(
                new ArraySegment<byte>(serializedMessage), 
                WebSocketMessageType.Text, 
                true, 
                CancellationToken.None
            );
            Console.WriteLine($"Message sent to user {userId}: {System.Text.Json.JsonSerializer.Serialize(message)}");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error sending message to user {userId}: {ex.Message}");
            
            // Remove the socket if it's in an error state
            lock (_lockObject)
            {
                if (_userSockets.TryGetValue(userId, out var socket) && socket == webSocket)
                {
                    _userSockets.Remove(userId);
                }
            }
        }
    }
}