import express, { Request, Response } from "express";
import { songs, updateSongs } from "../../../data/songs";
import { sortSongs, validateForm } from "../../../utils/songUtils";

const router = express.Router();

// PATCH: Update a song by ID
router.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const songIndex = songs.findIndex((s) => s.id === parseInt(id, 10));

  if (songIndex === -1) {
    return res.status(404).json({ error: "Song not found" });
  }

  const partialUpdate = req.body;
  const updatedSong = {
    ...songs[songIndex], // Keep existing fields
    ...partialUpdate,   // Overwrite with new fields
  };

  const validationError = validateForm(updatedSong);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  songs[songIndex] = updatedSong;

  const updatedSongs = sortSongs([...songs]);
  updateSongs(updatedSongs);

  res.status(200).json(updatedSong);
});

// DELETE: Delete a song by ID
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const songIndex = songs.findIndex((s) => s.id === parseInt(id, 10));

  if (songIndex === -1) {
    return res.status(404).json({ error: "Song not found" });
  }

  const updatedSongs = songs.filter((_, index) => index !== songIndex);
  updateSongs(updatedSongs);

  res.status(200).json({ message: "Deleted successfully" });
});

export default router;