import { NextResponse } from "next/server";
import { songs, updateSongs } from "@/data/songs"; 
import { Song } from "@/types/song";
import { sortSongs, validateForm, filterSongs } from "@/utils/songUtils"; 
import { withCORS } from "@/utils/backendUtils";

// GET: Fetch all songs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const rangeType = searchParams.get("rangetype") as "all" | "year" | "1month" | "1day" | null;

  const groupedData = filterSongs(songs, from, rangeType);

  return withCORS(NextResponse.json(groupedData, { status: 200 }));
}

// POST: Add a new song
export async function POST(request: Request) {
  const newSong: Song = await request.json();

  const validationError = validateForm (newSong);
  if (validationError) {
    return withCORS(NextResponse.json({ error: validationError }, { status: 400 }));
  }

  const updatedSongs = sortSongs([...songs, newSong]);
  updateSongs(updatedSongs);

  return withCORS(NextResponse.json(newSong, { status: 201 })); 
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}