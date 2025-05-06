using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class MonitoringService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public async Task MonitorUserActivity()
    {
        try
        {
            var oneHourAgo = DateTime.UtcNow.AddHours(-1);

            // Fetch users with high activity in the last hour
            var suspiciousUsers = await _context.LogEntries
                .Where(le => le.Timestamp >= oneHourAgo)
                .GroupBy(le => le.UserId)
                .Where(g => g.Count() > 5) // Threshold: More than 5 actions in the last hour
                .Select(g => new { UserId = g.Key, ActionCount = g.Count() })
                .ToListAsync();

            foreach (var user in suspiciousUsers)
            {
                var userEntity = await _context.Users.FindAsync(user.UserId);
                if (userEntity == null)
                {
                    Console.Error.WriteLine($"User with ID {user.UserId} not found.");
                    continue;
                }

                // Check if the user is already flagged
                var monitoredUser = await _context.MonitoredUsers
                    .FirstOrDefaultAsync(mu => mu.UserId == user.UserId);

                if (monitoredUser == null)
                {
                    // Add the user to the MonitoredUsers table
                    _context.MonitoredUsers.Add(new MonitoredUser
                    {
                        UserId = user.UserId,
                        Reason = $"High frequency of actions: {user.ActionCount} actions in the last hour",
                        FlaggedAt = DateTime.UtcNow
                    });
                }
                else
                {
                    // Update the existing entry only if the ActionCount has changed
                    var newReason = $"High frequency of actions: {user.ActionCount} actions in the last hour";
                    if (monitoredUser.Reason != newReason)
                    {
                        monitoredUser.Reason = newReason;
                        monitoredUser.FlaggedAt = DateTime.UtcNow;
                        _context.MonitoredUsers.Update(monitoredUser);
                    }
                }
            }

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error monitoring user activity: {ex.Message}");
        }
    }
}