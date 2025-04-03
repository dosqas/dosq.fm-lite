import request from "supertest";
import express from "express";
import songsRouter from "../../../src/routes/songs/route";
import { songs, updateSongs } from "../../../src/data/songs";
import { filterSongs, sortSongs } from "../../../src/utils/songUtils";
import { validateForm } from "../../../../shared/utils/validation";

jest.mock("../../../src/data/songs", () => ({
  songs: [
    { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2023" },
    { id: 2, albumCover: '/images/vinyl-icon.svg', title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', hour: "12", minute: "30", day: "02", month: "01", year: "2025" },
  ],
  updateSongs: jest.fn(),
}));

jest.mock("../../../src/utils/songUtils", () => ({
  filterSongs: jest.fn(),
  validateForm: jest.fn(),
  sortSongs: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/songs", songsRouter);

describe("API Route: /api/songs", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET: Fetch all songs with filters", async () => {
    (filterSongs as jest.Mock).mockReturnValue([
      { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2025" },
    ]);

    const response = await request(app).get("/api/songs").query({ from: "2023-01-01", rangetype: "year" });

    expect(filterSongs).toHaveBeenCalledWith(songs, "2023-01-01", "year");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2025" },
    ]);
  });

  test("POST: Add a new song", async () => {
    (validateForm as jest.Mock).mockReturnValue(null);
    (sortSongs as jest.Mock).mockReturnValue([
      ...songs,
      { id: 3, albumCover: '/images/vinyl-icon.svg', title: 'Song 3', artist: 'Artist 3', album: 'Album 3', genre: 'Genre 3', hour: "12", minute: "30", day: "01", month: "01", year: "2024" },
    ]);

    const newSong = { id: 3, albumCover: '/images/vinyl-icon.svg', title: 'Song 3', artist: 'Artist 3', album: 'Album 3', genre: 'Genre 3', hour: "12", minute: "30", day: "01", month: "01", year: "2024" };
    const response = await request(app).post("/api/songs").send(newSong);

    expect(validateForm).toHaveBeenCalledWith(newSong);
    expect(sortSongs).toHaveBeenCalledWith([...songs, newSong]);
    expect(updateSongs).toHaveBeenCalledWith([
      ...songs,
      { id: 3, albumCover: '/images/vinyl-icon.svg', title: 'Song 3', artist: 'Artist 3', album: 'Album 3', genre: 'Genre 3', hour: "12", minute: "30", day: "01", month: "01", year: "2024" },
    ]);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newSong);
  });

  test("POST: Validation error", async () => {
    (validateForm as jest.Mock).mockReturnValue("Validation error");

    const invalidSong = { id: 3, albumCover: '/images/vinyl-icon.svg', title: '', artist: 'Artist 3', album: '', genre: 'Genre 3', hour: "12", minute: "30", day: "01", month: "01", year: "2024" };
    const response = await request(app).post("/api/songs").send(invalidSong);

    expect(validateForm).toHaveBeenCalledWith(invalidSong);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Validation error" });
  });

  test("OPTIONS: CORS preflight", async () => {
    const response = await request(app).options("/api/songs");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["access-control-allow-methods"]).toBe("GET, POST, PUT, DELETE, OPTIONS");
    expect(response.headers["access-control-allow-headers"]).toBe("Content-Type, Authorization");
  });
});