using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Utils;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SongsController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    // GET: /songs
    [HttpGet]
    public Task<IActionResult> GetSongs(
        [FromQuery] string? from, 
        [FromQuery] string? rangetype)
    {
        try
        {
            // Fetch all songs from the database
            var songs = _context.Songs.Include(s => s.Artist).AsQueryable();

            // Apply filtering and sorting (implement your logic here)
            var filteredSongs = SongUtils.FilterAndSortSongs(songs, from, rangetype);

            return Task.FromResult<IActionResult>(Ok(filteredSongs));
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching songs: {ex.Message}");
            return Task.FromResult<IActionResult>(StatusCode(500, "Internal Server Error"));
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
        try
        {
            if (limit <= 0 || page <= 0)
            {
                return BadRequest("Invalid limit or page parameter");
            }

            // Fetch songs with pagination
            var query = _context.Songs.Include(s => s.Artist);
            var total = await query.CountAsync();
            var songs = query
                .Skip((page - 1) * limit)
                .Take(limit)
                .AsQueryable();

            // Apply filtering and sorting (implement your logic here)
            var filteredSongs = SongUtils.FilterAndSortSongs(songs, from, rangetype);

            // Check if there are more songs to load
            var hasMore = page * limit < total;

            return Ok(new { songs = filteredSongs, hasMore });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching limited songs: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: /songs/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSongById(int id)
    {
        try
        {
            // Find the song by ID
            var song = await _context.Songs.Include(s => s.Artist).FirstOrDefaultAsync(s => s.SongId == id);
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
    }

    // POST: /songs
    [HttpPost]
    public async Task<IActionResult> AddSong([FromBody] Song newSong)
    {
        try
        {
            // Validate the incoming song data (implement your validation logic here)
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
    }

    // PATCH: Update a song by ID
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateSong(int id, [FromBody] Song partialUpdate)
    {
        try
        {
            // Find the song by ID
            var song = await _context.Songs.Include(s => s.Artist).FirstOrDefaultAsync(s => s.SongId == id);
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
    }

    // DELETE: Delete a song by ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSong(int id)
    {
        try
        {
            // Find the song by ID
            var song = await _context.Songs.FirstOrDefaultAsync(s => s.SongId == id);
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
    }

    // OPTIONS: /songs
    [HttpOptions]
    public IActionResult HandleOptions()
    {
        Response.Headers.Append("Access-Control-Allow-Origin", "*");
        Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return NoContent();
    }
}