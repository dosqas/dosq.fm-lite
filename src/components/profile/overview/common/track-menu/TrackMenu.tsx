import React from "react";
import "../../../../../styles/profile/overview/common/track-menu.css";

interface TrackMenuProps {
  formData: {
    title: string;
    artist: string;
    album: string;
    genre: string;
    hour: string;
    minute: string;
    day: string;
    month: string;
    year: string;
  };
  error: string | null;
  successMessage: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string; 
  submitButtonText: string;
}

const TrackMenu: React.FC<TrackMenuProps> = ({
  formData,
  error,
  successMessage,
  onClose,
  onSubmit,
  onInputChange,
  title,
  submitButtonText,
}) => {
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="track-menu" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h3 className="track-menu-title">{title}</h3>

        <form className="track-menu-form" onSubmit={onSubmit}>
          <label className="track-menu-label">
            Song Title:
            <input
              type="text"
              name="title"
              placeholder="Enter song title"
              value={formData.title}
              onChange={onInputChange}
            />
          </label>
          <label className="track-menu-label">
            Artist:
            <input
              type="text"
              name="artist"
              placeholder="Enter artist name"
              value={formData.artist}
              onChange={onInputChange}
            />
          </label>
          <label className="track-menu-label">
            Album:
            <input
              type="text"
              name="album"
              placeholder="Enter album name"
              value={formData.album}
              onChange={onInputChange}
            />
          </label>
          <label className="track-menu-label">
            Genre:
            <input
              type="text"
              name="genre"
              placeholder="Enter genre name"
              value={formData.genre}
              onChange={onInputChange}
            />
          </label>
          <div className="track-menu-row">
            <label className="track-menu-label">
              Hour:
              <input
                type="number"
                name="hour"
                placeholder="HH"
                min="0"
                max="23"
                value={formData.hour}
                onChange={onInputChange}
              />
            </label>
            <label className="track-menu-label">
              Minute:
              <input
                type="number"
                name="minute"
                placeholder="MM"
                min="0"
                max="59"
                value={formData.minute}
                onChange={onInputChange}
              />
            </label>
          </div>
          <div className="track-menu-row">
            <label className="track-menu-label">
              Day:
              <input
                type="number"
                name="day"
                placeholder="DD"
                min="1"
                max="31"
                value={formData.day}
                onChange={onInputChange}
              />
            </label>
            <label className="track-menu-label">
              Month:
              <input
                type="number"
                name="month"
                placeholder="MM"
                min="1"
                max="12"
                value={formData.month}
                onChange={onInputChange}
              />
            </label>
            <label className="track-menu-label">
              Year:
              <input
                type="number"
                name="year"
                placeholder="YYYY"
                min="1900"
                max="2100"
                value={formData.year}
                onChange={onInputChange}
              />
            </label>
          </div>

          {error && (
            <div className="error-message">
              <p className="error-text">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              <p className="success-text">{successMessage}</p>
            </div>
          )}

          <button type="submit" className="submit-track-button">
            {submitButtonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackMenu;