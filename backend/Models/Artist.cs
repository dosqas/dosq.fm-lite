using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Artist
    {
        [Key]
        public int ArtistId { get; set; }

        [Required]
        public required string Name { get; set; }
    }
}