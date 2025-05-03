import { Artist } from "@entities/artist";
import { User } from "@entities/user";

export interface Song {
  songId: number; // Corresponds to SongId in the C# model
  title: string; // Required
  album: string; // Required
  dateListened: string; // ISO 8601 string (e.g., "2025-05-04T00:00:00Z")
  artistId: number; // Foreign key for Artist
  artist: Artist; // Required
  userId: number; // Foreign key for User
  user: User; // Required
}