namespace backend.DTOs;

public class SongDto
{
    public int SongId { get; set; }
    public required string Title { get; set; }
    public required string Album { get; set; }
    public required string DateListened { get; set; } // ISO 8601 string
    public required ArtistDto Artist { get; set; } // Nested Artist DTO
}