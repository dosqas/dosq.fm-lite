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
    public static List<T> FilterAndSortArtists<T>(
    List<T> artists,
    int? minSongs,
    int? maxSongs,
    Func<T, int> getSongCount)
    {
        // Apply filtering
        if (minSongs.HasValue)
        {
            artists = artists.Where(a => getSongCount(a) >= minSongs.Value).ToList();
        }

        if (maxSongs.HasValue)
        {
            artists = artists.Where(a => getSongCount(a) <= maxSongs.Value).ToList();
        }

        // Apply sorting
        artists = artists.OrderBy(getSongCount).ToList();

        return artists;
    }
}