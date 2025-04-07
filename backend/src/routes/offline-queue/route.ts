import { Router } from "express";
import { songs, updateSongs } from "../../data/songs";
import { sortSongs } from "../../../../shared/utils/filterAndSort";
import { validateForm } from "../../../../shared/utils/validation";

const router = Router();

router.post("/process", async (req, res) => {
    const { requests } = req.body;
  
    if (!Array.isArray(requests)) {
      return res.status(400).json({ error: "Invalid request format" });
    }
  
    try {
      for (const request of requests) {
        const { method, url, body } = request;
  
        // Process each request based on its method
        if (method === "POST") {
          await handlePostRequest(url, body);
        } else if (method === "PATCH") {
          await handlePatchRequest(url, body);
        } else if (method === "DELETE") {
          await handleDeleteRequest(url);
        } else {
          console.warn(`Unsupported method: ${method}`);
        }
      }
  
      res.status(200).json({ message: "Offline queue processed successfully." });
    } catch (error) {
      console.error("Error processing offline queue:", error);
      res.status(500).json({ error: "Failed to process offline queue." });
    }
  });

// Helper functions to handle requests
const handlePostRequest = async (url: string, body: any) => {
    console.log(`Processing POST request to ${url} with body:`, body);
  
    const newSong = body;
  
    // Validate the new song
    const validationError = validateForm(newSong);
    if (validationError) {
      throw new Error(validationError);
    }
  
    // Assign a unique ID to the new song
    newSong.id = Date.now();
  
    // Add the new song to the list and sort it
    const updatedSongs = sortSongs([...songs, newSong]);
    updateSongs(updatedSongs);
  
    console.log(`Song added successfully with ID ${newSong.id}.`);
  };

const handlePatchRequest = async (id: number, body: any) => {
    console.log(`Processing PATCH request for ID ${id} with body:`, body);
  
    const songIndex = songs.findIndex((s) => s.id === id);
  
    if (songIndex === -1) {
      throw new Error("Song not found");
    }
  
    const updatedSong = {
      ...songs[songIndex], // Keep existing fields
      ...body,             // Overwrite with new fields
    };
  
    const validationError = validateForm(updatedSong);
    if (validationError) {
      throw new Error(validationError);
    }
  
    songs[songIndex] = updatedSong;
  
    const updatedSongs = sortSongs([...songs]);
    updateSongs(updatedSongs);
  
    console.log(`Song with ID ${id} updated successfully.`);
  };

const handleDeleteRequest = async (id: number) => {
    console.log(`Processing DELETE request for ID ${id}`);
  
    const songIndex = songs.findIndex((s) => s.id === id);
  
    if (songIndex === -1) {
      throw new Error("Song not found");
    }
  
    const updatedSongs = songs.filter((_, index) => index !== songIndex);
    updateSongs(updatedSongs);
  
    console.log(`Song with ID ${id} deleted successfully.`);
  };

export default router;