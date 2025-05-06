using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpGet("monitored-users")]
    [Authorize] // Ensure the endpoint is protected
    public async Task<IActionResult> GetMonitoredUsers()
    {
        try
        {
            // Get the authenticated user's role from the JWT claims
            var userRoleClaim = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(userRoleClaim) || userRoleClaim != Models.User.UserRole.Admin.ToString())
            {
                return Forbid("Only admins can access this endpoint.");
            }

            // Fetch the list of monitored users
            var monitoredUsers = await _context.MonitoredUsers
                .Join(
                    _context.Users, // Join with the Users table
                    mu => mu.UserId, // Foreign key in MonitoredUser
                    u => u.UserId,   // Primary key in User
                    (mu, u) => new
                    {
                        mu.MonitoredUserId,
                        u.Username, // Fetch the Username from the User table
                        mu.Reason,
                        mu.FlaggedAt
                    }
                )
                .ToListAsync();

            return Ok(monitoredUsers);
        }
        catch (Exception ex)
        {
            // Log the exception for debugging purposes
            Console.WriteLine($"Error in GetMonitoredUsers: {ex.Message}");
            return StatusCode(500, new { error = "An internal server error occurred" });
        }
    }

    [HttpGet("user-logs/{userId}")]
    [Authorize] // Ensure the endpoint is protected
    public async Task<IActionResult> GetUserLogs(int userId)
    {
        try
        {
            // Get the authenticated user's role from the JWT claims
            var userRoleClaim = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(userRoleClaim) || userRoleClaim != Models.User.UserRole.Admin.ToString())
            {
                return Forbid("Only admins can access this endpoint.");
            }

            // Get the logs for the last hour
            var oneHourAgo = DateTime.UtcNow.AddHours(-1);
            var logs = await _context.LogEntries
                .Where(le => le.Timestamp >= oneHourAgo)
                .OrderByDescending(le => le.Timestamp)
                .Select(le => new
                {
                    le.LogEntryId,
                    Action = le.Action.ToString(),
                    Entity = le.Entity.ToString(),
                    le.Timestamp
                })
                .ToListAsync();

            return Ok(logs);
        }
        catch (Exception ex)
        {
            // Log the exception for debugging purposes
            Console.WriteLine($"Error fetching logs for user {userId}: {ex.Message}");
            return StatusCode(500, new { error = "An internal server error occurred" });
        }
    }
}