import { filterAndSortSongs } from "../src/utils/filterAndSortUtils";

describe("filterAndSortSongs", () => {
  const songs = [
    {
      id: 1,
      albumCover: "/images/vinyl-icon.svg",
      title: "Song A",
      artist: "Artist 1",
      album: "Album 1",
      genre: "Pop",
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 2,
      albumCover: "/images/vinyl-icon.svg",
      title: "Song B",
      artist: "Artist 2",
      album: "Album 2",
      genre: "Rock",
      dateListened: "14:00, 02/01/2025",
    },
    {
      id: 3,
      albumCover: "/images/vinyl-icon.svg",
      title: "Another Song",
      artist: "Artist 3",
      album: "Album 3",
      genre: "Jazz",
      dateListened: "10:00, 03/01/2025",
    },
  ];

  it("sorts songs by date", () => {
    const sortedSongs = filterAndSortSongs(
      songs,
      "", // No title filter
      "", // No artist filter
      "", // No album filter
      "", // No genre filter
      "date" // Sort by date
    );

    expect(sortedSongs).toEqual([
      {
        id: 3,
        title: "Another Song",
        artist: "Artist 3",
        album: "Album 3",
        genre: "Jazz",
        dateListened: "10:00, 03/01/2025",
        albumCover: "/images/vinyl-icon.svg",
      },
      {
        id: 2,
        title: "Song B",
        artist: "Artist 2",
        album: "Album 2",
        genre: "Rock",
        dateListened: "14:00, 02/01/2025",
        albumCover: "/images/vinyl-icon.svg", 
      },
      {
        id: 1,
        title: "Song A",
        artist: "Artist 1",
        album: "Album 1",
        genre: "Pop",
        dateListened: "12:30, 01/01/2025",
        albumCover: "/images/vinyl-icon.svg", 
      },
    ]);
  });
});