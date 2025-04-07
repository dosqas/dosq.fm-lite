import request from "supertest";
import "jest";
import express from "express";
import songRouter from "../../../../src/routes/songs/[id]/route";
import { songs, updateSongs } from "../../../../src/data/songs";
import { sortSongs } from "@shared/utils/filterAndSort";

import { validateForm } from "../../../../../shared/utils/validation";

jest.mock("../../../../src/data/songs", () => ({
  songs: [
    { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2023" },
    { id: 2, albumCover: '/images/vinyl-icon.svg', title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', hour: "12", minute: "30", day: "02", month: "01", year: "2025" },
  ],
  updateSongs: jest.fn(),
}));

jest.mock("../../../../src/utils/songUtils", () => ({
  validateForm: jest.fn(),
  sortSongs: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/songs", songRouter);

describe("API Route: /api/songs/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("PATCH: Update a song by ID", async () => {
    (validateForm as jest.Mock).mockReturnValue(null);
    (sortSongs as jest.Mock).mockReturnValue([
      { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Updated Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2023" },
      { id: 2, albumCover: '/images/vinyl-icon.svg', title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', hour: "12", minute: "30", day: "02", month: "01", year: "2025" },
    ]);

    const partialUpdate = { title: "Updated Song 1" };
    const response = await request(app)
      .patch("/api/songs/1")
      .send(partialUpdate);

    expect(validateForm).toHaveBeenCalledWith({
      id: 1,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Updated Song 1',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2023",
    });
    expect(sortSongs).toHaveBeenCalled();
    expect(updateSongs).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Updated Song 1',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2023",
    });
  });

  test("DELETE: Delete a song by ID", async () => {
    const response = await request(app).delete("/api/songs/1");

    expect(updateSongs).toHaveBeenCalledWith([
      { id: 2, albumCover: '/images/vinyl-icon.svg', title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', hour: "12", minute: "30", day: "02", month: "01", year: "2025" },
    ]);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Deleted successfully" });
  });

  test("PATCH: Song not found", async () => {
    const response = await request(app)
      .patch("/api/songs/999")
      .send({ title: "Non-existent Song" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Song not found" });
  });

  test("DELETE: Song not found", async () => {
    const response = await request(app).delete("/api/songs/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Song not found" });
  });
});