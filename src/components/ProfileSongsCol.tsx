import React from 'react';
import SongCard from './SongCard';
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
}

const ProfileSongsCol: React.FC<ProfileSongsColProps> = ({ songs }) => {
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
        />
      ))}
    </div>
  );
};

export default ProfileSongsCol;