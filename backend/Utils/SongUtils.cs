using backend.Models;

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
    public static List<Song> FilterAndSortSongs(List<Song> songs, string? from, string? rangeType)
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
                (rangeType == "year" && song.DateListened.Year == fromDate.Value.Year) ||
                (rangeType == "1month" && song.DateListened.Year == fromDate.Value.Year &&
                song.DateListened.Month == fromDate.Value.Month) ||
                (rangeType == "1day" && song.DateListened.Year == fromDate.Value.Year &&
                song.DateListened.Month == fromDate.Value.Month &&
                song.DateListened.Day == fromDate.Value.Day) ||
                (string.IsNullOrEmpty(rangeType) || rangeType == "all" && song.DateListened >= fromDate.Value))
                .ToList();
        }

        // Apply sorting
        songs = songs.OrderByDescending(song => song.DateListened).ToList();

        return songs;
    }

    public static string? ValidateSong(Song song)
    {
        // Validate Title
        if (string.IsNullOrWhiteSpace(song.Title))
        {
            return "Song Title is required.";
        }

        // Validate Artist
        if (song.Artist == null || string.IsNullOrWhiteSpace(song.Artist.Name))
        {
            return "Artist is required.";
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
        if (song.DateListened > DateTime.Now)
        {
            return "Date cannot be in the future.";
        }

        return null; // No validation errors
    }

    public static Song GenerateRandomSong()
    {
        return new Song
        {
            Title = $"Random Song {DateTime.Now.Ticks}",
            Album = $"Random Album {DateTime.Now.Ticks}",
            DateListened = DateTime.Now,
            Artist = new Artist { Name = $"Random Artist {DateTime.Now.Ticks}" }
        };
    }

    public static object GroupSongs(List<Song> songs, string rangeType = "year")
    {
        return rangeType switch
        {
            "year" => songs.GroupBy(s => s.DateListened.Year).Select(g => new
            {
                Year = g.Key,
                Songs = g.ToList()
            }),
            "month" => songs.GroupBy(s => new { s.DateListened.Year, s.DateListened.Month }).Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                Songs = g.ToList()
            }),
            "day" => songs.GroupBy(s => s.DateListened.Date).Select(g => new
            {
                Date = g.Key,
                Songs = g.ToList()
            }),
            _ => songs.GroupBy(s => s.DateListened.Year).Select(g => new
            {
                Year = g.Key,
                Songs = g.ToList()
            })
        };
    }
}