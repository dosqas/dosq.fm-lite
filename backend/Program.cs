using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer; 
using Microsoft.IdentityModel.Tokens;
using DotNetEnv;
using System.Text;
using backend.Data;

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

    // Add DbContext
    services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

    // Register WebSocketManager as a scoped service
    services.AddScoped<backend.Services.WebSocketManager>();

    // Register Logging and Monitoring services
    builder.Services.AddScoped<LoggingService>();
    builder.Services.AddScoped<MonitoringService>();

    // Register the MonitoringHostedService as a hosted service
    builder.Services.AddHostedService<MonitoringHostedService>();

    // Add controllers
    services.AddControllers();

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

    // Add CORS policy
    services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
                policy.WithOrigins("http://localhost:3000")
                  .AllowAnyMethod() // Allow any HTTP method (GET, POST, etc.)
                  .AllowAnyHeader() // Allow any headers
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
            using var scope = app.Services.CreateScope();
            var webSocketManager = scope.ServiceProvider.GetRequiredService<backend.Services.WebSocketManager>();
            await webSocketManager.HandleWebSocketAsync(context);
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
    await Seeder.SeedDatabase(context);
}