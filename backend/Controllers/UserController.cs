using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using backend.Utils;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string _videoDirectory = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "videos");

    public UserController(AppDbContext context)
    {
        _context = context;

        // Ensure the video directory exists
        if (!Directory.Exists(_videoDirectory))
        {
            Directory.CreateDirectory(_videoDirectory);
        }
    }

    // Register a new user
    [HttpPost("register")]
    public async Task<IActionResult> Register(string username, string password, User.UserRole role = Models.User.UserRole.User)
    {
        // Check if the username already exists
        if (await _context.Users.AnyAsync(u => u.Username == username))
            return BadRequest("Username already exists.");

        // Hash the password
        var hashedPassword = UserUtils.HashPassword(password);

        // Create a new user
        var user = new User
        {
            Username = username,
            PasswordHash = hashedPassword,
            Role = role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully.");
    }

    // Login a user
    [HttpPost("login")]
    public async Task<IActionResult> Login(string username, string password)
    {
        // Find the user by username
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null || !UserUtils.VerifyPassword(password, user.PasswordHash))
            return Unauthorized("Invalid username or password.");

        // Create claims for the JWT token
        var claims = new[]
        {
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // UserId
        new Claim(ClaimTypes.Role, user.Role.ToString()) // Convert UserRole enum to string
    };

        // Generate the JWT token
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your-secret-key"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: "dosqfmlite-backend",
            audience: "dosqfmlite-frontend",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token) });
    }

    /// <summary>
    /// Upload a profile video for the authenticated user.
    /// </summary>
    /// <param name="file">The uploaded video file.</param>
    /// <returns>A response indicating the upload status.</returns>
    [HttpPost("upload-profile-video")]
    public async Task<IActionResult> UploadProfileVideo([FromForm] IFormFile file)
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