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
        public DateTime DateListened
        {
            get => _dateListened;
            set => _dateListened = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }
        private DateTime _dateListened;

        // Foreign key for Artist
        [ForeignKey("Artist")]
        public int ArtistId { get; set; }
        
        [Required]
        public required Artist Artist { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        public required User User { get; set; } = null!;
    }
}