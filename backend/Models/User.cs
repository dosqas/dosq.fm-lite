using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace backend.Models
{
    public class User
    {
        public enum UserRole
        {
            User,
            Admin
        }

        // Primary Key
        [Key]
        public int UserId { get; set; }

        [Required]
        public required string Username { get; set; } = string.Empty;

        [Required]
        public required string PasswordHash { get; set; } = string.Empty; // Store hashed passwords

        [Required]
        public required UserRole Role { get; set; } = UserRole.User; // "User" or "Admin"

        // Relationships
        public ICollection<Song> Songs { get; set; } = new List<Song>();
    }
}