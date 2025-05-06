import { Artist } from "@entities/artist";

export interface Song {
  songId: number; // Corresponds to SongId in the C# model
  title: string; // Required
  album: string; // Required
  dateListened: string; // ISO 8601 string (e.g., "2025-05-04T00:00:00Z")
  timeListened?: string; // Time in HH:mm format (e.g., "14:30")
  artist: Partial<Artist>; // Use Partial to include only necessary fields
  userId?: number;
}