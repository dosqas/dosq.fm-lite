using backend.DTOs;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Utils;

public static class SongUtils
{
    /// <summary>
    /// Filters and sorts songs based on the provided criteria.
    /// </summary>
    /// <param name="songs">The list of songs.</param>
    /// <param name="from">The starting date for filtering (optional).</param>
    /// <param name="rangeType">The range type for filtering (e.g., "year", "1month", "1day", "all").</param>
    /// <returns>A filtered and sorted list of songs.</returns>
    public static async Task<List<SongDto>> FilterAndSortSongsAsync(List<SongDto> songs, string? from, string? rangeType)
    {
        DateTime? fromDate = null;

        // Parse the 'from' date if provided
        if (!string.IsNullOrEmpty(from) && DateTime.TryParse(from, out var parsedDate))
        {
            fromDate = parsedDate;
        }

        // Apply filtering
        if (fromDate.HasValue)
        {
            songs = songs.Where(song =>
            {
                // Parse DateListened from string to DateTime
                if (!DateTime.TryParse(song.DateListened, out var songDate))
                {
                    return false; // Skip invalid dates
                }

                return (rangeType == "year" && songDate.Year == fromDate.Value.Year) ||
                    (rangeType == "month" && songDate.Year == fromDate.Value.Year &&
                        songDate.Month == fromDate.Value.Month) ||
                    (rangeType == "day" && songDate.Year == fromDate.Value.Year &&
                        songDate.Month == fromDate.Value.Month &&
                        songDate.Day == fromDate.Value.Day) ||
                    (string.IsNullOrEmpty(rangeType) || rangeType == "all" && songDate >= fromDate.Value);
            }).ToList();
        }

        // Apply sorting
        songs = songs.OrderByDescending(song =>
        {
            // Parse DateListened from string to DateTime for sorting
            return DateTime.TryParse(song.DateListened, out var songDate) ? songDate : DateTime.MinValue;
        }).ToList();

        return await Task.FromResult(songs); // Wrap the result in a Task
    }

    public static string? ValidateSong(Song song)
    {
        // Validate Title
        if (string.IsNullOrWhiteSpace(song.Title))
        {
            return "Song Title is required.";
        }

        // Validate Album
        if (string.IsNullOrWhiteSpace(song.Album))
        {
            return "Album is required.";
        }

        // Validate DateListened
        if (song.DateListened == default)
        {
            return "DateListened is required.";
        }

        // Ensure DateListened is not in the future
        if (song.DateListened > DateTime.UtcNow)
        {
            return "DateListened cannot be in the future.";
        }

        // Validate ArtistId
        if (song.Artist.ArtistId <= 0)
        {
            return "ArtistId is required and must be greater than 0.";
        }

        // Validate ArtistName
        if (string.IsNullOrWhiteSpace(song.Artist.Name))
        {
            return "ArtistName is required.";
        }

        // Validate UserId
        if (song.UserId <= 0)
        {
            return "UserId is required and must be greater than 0.";
        }

        return null; // No validation errors
    }

    public static async Task<Song> GenerateRandomSongAsync(AppDbContext context)
    {
        // Fetch a random artist from the database
        var randomArtist = await context.Artists
            .OrderBy(a => Guid.NewGuid()) // Randomize the order
            .FirstOrDefaultAsync();

        if (randomArtist == null)
        {
            // If no artist exists, create a new one
            randomArtist = new Artist
            {
                Name = $"Random Artist {DateTime.Now.Ticks}"
            };
            context.Artists.Add(randomArtist);
            await context.SaveChangesAsync();
        }

        // Fetch a random user from the database
        var randomUser = await context.Users
            .OrderBy(u => Guid.NewGuid()) // Randomize the order
            .FirstOrDefaultAsync();

        if (randomUser == null)
        {
            // If no user exists, create a new one
            var randomUsername = $"RandomUser{DateTime.Now.Ticks}";
            var randomPassword = "RandomPassword123"; // Example password
            var hashedPassword = UserUtils.HashPassword(randomPassword);

            randomUser = new User
            {
                Username = randomUsername,
                PasswordHash = hashedPassword,
                Role = User.UserRole.User
            };

            context.Users.Add(randomUser);
            await context.SaveChangesAsync();
        }

        // Generate the random song
        return new Song
        {
            Title = $"Random Song {DateTime.Now.Ticks}",
            Album = $"Random Album {DateTime.Now.Ticks}",
            DateListened = DateTime.Now,
            ArtistId = randomArtist.ArtistId, // Use the random artist's ID
            Artist = randomArtist, // Assign the random artist entity directly
            UserId = randomUser.UserId // Use the random user's ID
        };
    }

    public static object GroupSongs(List<SongDto> songs, string rangeType = "year")
    {
        return rangeType switch
        {
            "year" => songs
                .Where(s => DateTime.TryParse(s.DateListened, out _)) // Ensure valid dates
                .GroupBy(s => DateTime.Parse(s.DateListened).Year)
                .Select(g => new
                {
                    Year = g.Key,
                    Songs = g.ToList()
                }),
            "month" => songs
                .Where(s => DateTime.TryParse(s.DateListened, out _)) // Ensure valid dates
                .GroupBy(s => new
                {
                    Year = DateTime.Parse(s.DateListened).Year,
                    Month = DateTime.Parse(s.DateListened).Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Songs = g.ToList()
                }),
            "day" => songs
                .Where(s => DateTime.TryParse(s.DateListened, out _)) // Ensure valid dates
                .GroupBy(s => DateTime.Parse(s.DateListened).Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Songs = g.ToList()
                }),
            _ => songs
                .Where(s => DateTime.TryParse(s.DateListened, out _)) // Ensure valid dates
                .GroupBy(s => DateTime.Parse(s.DateListened).Year)
                .Select(g => new
                {
                    Year = g.Key,
                    Songs = g.ToList()
                })
        };
    } 
}