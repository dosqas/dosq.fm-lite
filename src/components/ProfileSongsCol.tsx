import React, { useState } from "react";
import SongCard from "./SongCard";
import "../styles/profile-songs-col.css";

interface ProfileSongsColProps {
  songs: {
    id: number;
    albumCover: string;
    title: string;
    artist: string;
    album: string;
    genre: string;
    dateListened: string;
  }[];
  onUpdateSong: (id: number) => void;
  onDeleteSong: (id: number) => void;
}

const ProfileSongsCol: React.FC<ProfileSongsColProps> = ({
  songs,
  onUpdateSong,
  onDeleteSong,
}) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleToggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
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
          dateListened={song.dateListened}
          isMenuOpen={openMenuId === song.id}
          onToggleMenu={() => handleToggleMenu(song.id)}
          onUpdate={() => onUpdateSong(song.id)}
          onDelete={() => onDeleteSong(song.id)}
        />
      ))}
    </div>
  );
};

export default ProfileSongsCol;