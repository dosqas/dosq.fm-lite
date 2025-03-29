import { NextResponse } from "next/server";
import { songs, updateSongs } from "@/data/songs";
import { Song } from "@/types/song";
import { sortSongs } from "@/utils/songUtils";


// GET: Fetch a single song by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const song = songs.find((s) => s.id === parseInt(params.id));
  if (!song) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }
  return NextResponse.json(song);
}

// PUT: Update a song by ID
export async function PUT(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    const songIndex = songs.findIndex((s) => s.id === parseInt(id));
    if (songIndex === -1) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
  
    const updatedSong = await request.json();
  
    songs[songIndex] = { ...songs[songIndex], ...updatedSong };
  
    const updatedSongs = sortSongs([...songs]);
    updateSongs(updatedSongs);
  
    return NextResponse.json(updatedSongs[songIndex]); 
  }
  
// DELETE: Delete a song by ID
export async function DELETE(request: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    const songIndex = songs.findIndex((s) => s.id === parseInt(id));
    if (songIndex === -1) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }
  
    const updatedSongs = songs.filter((_, index) => index !== songIndex); 
    updateSongs(updatedSongs); 
  
    return new NextResponse(null, { status: 204 }); 
  }