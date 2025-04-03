import React from "react";
import Image from "next/image";
import "../../../../styles/profile/overview/common/song-card.css";

interface SongCardProps {
  albumCover: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  dateListened: string;
  onUpdate: () => void; 
  onDelete: () => void; 
  hrColor?: string;
  isMenuOpen: boolean; // Whether the menu is open
  onMenuToggle: () => void; // Function to toggle the menu
  onMenuClose: () => void; // Function to close the menu
}

const SongCard: React.FC<SongCardProps> = ({
  albumCover,
  title,
  artist,
  album,
  genre,
  dateListened,
  onUpdate,
  onDelete,
  hrColor,
  isMenuOpen, // Whether the menu is open
  onMenuToggle, // Function to toggle the menu
  onMenuClose, // Function to close the menu
}) => {

  return (
    <div className="song-card" style = {{ color: `${hrColor || "transparent"}`}} data-testid="song-card">
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
          <button
            className="song-card-kebab-menu"
            onClick={onMenuToggle}
            aria-label="Options"
          >
            &#x22EE;
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="song-card-menu-overlay">
          <button
            className="song-card-menu-button"
            onClick={() => {
              onUpdate(); 
              onMenuClose(); 
            }}
          >
            Modify
          </button>
          <button
            className="song-card-menu-button"
            onClick={() => {
              onDelete(); 
              onMenuClose();
            }}
          >
            Delete
          </button>
        </div>
      )}
      <hr className="song-card-dividing-line" />
    </div>
  );
};

export default SongCard;