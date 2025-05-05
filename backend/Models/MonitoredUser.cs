using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class MonitoredUser
{
    [Key]
    public int MonitoredUserId { get; set; } // Primary key

    [Required]
    public required int UserId { get; set; } // Foreign key to User table

    [Required]
    public required string Reason { get; set; } // Reason for being flagged (e.g., "High frequency of DELETE operations")

    [Required]
    public required DateTime FlaggedAt { get; set; } // Timestamp when the user was flagged
}