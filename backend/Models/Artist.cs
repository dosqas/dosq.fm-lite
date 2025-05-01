using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Artist
    {
        [Key]
        public int ArtistId { get; set; }

        [Required]
        public required string Name { get; set; }

        // 1-to-Many relationship with Song
        public ICollection<Song>? Songs { get; set; }
    }
}