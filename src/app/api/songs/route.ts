import { NextResponse } from "next/server";
import { songs, updateSongs } from "@/data/songs"; 
import { Song } from "@/types/song";
import { sortSongs, validateForm } from "@/utils/songUtils"; 
import { withCORS } from "@/utils/backendUtils";

// Helper function to filter songs
const filterSongs = (
  songs: Song[],
  selectedYear?: string | null,
  selectedMonth?: string | null,
  selectedDay?: string | null
): Song[] => {
  let parsedDay: string | null | undefined = selectedDay;
  if (selectedDay && selectedDay.includes(" ")) {
    const [day] = selectedDay.split(" ");
    parsedDay = day.padStart(2, "0");
  }

  return songs.filter((song) => {
    if (selectedYear && song.year !== selectedYear) return false;
    if (selectedMonth && song.month !== selectedMonth.padStart(2, "0")) return false;
    if (parsedDay && song.day !== parsedDay) return false;
    return true;
  });
};

// Helper function to group songs by date
const groupSongsByDate = (
  songs: Song[],
  selectedYear?: string | null,
  selectedMonth?: string | null
): { [key: string]: number } => {
  const data: { [key: string]: number } = {};

  songs.forEach((song) => {
    if (selectedYear && song.year !== selectedYear) return;
    if (selectedMonth && song.month !== selectedMonth.padStart(2, "0")) return;

    const key = `${song.year}-${song.month.padStart(2, "0")}-${song.day.padStart(2, "0")}`;
    if (!data[key]) {
      data[key] = 0;
    }
    data[key]++;
  });

  return data;
};

// GET: Fetch all songs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filterBy = searchParams.get("filterBy");
  const filterValue = searchParams.get("filterValue");
  const groupByDate = searchParams.get("groupByDate");

  let filteredSongs = [...songs]; 

  if (filterBy && filterValue) {
    filteredSongs = filterSongs(filteredSongs, filterBy, filterValue);
  }

  filteredSongs = sortSongs(filteredSongs);

  if (groupByDate === "true") {
    const groupedData = groupSongsByDate(filteredSongs);
    return withCORS(NextResponse.json(groupedData, { status: 200 }));
  }

  return withCORS(NextResponse.json(filteredSongs, { status: 200 }));
}

// POST: Add a new song
export async function POST(request: Request) {
  const newSong: Song = await request.json();

  const validationError = validateForm (newSong);
  if (validationError) {
    return withCORS(NextResponse.json({ error: validationError }, { status: 400 }));
  }

  newSong.id = Date.now();

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