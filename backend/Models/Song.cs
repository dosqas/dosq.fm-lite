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
        public required DateTime DateListened
        {
            get => _dateListened;
            set => _dateListened = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }
        private DateTime _dateListened;

        [ForeignKey("Artist")]
        public required int ArtistId { get; set; } // Foreign key for Artist

        [Required]
        public required Artist Artist { get; set; } // Navigation property for Artist

        [ForeignKey("User")]
        public required int UserId { get; set; }
    }
}