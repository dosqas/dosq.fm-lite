using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using backend.Utils;
using DotNetEnv;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string _videoDirectory = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "videos");
    private readonly string? _jwtKey;

    public UserController(AppDbContext context)
    {
        _context = context;

        // Ensure the video directory exists
        if (!Directory.Exists(_videoDirectory))
        {
            Directory.CreateDirectory(_videoDirectory);
        }

        Env.Load();

        _jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
        if (string.IsNullOrEmpty(_jwtKey))
        {
            throw new InvalidOperationException("JWT_SECRET_KEY is not set in the environment variables.");
        }
    }

    // Register a new user
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Username and password are required.");

        // Check if the username already exists
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return BadRequest("Username already exists.");

        // Hash the password
        var hashedPassword = UserUtils.HashPassword(request.Password);

        // Create a new user
        var user = new User
        {
            Username = request.Username,
            PasswordHash = hashedPassword,
            Role = request.Role
        };

        try
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok("User registered successfully.");
        }
        catch (Exception ex)
        {
            // Log the exception (optional)
            Console.WriteLine($"Error registering user: {ex.Message}");
            return StatusCode(500, "An error occurred while registering the user. Please try again.");
        }
    }

    // Define a model for the request body
    public class RegisterRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required User.UserRole Role { get; set; }
    }

    // Login a user
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Username and password are required.");

        // Find the user by username
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user == null || !UserUtils.VerifyPassword(request.Password, user.PasswordHash))
            return Unauthorized("Invalid username or password.");

        // Create claims for the JWT token
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // UserId
            new Claim(ClaimTypes.Role, user.Role.ToString()) // Convert UserRole enum to string
        };

        // Generate the JWT token
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: "dosqfmlite-backend",
            audience: "dosqfmlite-frontend",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token) });
    }

    // Define a model for the request body
    public class LoginRequest
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }

    [HttpGet("get-username")]
    [Authorize] // Ensure the endpoint is protected and requires authentication
    public async Task<IActionResult> GetUsername()
    {
        try
        {
            // Get the authenticated user's ID from the JWT claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { error = "User not authenticated" });
            }

            if (!int.TryParse(userIdClaim.Value, out var userId) || userId <= 0)
            {
                return Unauthorized(new { error = "Invalid user ID in token" });
            }

            // Retrieve the user's information from the database
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            // Determine if the user is an admin
            var isAdmin = user.Role == Models.User.UserRole.Admin;

            // Return the username and admin status
            return Ok(new { username = user.Username, isAdmin });
        }
        catch (Exception ex)
        {
            // Log the exception for debugging purposes
            Console.WriteLine($"Error in GetUsername: {ex.Message}");
            return StatusCode(500, new { error = "An internal server error occurred" });
        }
    }

    /// <summary>
    /// Upload a profile video for the authenticated user.
    /// </summary>
    /// <param name="file">The uploaded video file.</param>
    /// <returns>A response indicating the upload status.</returns>
    [HttpPost("upload-profile-video")]
    public async Task<IActionResult> UploadProfileVideo(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { error = "No video uploaded" });
        }

        // Validate file type
        var allowedTypes = new[] { "video/mp4", "video/mkv", "video/webm" };
        if (!allowedTypes.Contains(file.ContentType))
        {
            return BadRequest(new { error = "Only video files are allowed" });
        }

        // Get the authenticated user's ID
        var userId = UserUtils.GetAuthenticatedUserId(User);
        if (userId == 0)
        {
            return Unauthorized(new { error = "User not authenticated" });
        }

        // Save the video file
        var videoPath = Path.Combine(_videoDirectory, $"{userId}-profile-video.mp4");
        using (var stream = new FileStream(videoPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update the user's profile video path in the database
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        user.ProfileVideoPath = $"/uploads/videos/{userId}-profile-video.mp4";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile video uploaded successfully", videoPath = user.ProfileVideoPath });
    }

    /// <summary>
    /// Get the profile video for the authenticated user.
    /// </summary>
    /// <returns>The video file path or null if not found.</returns>
    [HttpGet("get-profile-video")]
    public async Task<IActionResult> GetProfileVideo()
    {
        // Get the authenticated user's ID
        var userId = UserUtils.GetAuthenticatedUserId(User);
        if (userId == 0)
        {
            return Unauthorized(new { error = "User not authenticated" });
        }

        // Get the user's profile video path from the database
        var user = await _context.Users.FindAsync(userId);
        if (user == null || string.IsNullOrEmpty(user.ProfileVideoPath))
        {
            return Ok(new { videoPath = (string?)null });
        }

        return Ok(new { videoPath = user.ProfileVideoPath });
    }
}