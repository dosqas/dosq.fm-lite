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
                .HasOne(s => s.Artist)
                .WithMany(a => a.Songs)
                .HasForeignKey(s => s.ArtistId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete songs when an artist is deleted

            // Configure cascade delete for User -> Songs relationship
            modelBuilder.Entity<User>()
                .HasMany(u => u.Songs)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete songs when a user is deleted

            // Configure cascade delete for LogEntry -> User relationship
            modelBuilder.Entity<LogEntry>()
                .HasOne(le => le.User)
                .WithMany() // No navigation property in User
                .HasForeignKey(le => le.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete log entries when a user is deleted


            // Configure cascade delete for MonitoredUser -> User relationship
            modelBuilder.Entity<MonitoredUser>()
                .HasOne(mu => mu.User)
                .WithMany()
                .HasForeignKey(mu => mu.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete monitored user entry when a user is deleted

            // Add index on DateListened for filtering
            modelBuilder.Entity<Song>()
                .HasIndex(s => s.DateListened)
                .HasDatabaseName("IX_Songs_DateListened");

            // Add index on ArtistId for grouping and joining
            modelBuilder.Entity<Song>()
                .HasIndex(s => s.ArtistId)
                .HasDatabaseName("IX_Songs_ArtistId");
        }
    }
}