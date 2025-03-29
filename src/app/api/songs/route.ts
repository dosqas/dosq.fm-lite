import { NextResponse } from "next/server";

let songs: Song[] = [];

// Helper function to validate song data
const validateSong = (song: Song) => {
  const requiredFields = ["title", "artist", "album", "genre", "year", "month", "day", "hour", "minute"];
  for (const field of requiredFields) {
    if (!song[field as keyof Song]) {
      return `Field '${field}' is required.`;
    }
  }
  return null;
};

export async function GET() {
  const songs = [
    { id: 1, title: "Donuts (Outro)", album: "Donuts", artist: "J Dilla", genre: "Hip-Hop" },
    { id: 2, title: "Workinonit", album: "Donuts", artist: "J Dilla", genre: "Hip-Hop" },
    { id: 3, title: "Waves", album: "Donuts", artist: "J Dilla", genre: "Hip-Hop" },
    { id: 4, title: "Light It", album: "Donuts", artist: "J Dilla", genre: "Hip-Hop" },
    { id: 5, title: "The New", album: "Donuts", artist: "J Dilla", genre: "Hip-Hop" },
    { id: 6, title: "Stop", album: "Donuts", artist: "J Dilla", genre: "Hip-Hop" },
    { id: 7, title: "People", album: "Donuts", artist: "J Dilla", genre: "Hip-Hop" },
    { id: 8, title: "The Diff'rence", album: "Donuts", artist: "J Dilla", genre: "Hip-Hop" },
    { id: 9, title: "Mash", album: "Donuts", artist: "J Dilla", genre: "Hip-Hop" }
  ];

  return NextResponse.json(songs, { status: 200 });
}
