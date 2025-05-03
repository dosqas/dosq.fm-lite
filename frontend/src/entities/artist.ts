import { Song } from "@entities/song";

export interface Artist {
  artistId: number; // Corresponds to ArtistId in the C# model
  name: string; // Required
  songs?: Song[]; // Optional 1-to-Many relationship with Song
}