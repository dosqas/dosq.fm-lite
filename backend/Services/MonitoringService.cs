using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

public class MonitoringService
{
    private readonly AppDbContext _context;

    public MonitoringService(AppDbContext context)
    {
        _context = context;
    }

    public async Task MonitorUserActivity()
    {
        while (true)
        {
            try
            {
                var oneDayAgo = DateTime.UtcNow.AddDays(-1);

                // Fetch users with high activity in the last day
                var suspiciousUsers = await _context.LogEntries
                    .Where(le => le.Timestamp >= oneDayAgo)
                    .GroupBy(le => le.UserId)
                    .Where(g => g.Count() > 100) // Threshold: More than 100 actions in the last day
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
                    if (!_context.MonitoredUsers.Any(mu => mu.UserId == user.UserId))
                    {
                        // Add the user to the MonitoredUsers table
                        _context.MonitoredUsers.Add(new MonitoredUser
                        {
                            UserId = user.UserId,
                            User = userEntity,
                            Reason = $"High frequency of actions: {user.ActionCount} actions in the last day",
                            FlaggedAt = DateTime.UtcNow
                        });
                    }
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error monitoring user activity: {ex.Message}");
            }

            // Wait for 10 minutes before checking again
            await Task.Delay(TimeSpan.FromMinutes(10));
        }
    }
}