using System.Security.Claims;

namespace backend.Utils;

public static class UserUtils
{
    public static int GetAuthenticatedUserId(ClaimsPrincipal user)
    {
        // Extract the UserId from the authenticated user's claims
        return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
    }
}
