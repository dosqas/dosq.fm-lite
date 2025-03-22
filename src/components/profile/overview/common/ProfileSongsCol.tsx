import React, { useState, forwardRef, useImperativeHandle } from "react";
import SongCard from "./SongCard";
import UpdateTrackMenu from "./track-menu/UpdateTrackMenu";
import AddTrackMenu from "./track-menu/AddTrackMenu";
import { validateForm } from "../../../../utils/formUtils";
import "../../../../styles/profile/overview/common/profile-songs-col.css";

interface Song {
  id: number;
  albumCover: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  hour: string;
  minute: string;
  day: string;
  month: string;
  year: string;
}

export interface ProfileSongsColHandle {
  openAddMenu: () => void;
}

const ProfileSongsCol = forwardRef<ProfileSongsColHandle>((_, ref) => {
  const [songs, setSongs] = useState<Song[]>([
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
      year: "2025",
    },
    {
      id: 2,
      albumCover: "/images/vinyl-icon.svg",
      title: "Song 2",
      artist: "Artist 1",
      album: "Album 1",
      genre: "Genre 1",
      hour: "14",
      minute: "00",
      day: "02",
      month: "01",
      year: "2025",
    },
    {
      id: 3,
      albumCover: "/images/vinyl-icon.svg",
      title: "Song 3",
      artist: "Artist 1",
      album: "Album 1",
      genre: "Genre 1",
      hour: "14",
      minute: "00",
      day: "02",
      month: "01",
      year: "2025",
    },
    {
      id: 4,
      albumCover: "/images/vinyl-icon.svg",
      title: "Song 4",
      artist: "Artist 1",
      album: "Album 1",
      genre: "Genre 1",
      hour: "14",
      minute: "00",
      day: "02",
      month: "01",
      year: "2025",
    },
    {
      id: 5,
      albumCover: "/images/vinyl-icon.svg",
      title: "Song 5",
      artist: "Artist 1",
      album: "Album 1",
      genre: "Genre 1",
      hour: "14",
      minute: "00",
      day: "02",
      month: "01",
      year: "2025",
    },
    {
      id: 6,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 6',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 7,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 7',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 8,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 8',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 9,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 9',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 10,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 10',
      artist: 'Artist 2',
      album: 'Album 2',
      genre: 'Genre 2',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 11,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 11',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 12,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 12',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 13,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 13',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 14,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 14',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 15,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 15',
      artist: 'Artist 3',
      album: 'Album 3',
      genre: 'Genre 3',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 16,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 16',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 17,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 17',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 18,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 18',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 19,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 19',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 20,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 20',
      artist: 'Artist 4',
      album: 'Album 4',
      genre: 'Genre 4',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 21,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 21',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 22,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 22',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 23,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 23',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 24,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 24',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
    {
      id: 25,
      albumCover: '/images/vinyl-icon.svg',
      title: 'Song 25',
      artist: 'Artist 5',
      album: 'Album 5',
      genre: 'Genre 5',
      hour: "12",
      minute: "30",
      day: "01",
      month: "01",
      year: "2025",
    },
  ]);

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isUpdateMenuOpen, setIsUpdateMenuOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const [formData, setFormData] = useState<Song>({
    id: 0,
    albumCover: "/images/vinyl-icon.svg",
    title: "",
    artist: "",
    album: "",
    genre: "",
    hour: "",
    minute: "",
    day: "",
    month: "",
    year: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    openAddMenu: handleOpenAddMenu,
  }));

  const handleOpenAddMenu = () => {
    setFormData({
      id: 0,
      albumCover: "/images/vinyl-icon.svg",
      title: "",
      artist: "",
      album: "",
      genre: "",
      hour: "",
      minute: "",
      day: "",
      month: "",
      year: "",
    });
    setError(null);
    setSuccessMessage(null);
    setIsAddMenuOpen(true);
  };

  const handleCloseAddMenu = () => {
    setIsAddMenuOpen(false);
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = validateForm(formData);

    if (validationResult) {
      setError(validationResult);
      return;
    }

    setSongs((prevSongs) => [
      ...prevSongs,
      { ...formData, id: Date.now() },
    ]);
    setSuccessMessage("Track added successfully!");
    setError(null);
  };

  const handleOpenUpdateMenu = (song: Song) => {
    setSelectedSong(song);
    setError(null);
    setSuccessMessage(null);
    setIsUpdateMenuOpen(true);
  };

  const handleCloseUpdateMenu = () => {
    setSelectedSong(null);
    setIsUpdateMenuOpen(false);
  };

  const handleUpdateSong = (id: number, updatedSong: Partial<Song>) => {
    const validationResult = validateForm(updatedSong as Song);

    if (validationResult) {
      setError(validationResult);
      return;
    }

    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === id ? { ...song, ...updatedSong } : song
      )
    );
    handleCloseUpdateMenu();
  };

  const handleDeleteSong = (id: number) => {
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
  };

  return (
    <div className="profile-songs-col">

      {songs.map((song) => (
        <SongCard
          key={song.id}
          albumCover={song.albumCover}
          title={song.title}
          artist={song.artist}
          album={song.album}
          genre={song.genre}
          dateListened={`${song.hour}:${song.minute}, ${song.day}/${song.month}/${song.year}`}
          onUpdate={() => handleOpenUpdateMenu(song)}
          onDelete={() => handleDeleteSong(song.id)}
        />
      ))}

      {isAddMenuOpen && (
        <AddTrackMenu
          formData={formData}
          error={error}
          successMessage={successMessage}
          onClose={handleCloseAddMenu}
          onSubmit={handleAddSong}
          onInputChange={(e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
          }}
        />
      )}

      {isUpdateMenuOpen && selectedSong && (
        <UpdateTrackMenu
          song={selectedSong}
          error={error}
          successMessage={successMessage}
          onClose={handleCloseUpdateMenu}
          onSubmit={(updatedSong) =>
            handleUpdateSong(selectedSong.id, updatedSong)
          }
        />
      )}
    </div>
  );
});

export default ProfileSongsCol;