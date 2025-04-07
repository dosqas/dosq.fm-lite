import express, { Request, Response } from "express";
import { songs, updateSongs } from "../../data/songs";
import { Song } from "@shared/types/song";
import { groupSongs } from "../../utils/songUtils";
import { sortSongs, filterSongs } from "../../../../shared/utils/filterAndSort";
import { validateForm } from "../../../../shared/utils/validation";
import { startAutoGeneration, stopAutoGeneration } from "./websocket";

const router = express.Router();

// POST: Start auto-generation of songs
// This endpoint is used to trigger the auto-generation of songs
router.post("/start-auto-generation", (req: Request, res: Response) => {
  try {
    startAutoGeneration(); // Trigger the auto-generation logic
    res.status(200).json({ message: "Auto-generation started" });
  } catch (error) {
    console.error("Error starting auto-generation:", error);
    res.status(500).json({ error: "Failed to start auto-generation" });
  }
});

// POST: Stop auto-generation of songs
// This endpoint is used to stop the auto-generation of songs
router.post("/stop-auto-generation", (req: Request, res: Response) => {
  try {
    stopAutoGeneration(); // Stop the auto-generation logic
    res.status(200).json({ message: "Auto-generation started" });
  } catch (error) {
    console.error("Error starting auto-generation:", error);
    res.status(500).json({ error: "Failed to start auto-generation" });
  }
});

// GET: Fetch all songs
router.get("/", (req: Request, res: Response) => {
  const { from, rangetype } = req.query as {
    from?: string;
    rangetype?: "all" | "year" | "1month" | "1day";
  };

  try {
    const filteredSongs = sortSongs(filterSongs(songs, from, rangetype));
    res.status(200).json(filteredSongs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: Fetch a limited number of songs (for pagination/infinite scrolling)
router.get("/limited", (req: Request, res: Response) => {
  const { limit = "15", page = "1", from, rangetype } = req.query as {
    limit?: string;
    page?: string;
    from?: string;
    rangetype?: "all" | "year" | "1month" | "1day";
  };

  try {
    // Parse limit and page as integers
    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);

    if (isNaN(limitNum) || isNaN(pageNum) || limitNum <= 0 || pageNum <= 0) {
      return res.status(400).json({ error: "Invalid limit or page parameter" });
    }

    // Filter and sort songs based on the query
    const filteredSongs = sortSongs(filterSongs(songs, from, rangetype));

    // Paginate the songs
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedSongs = filteredSongs.slice(startIndex, startIndex + limitNum);

    // Check if there are more songs to load
    const hasMore = startIndex + paginatedSongs.length < filteredSongs.length;

    res.status(200).json({ songs: paginatedSongs, hasMore });
  } catch (error) {
    console.error("Error fetching limited songs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Add a new song
router.post("/", async (req: Request, res: Response) => {
  try {
    const newSong = req.body as Song;

    const validationError = validateForm(newSong);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    newSong.id = Date.now();

    const updatedSongs = sortSongs([...songs, newSong]);
    updateSongs(updatedSongs);

    return res.status(201).json(newSong);
  } catch (error) {
    console.error("Error adding song:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// OPTIONS: Handle CORS preflight
router.options("/", (req: Request, res: Response) => {
  res.status(204)
    .set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })
    .send();
});

// Export the router correctly
export default router;