using System.Net.WebSockets;
using System.Text;
using backend.Data;
using backend.DTOs;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class WebSocketManager(AppDbContext context)
{
    private readonly AppDbContext _context = context;
    private readonly List<WebSocket> _clients = [];
    private bool _isAutoGenerating = false;

    public async Task HandleWebSocketAsync(HttpContext context)
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            _clients.Add(webSocket);
            Console.WriteLine("Client connected");

            await SendInitialDataAsync(webSocket);

            await ReceiveMessagesAsync(webSocket);

            _clients.Remove(webSocket);
            Console.WriteLine("Client disconnected");
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }

    private async Task SendInitialDataAsync(WebSocket webSocket)
    {
        try
        {
            // Fetch songs and include their artists
            var songs = await _context.Songs.Include(s => s.Artist).ToListAsync();

            // Map songs to DTOs
            var songDtos = songs.Select(s => new SongDto
            {
                SongId = s.SongId,
                Title = s.Title,
                Album = s.Album,
                DateListened = s.DateListened.ToString("o"), // Format as ISO 8601 string
                Artist = new ArtistDto
                {
                    ArtistId = s.Artist.ArtistId,
                    Name = s.Artist.Name
                }
            }).ToList();

            // Group songs using DTOs
            var groupedData = SongUtils.GroupSongs(songDtos);

            // Create the WebSocket message
            var message = new
            {
                type = "GROUPED_SONGS",
                payload = groupedData
            };

            // Send the message to the WebSocket client
            await SendMessageAsync(webSocket, message);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error sending initial data: {ex.Message}");
            var errorMessage = new { type = "ERROR", payload = "Failed to fetch songs" };
            await SendMessageAsync(webSocket, errorMessage);
        }
    }

    private static async Task ReceiveMessagesAsync(WebSocket webSocket)
    {
        var buffer = new byte[1024 * 4];
        while (webSocket.State == WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (result.MessageType == WebSocketMessageType.Close)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by client", CancellationToken.None);
            }
            else
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine($"Received message: {message}");
            }
        }
    }

    public async Task StartAutoGenerationAsync()
    {
        if (_isAutoGenerating) return;

        _isAutoGenerating = true;

        while (_isAutoGenerating)
        {
            try
            {
                // Generate a random song
                var randomSong = await SongUtils.GenerateRandomSongAsync(_context);
                _context.Songs.Add(randomSong);
                await _context.SaveChangesAsync();

                // Map the random song to a DTO
                var randomSongDto = new SongDto
                {
                    SongId = randomSong.SongId,
                    Title = randomSong.Title,
                    Album = randomSong.Album,
                    DateListened = randomSong.DateListened.ToString("o"),
                    Artist = new ArtistDto
                    {
                        ArtistId = randomSong.Artist.ArtistId,
                        Name = randomSong.Artist.Name
                    }
                };

                // Fetch updated songs and map them to DTOs
                var songs = await _context.Songs.Include(s => s.Artist).ToListAsync();
                var groupedData = SongUtils.GroupSongs(songs.Select(s => new SongDto
                {
                    SongId = s.SongId,
                    Title = s.Title,
                    Album = s.Album,
                    DateListened = s.DateListened.ToString("o"),
                    Artist = new ArtistDto
                    {
                        ArtistId = s.Artist.ArtistId,
                        Name = s.Artist.Name
                    }
                }).ToList());

                // Broadcast to all clients
                var newSongMessage = new { type = "NEW_SONG", payload = randomSongDto };
                var groupedDataMessage = new { type = "GROUPED_SONGS", payload = groupedData };

                await BroadcastMessageAsync(newSongMessage);
                await BroadcastMessageAsync(groupedDataMessage);

                await Task.Delay(1500); // Delay for auto-generation
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error during auto-generation: {ex.Message}");
            }
        }
    }

    public void StopAutoGeneration()
    {
        _isAutoGenerating = false;
    }

    private async Task BroadcastMessageAsync(object message)
    {
        var serializedMessage = Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(message));
        var tasks = _clients.Where(c => c.State == WebSocketState.Open).Select(client =>
            client.SendAsync(new ArraySegment<byte>(serializedMessage), WebSocketMessageType.Text, true, CancellationToken.None));
        await Task.WhenAll(tasks);
    }

    private static async Task SendMessageAsync(WebSocket webSocket, object message)
    {
        var serializedMessage = Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(message));
        await webSocket.SendAsync(new ArraySegment<byte>(serializedMessage), WebSocketMessageType.Text, true, CancellationToken.None);
    }
}