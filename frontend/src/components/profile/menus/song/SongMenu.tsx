import React from "react";
import "@styles/profile/overview/common/song-menu.css";

interface SongMenuProps {
  formData: {
    title: string;
    album: string;
    dateListened: string; // ISO string for the date
    timeListened: string; // Time in HH:mm format
    artistId: string; // Artist ID as a string
  };
  error: string | null;
  successMessage: string | null;
  onClose: () => void;
  onSubmit: (formData: any) => void; // Updated to pass combined data
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  title: string;
  submitButtonText: string;
  artists: { id: number; name: string }[]; // List of available artists
}

const SongMenu: React.FC<SongMenuProps> = ({
  formData,
  error,
  successMessage,
  onClose,
  onSubmit,
  onInputChange,
  title,
  submitButtonText,
  artists,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time into an ISO 8601 string
    const combinedDateTime = `${formData.dateListened}T${formData.timeListened}:00Z`;

    const updatedFormData = {
      ...formData,
      dateListened: combinedDateTime, // Replace with combined date and time
    };

    onSubmit(updatedFormData); // Pass the updated form data to the parent
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="song-menu" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h3 className="song-menu-title">{title}</h3>

        <form className="song-menu-form" onSubmit={handleSubmit}>
          <label className="song-menu-label">
            Song Title:
            <input
              type="text"
              name="title"
              placeholder="Enter song title"
              value={formData.title}
              onChange={onInputChange}
            />
          </label>
          <label className="song-menu-label">
            Album:
            <input
              type="text"
              name="album"
              placeholder="Enter album name"
              value={formData.album}
              onChange={onInputChange}
            />
          </label>
          <label className="song-menu-label">
            Date Listened:
            <input
              type="date"
              name="dateListened"
              value={formData.dateListened}
              onChange={onInputChange}
            />
          </label>
          <label className="song-menu-label">
            Time Listened:
            <input
              type="time"
              name="timeListened"
              value={formData.timeListened}
              onChange={onInputChange}
            />
          </label>
          <label className="song-menu-label">
            Artist:
            <select
              name="artistId"
              value={formData.artistId}
              onChange={onInputChange}
              className="artist-dropdown"
            >
              <option value="">Select an artist</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </label>

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

          <button type="submit" className="submit-song-button">
            {submitButtonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SongMenu;