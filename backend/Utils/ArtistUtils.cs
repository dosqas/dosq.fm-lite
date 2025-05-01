using backend.Models;

namespace backend.Utils;

public static class ArtistUtils
{
    /// <summary>
    /// Filters and sorts artists based on the number of songs.
    /// </summary>
    /// <param name="artists">The list of artists to filter and sort.</param>
    /// <param name="minSongs">Minimum number of songs (optional).</param>
    /// <param name="maxSongs">Maximum number of songs (optional).</param>
    /// <returns>A filtered and sorted list of artists.</returns>
    public static List<Artist> FilterAndSortArtists(
        List<Artist> artists,
        int? minSongs,
        int? maxSongs)
    {
        // Apply filtering
        if (minSongs.HasValue)
        {
            artists = artists.Where(a => a.Songs != null && a.Songs.Count >= minSongs.Value).ToList();
        }

        if (maxSongs.HasValue)
        {
            artists = artists.Where(a => a.Songs != null && a.Songs.Count <= maxSongs.Value).ToList();
        }

        // Apply sorting
        artists = artists.OrderBy(a => a.Songs != null ? a.Songs.Count : 0).ToList();

        return artists;
    }
}