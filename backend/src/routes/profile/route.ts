import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure Multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos/"); // Directory for storing videos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 * 5 }, // Limit file size to 5GB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/mkv", "video/webm"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

// POST: Upload a video
router.post("/upload-video", upload.single("video"), async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No video uploaded" });
    }
  
    // Overwrite the existing video file
    const videoPath = path.join(__dirname, "../../../uploads/videos/profile-video.mp4");
    const fs = require("fs");
    fs.renameSync(req.file.path, videoPath);
  
    res.status(200).json({
      message: "Video uploaded successfully",
      videoPath: "/uploads/videos/profile-video.mp4", // Return the static path
    });
  });

// GET: Serve uploaded videos
router.get("/get-video", async (req: Request, res: Response) => {
    const videoPath = path.join(__dirname, "../../../uploads/videos/profile-video.mp4");
  
    // Check if the file exists
    const fs = require("fs");
    if (fs.existsSync(videoPath)) {
      res.status(200).json({ videoPath: "/uploads/videos/profile-video.mp4" });
    } else {
        res.status(200).json({ videoPath: null });
    }
  });

export default router;