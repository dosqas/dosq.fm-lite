import React from 'react';
import Image from 'next/image';
import "../styles/song-card.css";

interface SongCardProps {
  albumCover: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  dateListened: string;
}

const SongCard: React.FC<SongCardProps> = ({ albumCover, title, artist, album, genre, dateListened  }) => {
  return (
    <div className="song-card">
      <Image className="song-card-image" src={albumCover} alt={`${title} album cover`} width="30" height="30" />
      <div className="song-card-info">
        <p className="song-card-title">{title}</p>
        <p className="song-card-album">{album}</p>
        <p className="song-card-genre">{genre}</p>
        <p className="song-card-artist">{artist}</p>
        <p className="song-card-dateListened">{dateListened}</p>
      </div>
    </div>
  );
};

export default SongCard;