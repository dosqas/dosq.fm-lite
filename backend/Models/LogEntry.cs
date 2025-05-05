using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class LogEntry
{
    public enum ActionType
    {
        CREATE,
        READ,
        UPDATE,
        DELETE
    }

    public enum EntityType
    {
        Song,
        Artist,
        User
    }

    [Key]
    public int LogEntryId { get; set; } // Primary key

    [Required]
    public required int UserId { get; set; } // Foreign key to User table

    [Required]
    public required ActionType Action { get; set; } // e.g., "CREATE", "READ", "UPDATE", "DELETE"

    [Required]
    public required EntityType Entity { get; set; } // e.g., "Song", "Artist"

    [Required]
    public required DateTime Timestamp { get; set; } // When the action occurred
}