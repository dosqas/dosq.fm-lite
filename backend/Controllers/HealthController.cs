using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Health check endpoint to verify the server is running.
    /// </summary>
    /// <returns>A simple "OK" response.</returns>
    [HttpGet]
    public IActionResult GetHealthCheck()
    {
        return Ok("OK");
    }
}