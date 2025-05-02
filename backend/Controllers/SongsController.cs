using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Utils;
using System.Security.Claims;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SongsController(AppDbContext context, Services.WebSocketManager webSocketManager, LoggingService loggingService) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly Services.WebSocketManager _webSocketManager = webSocketManager;

    private readonly LoggingService _loggingService = loggingService;

    // GET: /songs
    [HttpGet]
    public async Task<IActionResult> GetSongs(
        [FromQuery] string? from,
        [FromQuery] string? rangetype)
    {
        var userId = 0;
        try
        {
            userId = UserUtils.GetAuthenticatedUserId(User);

            // Fetch all songs for the authenticated user
            var songs = await _context.Songs
                .Include(s => s.Artist)
                .Where(s => s.UserId == userId)
                .ToListAsync();

            // Apply filtering and sorting
            var filteredSongs = SongUtils.FilterAndSortSongs(songs, from, rangetype);

            return Ok(filteredSongs);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching songs: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
        finally 
        {
            // Log the action for auditing purposes
            await _loggingService.LogAction(userId, LogEntry.ActionType.READ, LogEntry.EntityType.Song);
        }
    }

    // GET: /songs/limited
    [HttpGet("limited")]
    public async Task<IActionResult> GetLimitedSongs(
        [FromQuery] int limit = 15,
        [FromQuery] int page = 1,
        [FromQuery] string? from = null,
        [FromQuery] string? rangetype = null)
    {
        var userId = 0;
        try
        {
            if (limit <= 0 || page <= 0)
            {
                return BadRequest("Invalid limit or page parameter");
            }

            userId = UserUtils.GetAuthenticatedUserId(User);

            // Fetch songs for the authenticated user with pagination
            var songsQuery = _context.Songs
                .Include(s => s.Artist)
                .Where(s => s.UserId == userId);

            var total = await songsQuery.CountAsync();
            var paginatedSongs = await songsQuery
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            // Apply filtering and sorting
            var filteredSongs = SongUtils.FilterAndSortSongs(paginatedSongs, from, rangetype);

            // Check if there are more songs to load
            var hasMore = page * limit < total;

            return Ok(new { songs = filteredSongs, hasMore });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching limited songs: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
        finally 
        {
            // Log the action for auditing purposes
            await _loggingService.LogAction(userId, LogEntry.ActionType.READ, LogEntry.EntityType.Song);
        }
    }

    // GET: /songs/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSongById(int id)
    {
        var userId = 0;
        try
        {
            userId = UserUtils.GetAuthenticatedUserId(User);

            // Find the song by ID for the authenticated user
            var song = await _context.Songs
                .Include(s => s.Artist)
                .FirstOrDefaultAsync(s => s.SongId == id && s.UserId == userId);

            if (song == null)
            {
                return NotFound(new { error = "Song not found" });
            }

            return Ok(song);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching song by ID: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
        finally 
        {
            // Log the action for auditing purposes
            await _loggingService.LogAction(userId, LogEntry.ActionType.READ, LogEntry.EntityType.Song);
        }
    }

    // POST: /songs
    [HttpPost]
    public async Task<IActionResult> AddSong([FromBody] Song newSong)
    {
        var userId = 0;
        try
        {
            userId = UserUtils.GetAuthenticatedUserId(User);

            // Associate the song with the authenticated user
            newSong.UserId = userId;

            // Validate the incoming song data
            var validationError = SongUtils.ValidateSong(newSong);
            if (!string.IsNullOrEmpty(validationError))
            {
                return BadRequest(new { error = validationError });
            }

            // Save the new song to the database
            _context.Songs.Add(newSong);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSongById), new { id = newSong.SongId }, newSong);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error adding song: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
        finally 
        {
            // Log the action for auditing purposes
            await _loggingService.LogAction(userId, LogEntry.ActionType.CREATE, LogEntry.EntityType.Song);
        }
    }

    // POST: /songs/start-auto-generation
    [HttpPost("start-auto-generation")]
    public async Task<IActionResult> StartAutoGeneration()
    {
        try
        {
            await _webSocketManager.StartAutoGenerationAsync();
            return Ok(new { message = "Auto-generation started" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error starting auto-generation: {ex.Message}");
            return StatusCode(500, new { error = "Failed to start auto-generation" });
        }
    }

    // POST: /songs/stop-auto-generation
    [HttpPost("stop-auto-generation")]
    public IActionResult StopAutoGeneration()
    {
        try
        {
            _webSocketManager.StopAutoGeneration();
            return Ok(new { message = "Auto-generation stopped" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error stopping auto-generation: {ex.Message}");
            return StatusCode(500, new { error = "Failed to stop auto-generation" });
        }
    }

    // PATCH: Update a song by ID
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateSong(int id, [FromBody] Song partialUpdate)
    {
        var userId = 0;
        try
        {
            userId = UserUtils.GetAuthenticatedUserId(User);

            // Find the song by ID for the authenticated user
            var song = await _context.Songs
                .Include(s => s.Artist)
                .FirstOrDefaultAsync(s => s.SongId == id && s.UserId == userId);

            if (song == null)
            {
                return NotFound(new { error = "Song not found" });
            }

            // Update the song with the partial data
            if (!string.IsNullOrEmpty(partialUpdate.Title)) song.Title = partialUpdate.Title;
            if (!string.IsNullOrEmpty(partialUpdate.Album)) song.Album = partialUpdate.Album;
            if (partialUpdate.DateListened != default) song.DateListened = partialUpdate.DateListened;
            if (partialUpdate.Artist != null) song.Artist = partialUpdate.Artist;

            // Validate the updated song
            var validationError = SongUtils.ValidateSong(song);
            if (!string.IsNullOrEmpty(validationError))
            {
                return BadRequest(new { error = validationError });
            }

            // Save the updated song to the database
            _context.Songs.Update(song);
            await _context.SaveChangesAsync();

            return Ok(song);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error updating song: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
        finally 
        {
            // Log the action for auditing purposes
            await _loggingService.LogAction(userId, LogEntry.ActionType.UPDATE, LogEntry.EntityType.Song);
        }
    }

    // DELETE: Delete a song by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSong(int id)
    {
        var userId = 0;
        try
        {
            userId = UserUtils.GetAuthenticatedUserId(User);

            // Find the song by ID for the authenticated user
            var song = await _context.Songs.FirstOrDefaultAsync(s => s.SongId == id && s.UserId == userId);

            if (song == null)
            {
                return NotFound(new { error = "Song not found" });
            }

            // Delete the song
            _context.Songs.Remove(song);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Deleted successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error deleting song: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
        finally 
        {
            // Log the action for auditing purposes
            await _loggingService.LogAction(userId, LogEntry.ActionType.DELETE, LogEntry.EntityType.Song);
        }
    }
}