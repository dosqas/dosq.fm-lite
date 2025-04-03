import express, { Request, Response } from "express";
import { songs, updateSongs } from "../../data/songs";
import { Song } from "@shared/types/song";
import { sortSongs, filterSongs } from "../../utils/songUtils";
import { validateForm } from "../../../../shared/utils/validation";

const router = express.Router();

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