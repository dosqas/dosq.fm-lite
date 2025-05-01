using backend.Models;

namespace backend.Utils;

public static class SongUtils
{
    // Public method to filter and sort songs
    public static IQueryable<Song> FilterAndSortSongs(IQueryable<Song> songs, string? from, string? rangeType)
    {
        // Apply filtering
        songs = FilterSongs(songs, from, rangeType);

        // Apply sorting
        songs = SortSongs(songs);

        return songs;
    }

    // Private method to filter songs
    private static IQueryable<Song> FilterSongs(IQueryable<Song> songs, string? from, string? rangeType)
    {
        DateTime? fromDate = null;

        // Parse the 'from' date if provided
        if (!string.IsNullOrEmpty(from))
        {
            if (DateTime.TryParse(from, out var parsedDate))
            {
                fromDate = parsedDate;
            }
        }

        return songs.Where(song =>
            fromDate == null || // No filtering if 'from' is not provided
            (rangeType == "year" && song.DateListened.Year == fromDate.Value.Year) ||
            (rangeType == "1month" && song.DateListened.Year == fromDate.Value.Year &&
             song.DateListened.Month == fromDate.Value.Month) ||
            (rangeType == "1day" && song.DateListened.Year == fromDate.Value.Year &&
             song.DateListened.Month == fromDate.Value.Month &&
             song.DateListened.Day == fromDate.Value.Day) ||
            string.IsNullOrEmpty(rangeType) || rangeType == "all" && song.DateListened >= fromDate.Value
        );
    }

    // Private method to sort songs
    private static IQueryable<Song> SortSongs(IQueryable<Song> songs)
    {
        return songs.OrderByDescending(song => song.DateListened);
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
}