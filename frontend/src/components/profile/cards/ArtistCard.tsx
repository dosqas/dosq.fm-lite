import React from "react";
import "@styles/artist-card.css";

interface ArtistCardProps {
  name: string; // Artist's name
  listenCount: number; // Number of times the user listened to this artist
  onModify: () => void; // Function to modify the artist
  onDelete: () => void; // Function to delete the artist
  isMenuOpen: boolean; // Whether the menu is open
  onMenuToggle: () => void; // Function to toggle the menu
  onMenuClose: () => void; // Function to close the menu
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  name,
  listenCount,
  onModify,
  onDelete,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}) => {
  return (
    <div className="artist-card" data-testid="artist-card">
      <div className="artist-card-content">
        <div className="artist-card-info">
          <span className="artist-card-name">{name}</span>
          <span className="artist-card-listen-count">{listenCount} listens</span>
        </div>
        <button
          className="artist-card-kebab-menu"
          onClick={onMenuToggle}
          aria-label="Options"
        >
          &#x22EE;
        </button>
      </div>
      {isMenuOpen && (
        <div className="artist-card-menu-overlay">
          <button
            className="artist-card-menu-button"
            onClick={() => {
              onModify();
              onMenuClose();
            }}
          >
            Modify
          </button>
          <button
            className="artist-card-menu-button"
            onClick={() => {
              onDelete();
              onMenuClose();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtistCard;