using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register WebSocketManager as a scoped service
builder.Services.AddScoped<backend.Services.WebSocketManager>();

// Add controllers
builder.Services.AddControllers();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin() // Allow requests from any origin
              .AllowAnyMethod() // Allow any HTTP method (GET, POST, etc.)
              .AllowAnyHeader(); // Allow any headers
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors();

// Enable Swagger in all environments
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
    if (context.Request.Path == "/ws/songs") // Updated WebSocket route
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

app.UseHttpsRedirection();

// Map controllers
app.MapControllers();

app.Run();