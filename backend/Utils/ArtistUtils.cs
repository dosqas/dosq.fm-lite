using backend.Models;

namespace backend.Utils;

public static class ArtistUtils
{
    public static IQueryable<Artist> FilterAndSortArtists(
        IQueryable<Artist> query,
        string? name,
        int? minSongs,
        int? maxSongs)
    {
        // Apply filtering
        query = FilterArtists(query, name, minSongs, maxSongs);

        // Apply sorting
        query = SortArtistsBySongCount(query);

        return query;
    }

    private static IQueryable<Artist> FilterArtists(
        IQueryable<Artist> query,
        string? name,
        int? minSongs,
        int? maxSongs)
    {
        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(a => a.Name.Contains(name));
        }

        if (minSongs.HasValue)
        {
            query = query.Where(a => a.Songs != null && a.Songs.Count >= minSongs.Value);
        }

        if (maxSongs.HasValue)
        {
            query = query.Where(a => a.Songs != null && a.Songs.Count <= maxSongs.Value);
        }

        return query;
    }

    private static IQueryable<Artist> SortArtistsBySongCount(
        IQueryable<Artist> query)
    {
        return query.OrderBy(a => a.Songs != null ? a.Songs.Count : 0);
    }
}