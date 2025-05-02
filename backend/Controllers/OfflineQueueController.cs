using backend.Data;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;

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
        public string Method { get; set; }
        public string Url { get; set; }
        public Song Body { get; set; }
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
            foreach (var request in requests)
            {
                switch (request.Method.ToUpper())
                {
                    case "POST":
                        await HandlePostRequest(request.Url, request.Body);
                        break;
                    case "PATCH":
                        await HandlePatchRequest(request.Url, request.Body);
                        break;
                    case "DELETE":
                        await HandleDeleteRequest(request.Url);
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

    private async Task HandlePostRequest(string url, Song body)
    {
        Console.WriteLine($"Processing POST request to {url} with body: {body}");

        // Validate the new song
        var validationError = SongUtils.ValidateSong(body);
        if (validationError != null)
        {
            throw new Exception(validationError);
        }

        // Add the new song to the database
        _context.Songs.Add(body);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Song added successfully with ID {body.SongId}.");
    }

    private async Task HandlePatchRequest(string url, Song body)
    {
        Console.WriteLine($"Processing PATCH request to {url} with body: {body}");

        // Extract the ID from the URL (assuming the ID is part of the URL)
        var id = ExtractIdFromUrl(url);

        var song = await _context.Songs.FindAsync(id);
        if (song == null)
        {
            throw new Exception("Song not found");
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

        Console.WriteLine($"Song with ID {id} updated successfully.");
    }

    private async Task HandleDeleteRequest(string url)
    {
        Console.WriteLine($"Processing DELETE request to {url}");

        // Extract the ID from the URL (assuming the ID is part of the URL)
        var id = ExtractIdFromUrl(url);

        var song = await _context.Songs.FindAsync(id);
        if (song == null)
        {
            throw new Exception("Song not found");
        }

        _context.Songs.Remove(song);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Song with ID {id} deleted successfully.");
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