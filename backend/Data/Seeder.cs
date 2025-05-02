using backend.Models;
using Bogus;
using ShellProgressBar;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class Seeder
    {
        public static async Task SeedDatabase(AppDbContext context, int userCount = 10, int artistCount = 100000, int songsPerArtist = 2, int batchSize = 20000)
        {
            Console.WriteLine("Clearing existing data...");

            // Clear the tables
            await context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE \"Songs\" RESTART IDENTITY CASCADE;");
            await context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE \"Artists\" RESTART IDENTITY CASCADE;");
            await context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE \"Users\" RESTART IDENTITY CASCADE;");

            Console.WriteLine("Existing data cleared. Seeding new data...");

            // Generate fake users
            var userFaker = new Faker<User>()
                .RuleFor(u => u.Username, f => f.Internet.UserName())
                .RuleFor(u => u.PasswordHash, f => f.Internet.Password())
                .RuleFor(u => u.Role, f => User.UserRole.User);

            Console.WriteLine("Generating users...");
            using (var progressBar = new ProgressBar(userCount, "Seeding Users"))
            {
                var users = new List<User>();
                for (int i = 0; i < userCount; i++)
                {
                    users.Add(userFaker.Generate());
                    progressBar.Tick();
                }
                context.Users.AddRange(users);
                await context.SaveChangesAsync();
            }

            // Generate global artists
            var artistFaker = new Faker<Artist>()
                .RuleFor(a => a.Name, f => f.Name.FullName());

            Console.WriteLine("Generating artists...");
            using (var progressBar = new ProgressBar(artistCount, "Seeding Artists"))
            {
                var artists = new List<Artist>();
                for (int i = 0; i < artistCount; i++)
                {
                    artists.Add(artistFaker.Generate());
                    progressBar.Tick();
                }
                context.Artists.AddRange(artists);
                await context.SaveChangesAsync();
            }

            // Materialize the artists and users to avoid concurrent queries
            var allArtists = await context.Artists.ToListAsync();
            var allUsers = await context.Users.ToListAsync();

            // Generate songs for each artist in batches
            var songFaker = new Faker<Song>()
                .RuleFor(s => s.Title, f => f.Lorem.Sentence(3))
                .RuleFor(s => s.Album, f => f.Lorem.Word())
                .RuleFor(s => s.DateListened, f => f.Date.Past(2).ToUniversalTime()); // Convert to UTC

            Console.WriteLine("Generating songs...");
            using (var progressBar = new ProgressBar(allArtists.Count, "Seeding Songs"))
            {
                var songBatch = new List<Song>();
                foreach (var artist in allArtists)
                {
                    var songs = songFaker.Generate(songsPerArtist);
                    foreach (var song in songs)
                    {
                        song.Artist = artist;
                        song.UserId = allUsers[new Random().Next(allUsers.Count)].UserId; // Assign random user
                        songBatch.Add(song);
                    }

                    // Add songs to the batch
                    if (songBatch.Count >= batchSize)
                    {
                        context.Songs.AddRange(songBatch);
                        await context.SaveChangesAsync();
                        songBatch.Clear(); // Clear the batch after saving
                    }

                    progressBar.Tick();
                }

                // Save any remaining songs in the batch
                if (songBatch.Count > 0)
                {
                    context.Songs.AddRange(songBatch);
                    await context.SaveChangesAsync();
                }
            }

            Console.WriteLine("Database seeding completed.");
        }
    }
}