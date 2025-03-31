import { PUT, DELETE} from "../../../../src/app/api/songs/[id]/route";
import { songs, updateSongs } from "../../../../src/data/songs";
import { filterSongs, validateForm, sortSongs } from "../../../../src/utils/songUtils";

jest.mock("../../../../src/data/songs", () => ({
  songs: [
    { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2023" },
    { id: 2, albumCover: '/images/vinyl-icon.svg', title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', hour: "12", minute: "30", day: "02", month: "01", year: "2025" },
  ],
  updateSongs: jest.fn(),
}));

jest.mock("../../../../src/utils/songUtils", () => ({
  filterSongs: jest.fn(),
  validateForm: jest.fn(),
  sortSongs: jest.fn(),
}));

describe("API Route: /api/songs", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("PUT: Update a song by ID", async () => {
    (validateForm as jest.Mock).mockReturnValue(null);
    (sortSongs as jest.Mock).mockReturnValue([
      { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Updated Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2023" },
      { id: 2, albumCover: '/images/vinyl-icon.svg', title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', hour: "12", minute: "30", day: "02", month: "01", year: "2025" },
    ]);

    const updatedSong = { title: "Updated Song 1" };
    const request = new Request("http://localhost/api/songs/1", {
      method: "PUT",
      body: JSON.stringify(updatedSong),
    });

    const response = await PUT(request, { params: { id: "1" } });

    expect(validateForm).toHaveBeenCalledWith(updatedSong);
    expect(sortSongs).toHaveBeenCalledWith([
      { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Updated Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2023" },
      { id: 2, albumCover: '/images/vinyl-icon.svg', title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', hour: "12", minute: "30", day: "02", month: "01", year: "2025" },
    ]);
    expect(updateSongs).toHaveBeenCalledWith([
      { id: 1, albumCover: '/images/vinyl-icon.svg', title: 'Updated Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', hour: "12", minute: "30", day: "01", month: "01", year: "2023" },
      { id: 2, albumCover: '/images/vinyl-icon.svg', title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', hour: "12", minute: "30", day: "02", month: "01", year: "2025" },
    ]);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual({
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
    const request = new Request("http://localhost/api/songs/1", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params: { id: "1" } });

    expect(updateSongs).toHaveBeenCalledWith([
      { id: 2, albumCover: '/images/vinyl-icon.svg', title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', hour: "12", minute: "30", day: "02", month: "01", year: "2025" },
    ]);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual({ message: "Deleted successfully" });
  });

  test("PUT: Song not found", async () => {
    const request = new Request("http://localhost/api/songs/999", {
      method: "PUT",
      body: JSON.stringify({ title: "Non-existent Song" }),
    });

    const response = await PUT(request, { params: { id: "999" } });

    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json).toEqual({ error: "Song not found" });
  });

  test("DELETE: Song not found", async () => {
    const request = new Request("http://localhost/api/songs/999", {
      method: "DELETE",
    });

    const response = await DELETE(request, { params: { id: "999" } });

    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json).toEqual({ error: "Song not found" });
  });
});