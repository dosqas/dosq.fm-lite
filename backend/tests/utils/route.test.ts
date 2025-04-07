import { groupSongs } from "../../src/utils/songUtils";
import { sortSongs, filterSongs } from "@shared/utils/filterAndSort";
import { Song } from "@shared/types/song";

describe("Utils: songUtils", () => {
  describe("sortSongs", () => {
    test("should sort songs by date in descending order", () => {
      const songs: Song[] = [
        {
          id: 1,
          albumCover: "/images/vinyl-icon.svg",
          title: "Song 1",
          artist: "Artist 1",
          album: "Album 1",
          genre: "Genre 1",
          hour: "12",
          minute: "30",
          day: "01",
          month: "01",
          year: "2023",
        },
        {
          id: 2,
          albumCover: "/images/vinyl-icon.svg",
          title: "Song 2",
          artist: "Artist 2",
          album: "Album 2",
          genre: "Genre 2",
          hour: "14",
          minute: "15",
          day: "02",
          month: "01",
          year: "2025",
        },
      ];

      const sortedSongs = sortSongs(songs);

      expect(sortedSongs[0].id).toBe(2); 
      expect(sortedSongs[1].id).toBe(1); 
    });
  });

  describe("filterSongs", () => {
    const songs: Song[] = [
      {
        id: 1,
        albumCover: "/images/vinyl-icon.svg",
        title: "Song 1",
        artist: "Artist 1",
        album: "Album 1",
        genre: "Genre 1",
        hour: "12",
        minute: "30",
        day: "01",
        month: "01",
        year: "2023",
      },
      {
        id: 2,
        albumCover: "/images/vinyl-icon.svg",
        title: "Song 2",
        artist: "Artist 2",
        album: "Album 2",
        genre: "Genre 2",
        hour: "14",
        minute: "15",
        day: "02",
        month: "01",
        year: "2025",
      },
    ];

    test("should return all songs when no filter is applied", () => {
      const filteredSongs = filterSongs(songs, null, "all");
      expect(filteredSongs).toEqual(songs);
    });

    test("should filter songs by year", () => {
      const filteredSongs = filterSongs(songs, "2023-01-01", "year");
      expect(filteredSongs).toEqual([songs[0]]);
    });

    test("should filter songs by month", () => {
      const filteredSongs = filterSongs(songs, "2025-01-01", "1month");
      expect(filteredSongs).toEqual([songs[1]]);
    });

    test("should filter songs by day", () => {
      const filteredSongs = filterSongs(songs, "2025-01-02", "1day");
      expect(filteredSongs).toEqual([songs[1]]);
    });

    test("should return no songs if no match is found", () => {
      const filteredSongs = filterSongs(songs, "2020-01-01", "year");
      expect(filteredSongs).toEqual([]);
    });
  });

  describe("groupSongs", () => {
    const songs: Song[] = [
      {
        id: 1,
        albumCover: "/images/vinyl-icon.svg",
        title: "Song 1",
        artist: "Artist 1",
        album: "Album 1",
        genre: "Genre 1",
        hour: "12",
        minute: "30",
        day: "01",
        month: "01",
        year: "2023",
      },
      {
        id: 2,
        albumCover: "/images/vinyl-icon.svg",
        title: "Song 2",
        artist: "Artist 2",
        album: "Album 2",
        genre: "Genre 2",
        hour: "14",
        minute: "15",
        day: "02",
        month: "01",
        year: "2023",
      },
    ];

    test("should group songs by year", () => {
      const grouped = groupSongs(songs, "all");
      expect(grouped).toEqual({ "2023": 2 });
    });

    test("should group songs by month", () => {
      const grouped = groupSongs(songs, "year");
      expect(grouped).toEqual({ "01": 2 });
    });

    test("should group songs by day", () => {
      const grouped = groupSongs(songs, "1month");
      expect(grouped).toEqual({ "01": 1, "02": 1 });
    });

    test("should group songs by hour", () => {
      const grouped = groupSongs(songs, "1day");
      expect(grouped).toEqual({ "12:30": 1, "14:15": 1 });
    });
  });
});