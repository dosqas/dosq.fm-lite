import { Song } from "@entities/song";

export interface User {
  userId: number; // Corresponds to UserId in the C# model
  username: string; // Required
  passwordHash: string; // Required, hashed password
  role: "User" | "Admin"; // Enum-like role, either "User" or "Admin"
  profileVideoPath?: string; // Optional profile video path
  songs: Song[]; // 1-to-Many relationship with Song
}