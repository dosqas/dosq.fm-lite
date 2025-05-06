import { Song } from "@entities/song";

export interface Artist {
  artistId: number; // Corresponds to ArtistId in the C# model
  name: string; // Required
  songCount?: number; 
}