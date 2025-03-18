"use client";

import React, { useState } from "react";
import ProfileSongsCol from "./ProfileSongsCol";
import ProfileSidebar from "./ProfileSidebar";
import "../styles/profile-content.css";
import { formatDateListened, parseDateListened } from "../utils/dateUtils";

const ProfileContent: React.FC = () => {
  const [songs, setSongs] = useState([
    {
      id: 1,
      albumCover: "/images/vinyl-icon.svg",
      title: "Song 1",
      artist: "Artist 1",
      album: "Album 1",
      genre: "Genre 1",
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 2,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 2',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 3,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 3',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 4,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 4',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      dateListened: "12:30, 01/01/2025",
    },
    {
      id: 5,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 5',
      artist: 'Artist 1',
      album: 'Album 1',
      genre: 'Genre 1',
      dateListened: "12:30, 01/01/2025",
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
      const { hour, minute, day, month, year } = parseDateListened(song.dateListened);
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

  return (
    <main className="profile-content">
      <p className="profile-content-title">Recent tracks</p>
      <div className="profile-content-grid">
        <ProfileSongsCol
          songs={songs}
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