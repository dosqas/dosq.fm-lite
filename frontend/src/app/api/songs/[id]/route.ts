import { NextResponse } from "next/server";
import { songs, updateSongs } from "@/data/songs";
import { withCORS } from "@/utils/backendUtils";
import { sortSongs, validateForm } from "@/utils/songUtils";

// PATCH: Update a song by ID
export async function PATCH(request: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  const songIndex = songs.findIndex((s) => s.id === parseInt(id, 10));
  if (songIndex === -1) {
    return withCORS(NextResponse.json({ error: "Song not found" }, { status: 404 }));
  }

  const partialUpdate = await request.json();
  const updatedSong = {
    ...songs[songIndex], // Keep existing fields
    ...partialUpdate,   // Overwrite with new fields
  };

  const validationError = validateForm(updatedSong);
  if (validationError) {
    return withCORS(NextResponse.json({ error: validationError }, { status: 400 }));
  }

  songs[songIndex] = updatedSong;

  const updatedSongs = sortSongs([...songs]);
  updateSongs(updatedSongs);

  return withCORS(NextResponse.json(updatedSong, { status: 200 }));
}

// DELETE: Delete a song by ID
export async function DELETE(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    const songIndex = songs.findIndex((s) => s.id === parseInt(id, 10));
    if (songIndex === -1) {
      return withCORS(NextResponse.json({ error: "Song not found" }, { status: 404 }));
    }
  
    const updatedSongs = songs.filter((_, index) => index !== songIndex); 
    updateSongs(updatedSongs); 
  
    return withCORS(NextResponse.json({ "message": "Deleted successfully"}, { status: 200 })); 
  }