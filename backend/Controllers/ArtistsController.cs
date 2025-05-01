using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Utils;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtistsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ArtistsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /artists
    [HttpGet]
    public async Task<IActionResult> GetArtists(
        [FromQuery] string? name = null,
        [FromQuery] int? minSongs = null,
        [FromQuery] int? maxSongs = null)
    {
        try
        {
            // Base query
            var query = _context.Artists.Include(a => a.Songs).AsQueryable();

            // Apply filtering and sorting
            query = ArtistUtils.FilterAndSortArtists(query, name, minSongs, maxSongs);

            // Execute the query and fetch results
            var artists = await query.ToListAsync();

            return Ok(artists);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching artists: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // GET: /artists/limited
    [HttpGet("limited")]
    public async Task<IActionResult> GetLimitedArtists(
        [FromQuery] int limit = 15,
        [FromQuery] int page = 1,
        [FromQuery] string? name = null,
        [FromQuery] int? minSongs = null,
        [FromQuery] int? maxSongs = null,
        [FromQuery] string? sort = null)
    {
        try
        {
            if (limit <= 0 || page <= 0)
            {
                return BadRequest("Invalid limit or page parameter");
            }

            // Fetch artists with pagination
            var query = _context.Artists.Include(a => a.Songs).AsQueryable();

            // Apply filtering and sorting
            query = ArtistUtils.FilterAndSortArtists(query, name, minSongs, maxSongs);

            // Pagination
            var total = await query.CountAsync();
            var artists = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            // Check if there are more artists to load
            var hasMore = page * limit < total;

            return Ok(new { artists, hasMore });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching limited artists: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
    
    // GET: /artists/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetArtistById(int id)
    {
        try
        {
            var artist = await _context.Artists.Include(a => a.Songs).FirstOrDefaultAsync(a => a.ArtistId == id);
            if (artist == null)
            {
                return NotFound(new { error = "Artist not found" });
            }

            return Ok(artist);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching artist: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }


    // POST: /artists
    [HttpPost]
    public async Task<IActionResult> AddArtist([FromBody] Artist newArtist)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(newArtist.Name))
            {
                return BadRequest(new { error = "Artist name is required" });
            }

            _context.Artists.Add(newArtist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArtistById), new { id = newArtist.ArtistId }, newArtist);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error adding artist: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // PATCH: /artists/{id}
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateArtist(int id, [FromBody] Artist partialUpdate)
    {
        try
        {
            var artist = await _context.Artists.FirstOrDefaultAsync(a => a.ArtistId == id);
            if (artist == null)
            {
                return NotFound(new { error = "Artist not found" });
            }

            if (!string.IsNullOrEmpty(partialUpdate.Name)) artist.Name = partialUpdate.Name;

            _context.Artists.Update(artist);
            await _context.SaveChangesAsync();

            return Ok(artist);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error updating artist: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

    // DELETE: /artists/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteArtist(int id)
    {
        try
        {
            // Find the artist by ID
            var artist = await _context.Artists.FirstOrDefaultAsync(a => a.ArtistId == id);
            if (artist == null)
            {
                return NotFound(new { error = "Artist not found" });
            }

            // Delete the artist (cascade delete will handle associated songs)
            _context.Artists.Remove(artist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Artist and associated songs deleted successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error deleting artist: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }
}