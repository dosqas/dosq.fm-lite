using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    //private readonly string _videoDirectory = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "videos");
   // private readonly string _videoFileName = "profile-video.mp4";

    // public ProfileController()
    // {
    //     // Ensure the video directory exists
    //     if (!Directory.Exists(_videoDirectory))
    //     {
    //         Directory.CreateDirectory(_videoDirectory);
    //     }
    // }

    // /// <summary>
    // /// Upload a video file.
    // /// </summary>
    // /// <param name="file">The uploaded video file.</param>
    // /// <returns>A response indicating the upload status.</returns>
    // [HttpPost("upload-video")]
    // public async Task<IActionResult> UploadVideo([FromForm] IFormFile file)
    // {
    //     if (file == null || file.Length == 0)
    //     {
    //         return BadRequest(new { error = "No video uploaded" });
    //     }

    //     // Validate file type
    //     var allowedTypes = new[] { "video/mp4", "video/mkv", "video/webm" };
    //     if (!allowedTypes.Contains(file.ContentType))
    //     {
    //         return BadRequest(new { error = "Only video files are allowed" });
    //     }

    //     // Save the video file
    //     var videoDirectory = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "videos");
    //     if (!Directory.Exists(videoDirectory))
    //     {
    //         Directory.CreateDirectory(videoDirectory);
    //     }

    //     var videoPath = Path.Combine(videoDirectory, "profile-video.mp4");
    //     using (var stream = new FileStream(videoPath, FileMode.Create))
    //     {
    //         await file.CopyToAsync(stream);
    //     }

    //     return Ok(new { message = "Video uploaded successfully", videoPath = "/uploads/videos/profile-video.mp4" });
    // }

    // /// <summary>
    // /// Get the uploaded video file path.
    // /// </summary>
    // /// <returns>The video file path or null if not found.</returns>
    // [HttpGet("get-video")]
    // public IActionResult GetVideo()
    // {
    //     var videoPath = Path.Combine(_videoDirectory, _videoFileName);

    //     if (System.IO.File.Exists(videoPath))
    //     {
    //         return Ok(new { videoPath = $"/uploads/videos/{_videoFileName}" });
    //     }

    //     return Ok(new { videoPath = (string?)null });
    // }
}