using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Song
    {
        [Key]
        public int SongId { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required string Album { get; set; }

        [Required]
        public required DateTime DateListened { get; set; }

        // Foreign key for Artist
        [ForeignKey("Artist")]
        public int ArtistId { get; set; }
        
        [Required]
        public required Artist Artist { get; set; }
    }
}