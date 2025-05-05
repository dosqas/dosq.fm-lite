using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Diagnostics;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Song> Songs { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }
        public DbSet<MonitoredUser> MonitoredUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure cascade delete for Artist -> Songs relationship
            modelBuilder.Entity<Song>()
                .HasOne(s => s.Artist) // Navigation property in Song
                .WithMany() // No navigation property in Artist
                .HasForeignKey("ArtistId") // Foreign key column
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete songs when an artist is deleted  

            // Configure cascade delete for User -> Songs relationship
            modelBuilder.Entity<Song>()
                .HasOne<User>() // No navigation property in Song
                .WithMany(u => u.Songs)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete songs when a user is deleted

            // Configure cascade delete for LogEntry -> User relationship
            modelBuilder.Entity<LogEntry>()
                .HasOne<User>() // No navigation property in LogEntry
                .WithMany()
                .HasForeignKey(le => le.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete log entries when a user is deleted

            // Configure cascade delete for MonitoredUser -> User relationship
            modelBuilder.Entity<MonitoredUser>()
                .HasOne<User>() // No navigation property in MonitoredUser
                .WithMany()
                .HasForeignKey(mu => mu.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete monitored user entry when a user is deleted

            // Configure enum-to-string conversion for User.Role
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>(); // Store the enum as a string

            // Configure enum-to-string conversion for LogEntry.Action
            modelBuilder.Entity<LogEntry>()
                .Property(le => le.Action)
                .HasConversion<string>(); // Store the enum as a string

            // Configure enum-to-string conversion for LogEntry.Entity
            modelBuilder.Entity<LogEntry>()
                .Property(le => le.Entity)
                .HasConversion<string>(); // Store the enum as a string

            // Add index on DateListened for filtering
            modelBuilder.Entity<Song>()
                .HasIndex(s => s.DateListened)
                .HasDatabaseName("IX_Songs_DateListened");

            // Add index on ArtistId for grouping and joining
            modelBuilder.Entity<Song>()
                .HasIndex("ArtistId") // Index on the foreign key column
                .HasDatabaseName("IX_Songs_ArtistId");
        }
    }
}