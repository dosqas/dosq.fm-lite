using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OptimizedStatisticController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OptimizedStatisticController(AppDbContext context)
        {
            _context = context;
        }

        // Fetch the top 5 artists with the most songs listened to in the last 30 days.
        [HttpGet("top-artists-last-30-days")]
        public async Task<IActionResult> GetTopArtistsLast30Days()
        {
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

            var topArtists = await _context.Songs
                .Where(s => s.DateListened >= thirtyDaysAgo) // Filter songs listened to in the last 30 days
                .GroupBy(s => s.Artist.ArtistId) // Group by ArtistId
                .Select(g => new
                {
                    ArtistId = g.Key,
                    ArtistName = g.Select(s => s.Artist.Name).FirstOrDefault() ?? "Unknown Artist", // Fetch the artist's name or default to "Unknown Artist"
                    SongCount = g.Count() // Count the number of songs for each artist
                })
                .OrderByDescending(a => a.SongCount) // Order by song count
                .Take(5) // Take the top 5 artists
                .ToListAsync();

            return Ok(topArtists);
        }
    }
}