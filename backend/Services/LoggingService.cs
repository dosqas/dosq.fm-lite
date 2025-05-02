using backend.Data;
using backend.Models;

public class LoggingService
{
    private readonly AppDbContext _context;

    public LoggingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task LogAction(int userId, LogEntry.ActionType action, LogEntry.EntityType entity)
    {
        // Retrieve the User entity from the database
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new ArgumentException($"User with ID {userId} not found.");
        }

        // Create the log entry
        var logEntry = new LogEntry
        {
            UserId = userId,
            User = user, // Set the User property
            Action = action, // e.g., "CREATE", "READ", "UPDATE", "DELETE"
            Entity = entity, // e.g., "Song", "Artist"
            Timestamp = DateTime.UtcNow
        };

        // Add the log entry to the database
        _context.LogEntries.Add(logEntry);
        await _context.SaveChangesAsync();
    }

}