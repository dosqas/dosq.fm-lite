using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer; 
using Microsoft.IdentityModel.Tokens;
using DotNetEnv;
using System.Text;
using backend.Data;
using backend.Services;
using Microsoft.Extensions.FileProviders;
using Npgsql;

bool SEED_DATABASE = true; // Set to true to seed the database
bool MONITORING_ENABLED = true; // Set to true to enable monitoring

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
ConfigureServices(builder.Services, builder.Configuration);

var app = builder.Build();

// Seed the database
if (SEED_DATABASE)
    await SeedDatabaseAsync(app);
else
    Console.WriteLine("Skipping database seeding.");

if (MONITORING_ENABLED)
{
    Console.WriteLine("Monitoring is enabled.");
}
else
{
    Console.WriteLine("Monitoring is disabled.");
}

// Configure middleware
ConfigureMiddleware(app);

app.Run();

/// <summary>
/// Configures services for the application.
/// </summary>
/// <param name="services">The IServiceCollection instance.</param>
/// <param name="configuration">The IConfiguration instance.</param>
void ConfigureServices(IServiceCollection services, IConfiguration configuration)
{
    Env.Load();

    var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
    if (string.IsNullOrEmpty(jwtKey))
    {
        throw new InvalidOperationException("JWT_SECRET_KEY is not set in the environment variables.");
    }

    // Add Swagger
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen();

    // Configure DATABASE_URL or fallback to DefaultConnection
    string? rawUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    string connectionString;

    if (!string.IsNullOrWhiteSpace(rawUrl))
    {
        var databaseUri = new Uri(rawUrl);
        var userInfo = databaseUri.UserInfo.Split(':');

        var builder = new Npgsql.NpgsqlConnectionStringBuilder
        {
            Host = databaseUri.Host,
            Port = databaseUri.Port,
            Username = userInfo[0],
            Password = userInfo[1],
            Database = databaseUri.AbsolutePath.Trim('/'),
            SslMode = SslMode.Require,
        };

        connectionString = builder.ConnectionString;
    }
    else
    {
        connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString));

    // Register scoped and hosted services
    services.AddScoped<backend.Services.WebSocketManager>();
    services.AddScoped<LoggingService>();
    services.AddScoped<MonitoringService>();
    services.AddHostedService<MonitoringHostedService>();

    // Add controllers
    services.AddControllers();

    // JWT Authentication
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = "dosqfmlite-backend",
                ValidAudience = "dosqfmlite-frontend",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });

    // CORS
    var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:3000";
    services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.WithOrigins("http://localhost:3000", frontendUrl)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    });
}

/// <summary>
/// Configures middleware for the application.
/// </summary>
/// <param name="app">The WebApplication instance.</param>
void ConfigureMiddleware(WebApplication app)
{
    // Enable CORS
    app.UseCors();

    // Enable Swagger
    app.UseSwagger();
    app.UseSwaggerUI();

    // Enable WebSocket support
    var webSocketOptions = new WebSocketOptions
    {
        KeepAliveInterval = TimeSpan.FromSeconds(120)
    };
    app.UseWebSockets(webSocketOptions);

    // WebSocket middleware
    app.Use(async (context, next) =>
    {
        if (context.Request.Path == "/ws/songs") // WebSocket route
        {
            // Extract the token from the query parameters
            var token = context.Request.Query["token"].ToString();
            if (!string.IsNullOrEmpty(token))
            {
                try
                {
                    // Validate the token
                    var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                    var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
                            ?? throw new InvalidOperationException("JWT_SECRET_KEY is not set in the environment variables.");

                    var validationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = "dosqfmlite-backend",
                        ValidAudience = "dosqfmlite-frontend",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
                    };

                    var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                    context.User = principal; // Populate HttpContext.User
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"WebSocket token validation failed: {ex.Message}");
                    context.Response.StatusCode = 401; // Unauthorized
                    return;
                }
            }
            else
            {
                Console.Error.WriteLine("Token missing in WebSocket request.");
                context.Response.StatusCode = 401; // Unauthorized
                return;
            }

            // Handle the WebSocket request
            using var scope = app.Services.CreateScope();

            var webSocketManager = scope.ServiceProvider.GetRequiredService<backend.Services.WebSocketManager>();
            await webSocketManager.HandleWebSocketAsync(context);

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.Migrate(); // This applies any pending migrations
        }
        else
        {
            await next();
        }
    });

    if (!app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
    }

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
        RequestPath = "/uploads"
    });

    app.UseAuthentication(); // Enable authentication middleware
    app.UseAuthorization();  // Enable authorization middleware

    // Map controllers
    app.MapControllers();
}

/// <summary>
/// Seeds the database with initial data.
/// </summary>
/// <param name="app">The WebApplication instance.</param>
async Task SeedDatabaseAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate(); // Ensure migrations are applied before seeding
    await Seeder.SeedDatabase(context);
}