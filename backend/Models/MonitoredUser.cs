using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

public class MonitoredUser
{
    [Key]
    public int MonitoredUserId { get; set; } // Primary key

    [Required]
    public required int UserId { get; set; } // Foreign key to User table

    [ForeignKey(nameof(UserId))]
    public required User User { get; set; } // Navigation property

    [Required]
    public required string Reason { get; set; } // Reason for being flagged (e.g., "High frequency of DELETE operations")

    [Required]
    public required DateTime FlaggedAt { get; set; } // Timestamp when the user was flagged
}