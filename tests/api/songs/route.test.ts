import { GET, POST, OPTIONS } from "../../../src/app/api/songs/route";
import { songs, updateSongs } from "../../../src/data/songs";
import { filterSongs, validateForm, sortSongs } from "../../../src/utils/songUtils";

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

describe("API Route: /api/songs", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET: Fetch all songs with filters", async () => {
    (filterSongs as jest.Mock).mockReturnValue([
      { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2025" },
    ]);

    const request = new Request("http://localhost/api/songs?from=2023-01-01&rangetype=year");
    const response = await GET(request);

    expect(filterSongs).toHaveBeenCalledWith(songs, "2023-01-01", "year");
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual([
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
    const request = new Request("http://localhost/api/songs", {
      method: "POST",
      body: JSON.stringify(newSong),
    });

    const response = await POST(request);

    expect(validateForm).toHaveBeenCalledWith(newSong);
    expect(sortSongs).toHaveBeenCalledWith([...songs, newSong]);
    expect(updateSongs).toHaveBeenCalledWith([
      ...songs,
      { id: 3, albumCover: '/images/vinyl-icon.svg', title: 'Song 3', artist: 'Artist 3', album: 'Album 3', genre: 'Genre 3', hour: "12", minute: "30", day: "01", month: "01", year: "2024" },
    ]);
    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json).toEqual(newSong);
  });

  test("POST: Validation error", async () => {
    (validateForm as jest.Mock).mockReturnValue("Validation error");

    const invalidSong = { id: 3, albumCover: '/images/vinyl-icon.svg', title: '', artist: 'Artist 3', album: '', genre: 'Genre 3', hour: "12", minute: "30", day: "01", month: "01", year: "2024" };    ;
    const request = new Request("http://localhost/api/songs", {
      method: "POST",
      body: JSON.stringify(invalidSong),
    });

    const response = await POST(request);

    expect(validateForm).toHaveBeenCalledWith(invalidSong);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toEqual({ error: "Validation error" });
  });

  test("OPTIONS: CORS preflight", async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET, POST, PUT, DELETE, OPTIONS");
    expect(response.headers.get("Access-Control-Allow-Headers")).toBe("Content-Type, Authorization");
  });
});