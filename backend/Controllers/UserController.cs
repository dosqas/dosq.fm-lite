using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    // Register a new user
    [HttpPost("register")]
    public async Task<IActionResult> Register(string username, string password, User.UserRole role = Models.User.UserRole.User)
    {
        // Check if the username already exists
        if (await _context.Users.AnyAsync(u => u.Username == username))
            return BadRequest("Username already exists.");

        // Hash the password
        var hashedPassword = HashPassword(password);

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
        if (user == null || !VerifyPassword(password, user.PasswordHash))
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

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private bool VerifyPassword(string password, string hashedPassword)
    {
        return HashPassword(password) == hashedPassword;
    }
}