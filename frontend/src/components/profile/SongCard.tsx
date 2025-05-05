import React from "react";
import Image from "next/image";
import "@styles/profile/overview/common/song-card.css";

interface SongCardProps {
  title: string;
  artist: string; // Artist's name
  album: string;
  dateListened: string; // ISO string for the date
  onUpdate: () => void;
  onDelete: () => void;
  hrColor?: string;
  isMenuOpen: boolean; // Whether the menu is open
  onMenuToggle: () => void; // Function to toggle the menu
  onMenuClose: () => void; // Function to close the menu
}

const SongCard: React.FC<SongCardProps> = ({
  title,
  artist,
  album,
  dateListened,
  onUpdate,
  onDelete,
  hrColor,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}) => {
  // Format the date
  const date = new Date(dateListened);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g., "Dec"
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const formattedHours = hours < 10 ? `\u00A0\u00A0${hours}` : hours; // Add a space if the hour is a single digit
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  const formattedDate = `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;

  return (
    <div
      className="song-card"
      style={{ color: `${hrColor || "transparent"}` }}
      data-testid="song-card"
    >
      <div className="song-card-content">
        <Image
          className="song-card-image"
          src="/images/vinyl-icon.svg" // Default album cover
          alt={`${title} album cover`}
          width="50"
          height="50"
        />
        <div className="song-card-grid">
          <span className="song-card-title">{title}</span>
          <span className="song-card-album">{album}</span>
          <span className="song-card-artist">{artist}</span>
          <span className="song-card-dateListened">{formattedDate}</span>
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