using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("monitored-users")]
    public async Task<IActionResult> GetMonitoredUsers()
    {
        // Check if the authenticated user is an admin
        var userRole = HttpContext.User.FindFirst("Role")?.Value;
        if (userRole != "Admin")
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
                    u.Username, // Fetch the Username from the User table
                    mu.Reason,
                    mu.FlaggedAt
                }
            )
            .ToListAsync();

        return Ok(monitoredUsers);
    }
}