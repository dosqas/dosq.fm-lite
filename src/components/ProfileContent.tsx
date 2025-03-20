"use client";

import React, { useState } from "react";
import ProfileSongsCol from "./ProfileSongsCol";
import ProfileSidebar from "./ProfileSidebar";
import "../styles/profile-content.css";
import { formatDateListened, parseDateListened } from "../utils/dateUtils";
import { serialize } from "v8";
import { filterAndSortSongs } from "../utils/filterAndSortUtils";

const ProfileContent: React.FC = () => {
  const [songs, setSongs] = useState([
    {
      id: 1,
      albumCover: "/images/vinyl-icon.svg",
      title: "Song 1",
      artist: "Artist 1",
      album: "Album 1",
      genre: "Pop",
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 2,
      albumCover: "/images/vinyl-icon.svg",
      title: "Song 2",
      artist: "Artist 2",
      album: "Album 2",
      genre: "Rock",
      dateListened: "14:00, 02/01/2025",
    },
    {
      id: 6,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 6',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 7,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 7',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 8,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 8',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 9,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 9',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 10,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 10',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 11,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 11',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 12,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 12',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 13,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 13',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 14,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 14',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 15,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 15',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 16,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 16',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 17,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 17',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 18,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 18',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 19,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 19',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 20,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 20',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 21,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 21',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 22,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 22',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 23,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 23',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 24,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 24',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 25,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 25',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      dateListened: "12:30, 01/01/2025",
    },
  ]);

  const [songToEdit, setSongToEdit] = useState<{
    id: number;
    title: string;
    artist: string;
    album: string;
    genre: string;
    hour: string;
    minute: string;
    day: string;
    month: string;
    year: string;
  } | null>(null);

  const [sortCriteria, setSortCriteria] = useState<"title" | "artist" | "date" | "title">(
    "date"
  );
  const [filterGenre, setFilterGenre] = useState<string>("");
  const [filterAlbum, setFilterAlbum] = useState<string>("");
  const [filterArtist, setFilterArtist] = useState<string>("");
  const [filterTitle, setFilterTitle] = useState<string>("");

  const addSong = (newSong: {
    title: string;
    artist: string;
    album: string;
    genre: string;
    hour: string;
    minute: string;
    day: string;
    month: string;
    year: string;
  }) => {
    const formattedDate = formatDateListened(
      newSong.day,
      newSong.month,
      newSong.year,
      newSong.hour,
      newSong.minute
    );

    const newSongEntry = {
      id: songs.length + 1,
      albumCover: "/images/vinyl-icon.svg",
      title: newSong.title,
      artist: newSong.artist,
      album: newSong.album,
      genre: newSong.genre,
      dateListened: formattedDate,
    };

    setSongs([...songs, newSongEntry]);
  };

  const updateSong = (updatedSong: {
    id: number;
    title: string;
    artist: string;
    album: string;
    genre: string;
    hour: string;
    minute: string;
    day: string;
    month: string;
    year: string;
  }) => {
    const formattedDate = `${updatedSong.hour}:${updatedSong.minute}, ${updatedSong.day}/${updatedSong.month}/${updatedSong.year}`;

    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === updatedSong.id
          ? { ...song, ...updatedSong, dateListened: formattedDate }
          : song
      )
    );
    setSongToEdit(null);
  };

  const deleteSong = (id: number) => {
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
  };

  const handleEditSong = (id: number) => {
    const song = songs.find((song) => song.id === id);
    if (song) {
      const { hour, minute, day, month, year } = parseDateListened(
        song.dateListened
      );
      setSongToEdit({
        id: song.id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        genre: song.genre,
        hour,
        minute,
        day,
        month,
        year,
      });
    }
  };

  const sortedAndFilteredSongs = filterAndSortSongs(
    songs,
    filterTitle,
    filterArtist,
    filterAlbum,
    filterGenre,
    sortCriteria
  );

  return (
    <main className="profile-content">
      <p className="profile-content-title">Recent tracks</p>
      <div className="profile-content-controls" style={{ fontSize: "0.8rem" }}>
        <label>
          Sort by:
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value as "title" | "artist" | "date")}
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
          </select>
        </label>
        <label style={{ color: "white" }}>
          Filter by Genre:
          <input
            type="text"
            placeholder="Enter genre"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
          />
        </label>
        <label style={{ color: "white" }}>
          Filter by Album:
          <input
            type="text"
            placeholder="Enter album"
            value={filterAlbum}
            onChange={(e) => setFilterAlbum(e.target.value)}
          />
        </label>
        <label style={{ color: "white" }}>
          Filter by Artist:
          <input
            type="text"
            placeholder="Enter artist"
            value={filterArtist}
            onChange={(e) => setFilterArtist(e.target.value)}
          />
        </label>
        <label style={{ color: "white" }}>
          Filter by Title:
          <input
            type="text"
            placeholder="Enter Title"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
        </label>
      </div>
      <div className="profile-content-grid">
        <ProfileSongsCol
          songs={sortedAndFilteredSongs}
          onUpdateSong={handleEditSong}
          onDeleteSong={deleteSong}
        />
        <ProfileSidebar
          addSong={addSong}
          updateSong={updateSong}
          songToEdit={songToEdit}
          clearEdit={() => setSongToEdit(null)}
        />
      </div>
    </main>
  );
};

export default ProfileContent;