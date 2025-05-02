using backend.Data;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class OfflineQueueController : ControllerBase
{
    private readonly AppDbContext _context;

    public OfflineQueueController(AppDbContext context)
    {
        _context = context;
    }

    // Request model to represent the incoming requests
    public class RequestModel
    {
        public required string Method { get; set; }
        public required string Url { get; set; }
        public required Song Body { get; set; }
    }

    [HttpPost("process")]
    public async Task<IActionResult> ProcessQueue([FromBody] List<RequestModel> requests)
    {
        if (requests == null || !requests.Any())
        {
            return BadRequest(new { error = "Invalid request format" });
        }

        try
        {
            var userId = UserUtils.GetAuthenticatedUserId(User);
            if (userId == 0)
            {
                return Unauthorized(new { error = "User not authenticated" });
            }

            foreach (var request in requests)
            {
                switch (request.Method.ToUpper())
                {
                    case "POST":
                        await HandlePostRequest(userId, request.Body);
                        break;
                    case "PATCH":
                        await HandlePatchRequest(userId, request.Url, request.Body);
                        break;
                    case "DELETE":
                        await HandleDeleteRequest(userId, request.Url);
                        break;
                    default:
                        Console.WriteLine($"Unsupported method: {request.Method}");
                        break;
                }
            }

            return Ok(new { message = "Offline queue processed successfully." });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error processing offline queue: {ex.Message}");
            return StatusCode(500, new { error = "Failed to process offline queue." });
        }
    }

    private async Task HandlePostRequest(int userId, Song body)
    {
        Console.WriteLine($"Processing POST request for user {userId} with body: {body}");

        // Validate the new song
        var validationError = SongUtils.ValidateSong(body);
        if (validationError != null)
        {
            throw new Exception(validationError);
        }

        // Associate the song with the authenticated user
        body.UserId = userId;

        // Add the new song to the database
        _context.Songs.Add(body);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Song added successfully with ID {body.SongId} for user {userId}.");
    }

    private async Task HandlePatchRequest(int userId, string url, Song body)
    {
        Console.WriteLine($"Processing PATCH request for user {userId} with body: {body}");

        // Extract the ID from the URL
        var id = ExtractIdFromUrl(url);

        var song = await _context.Songs.FirstOrDefaultAsync(s => s.SongId == id && s.UserId == userId);
        if (song == null)
        {
            throw new Exception("Song not found or does not belong to the user");
        }

        // Update the song
        song.Title = body.Title ?? song.Title;
        song.Album = body.Album ?? song.Album;
        song.DateListened = body.DateListened != default ? body.DateListened : song.DateListened;

        // Validate the updated song
        var validationError = SongUtils.ValidateSong(song);
        if (validationError != null)
        {
            throw new Exception(validationError);
        }

        await _context.SaveChangesAsync();

        Console.WriteLine($"Song with ID {id} updated successfully for user {userId}.");
    }

    private async Task HandleDeleteRequest(int userId, string url)
    {
        Console.WriteLine($"Processing DELETE request for user {userId}");

        // Extract the ID from the URL
        var id = ExtractIdFromUrl(url);

        var song = await _context.Songs.FirstOrDefaultAsync(s => s.SongId == id && s.UserId == userId);
        if (song == null)
        {
            throw new Exception("Song not found or does not belong to the user");
        }

        _context.Songs.Remove(song);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Song with ID {id} deleted successfully for user {userId}.");
    }

    private int ExtractIdFromUrl(string url)
    {
        // Assuming the URL ends with the ID (e.g., "/api/songs/123")
        var segments = url.Split('/');
        if (int.TryParse(segments.Last(), out var id))
        {
            return id;
        }

        throw new Exception("Invalid URL format. Could not extract ID.");
    }
}