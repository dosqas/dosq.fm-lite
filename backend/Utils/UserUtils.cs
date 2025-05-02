using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Utils;

public static class UserUtils
{
    public static int GetAuthenticatedUserId(ClaimsPrincipal user)
    {
        // Extract the UserId from the authenticated user's claims
        return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    }

    public static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public static bool VerifyPassword(string password, string hashedPassword)
    {
        return HashPassword(password) == hashedPassword;
    }
}
