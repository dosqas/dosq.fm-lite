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

const SongCard: React.FC<SongCardProps> = ({ albumCover, title, artist, album, genre, dateListened }) => {
  return (
    <div className="song-card">
        <div className="song-card-content">
            <Image
            className="song-card-image"
            src={albumCover}
            alt={`${title} album cover`}
            width="50"
            height="50"
            />
            <div className="song-card-grid">
            <span className="song-card-title">{title}</span>
            <span className="song-card-album">{album}</span>
            <span className="song-card-artist">{artist}</span>
            <span className="song-card-genre">{genre}</span>
            <span className="song-card-dateListened">{dateListened}</span>
            </div>
        </div>
      <hr className="song-card-dividing-line" />
    </div>
  );
};

export default SongCard;