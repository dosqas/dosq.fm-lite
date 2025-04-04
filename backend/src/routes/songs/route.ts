import express, { Request, Response } from "express";
import { songs, updateSongs } from "../../data/songs";
import { Song } from "@shared/types/song";
import { sortSongs, filterSongs } from "../../utils/songUtils";
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