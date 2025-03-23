import {
    addSong,
    updateSong,
    deleteSong,
    filterSongs,
    groupSongsByDate,
    assignHrColor,
    sortSongs,
    Song,
  } from "../src/utils/crudUtils";
  
  describe("crudUtils", () => {
    const mockSongs: Song[] = [
      { id: 1, albumCover: "", title: "Song 1", artist: "Artist 1", album: "Album 1", genre: "Genre 1", year: "2025", month: "01", day: "01", hour: "12", minute: "30" },
      { id: 2, albumCover: "", title: "Song 2", artist: "Artist 2", album: "Album 2", genre: "Genre 2", year: "2024", month: "01", day: "02", hour: "14", minute: "00" },
      { id: 3, albumCover: "", title: "Song 3", artist: "Artist 3", album: "Album 3", genre: "Genre 3", year: "2023", month: "02", day: "03", hour: "16", minute: "15" },
    ];
  
    test("should add a new song and sort the list", () => {
      const newSong: Song = { id: 4, albumCover: "", title: "Song 4", artist: "Artist 4", album: "Album 4", genre: "Genre 4", year: "2026", month: "03", day: "04", hour: "10", minute: "20" };
      const updatedSongs = addSong(mockSongs, newSong);
  
      expect(updatedSongs.length).toBe(4);
      expect(updatedSongs[0].id).toBe(4);
    });
  
    test("should update an existing song", () => {
      const updatedSongs = updateSong(mockSongs, 1, { title: "Updated Song 1" });
  
      expect(updatedSongs[0].title).toBe("Updated Song 1");
      expect(updatedSongs[1].title).toBe("Song 2");
    });
  
    test("should delete a song", () => {
      const updatedSongs = deleteSong(mockSongs, 1);
  
      expect(updatedSongs.length).toBe(2);
      expect(updatedSongs.find((song) => song.id === 1)).toBeUndefined();
    });
  
    test("should filter songs by year, month, and day", () => {
      const filteredByYear = filterSongs(mockSongs, "2025");
      expect(filteredByYear.length).toBe(1);
  
      const filteredByYearAndMonth = filterSongs(mockSongs, "2024", "01");
      expect(filteredByYearAndMonth.length).toBe(1);
  
      const filteredByYearMonthDay = filterSongs(mockSongs, "2023", "02", "03");
      expect(filteredByYearMonthDay.length).toBe(1);
    });
  
    test("should group songs by year, month, and day", () => {
      const groupedByYear = groupSongsByDate(mockSongs);
      expect(groupedByYear).toEqual({ "2025": 1, "2024": 1, "2023": 1 });
  
      const groupedByMonth = groupSongsByDate(mockSongs, "2023");
      expect(groupedByMonth).toEqual({ "02": 1 });
  
      const groupedByDay = groupSongsByDate(mockSongs, "2023", "02");
      expect(groupedByDay).toEqual({ "03": 1 });
    });
  
    test("should assign correct hrColor based on index", () => {
      const total = 9;
  
      expect(assignHrColor(0, total)).toBe("green"); // Top 33%
      expect(assignHrColor(3, total)).toBe("orange"); // Middle 33%
      expect(assignHrColor(6, total)).toBe("red"); // Bottom 33%
    });
  
    test("should sort songs by date in descending order", () => {
      const sortedSongs = sortSongs(mockSongs);
  
      expect(sortedSongs[0].year).toBe("2025");
      expect(sortedSongs[1].year).toBe("2024");
      expect(sortedSongs[2].year).toBe("2023");
    });
  });