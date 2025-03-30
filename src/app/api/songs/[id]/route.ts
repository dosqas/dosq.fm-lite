import { NextResponse } from "next/server";
import { songs, updateSongs } from "@/data/songs";
import { withCORS } from "@/utils/backendUtils";
import { sortSongs, validateForm } from "@/utils/songUtils";

// PUT: Update a song by ID
export async function PUT(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    const songIndex = songs.findIndex((s) => s.id === parseInt(id));
    if (songIndex === -1) {
      return withCORS(NextResponse.json({ error: "Song not found" }, { status: 404 }));
    }
  
    const updatedSong = await request.json();
    const validationError = validateForm(updatedSong);
    if (validationError) {
      return withCORS(NextResponse.json({ error: validationError }, { status: 400 }));
    }
  
    songs[songIndex] = {
      ...songs[songIndex], 
      ...updatedSong,
    };
  
    const updatedSongs = sortSongs([...songs]);
    updateSongs(updatedSongs);
  
    const updatedSongData = updatedSongs.find((song) => song.id === parseInt(id));
    return withCORS(NextResponse.json(updatedSongData, { status: 200 }));
  }

// DELETE: Delete a song by ID
export async function DELETE(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    const songIndex = songs.findIndex((s) => s.id === parseInt(id, 10));
    console.log("Song index:", id);
    if (songIndex === -1) {
      return withCORS(NextResponse.json({ error: "Song not found" }, { status: 404 }));
    }
  
    const updatedSongs = songs.filter((_, index) => index !== songIndex); 
    updateSongs(updatedSongs); 
  
    return withCORS(NextResponse.json({ "message": "Deleted successfully"}, { status: 200 })); 
  }