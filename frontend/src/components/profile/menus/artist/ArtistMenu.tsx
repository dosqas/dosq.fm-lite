import React from "react";
import "@styles/profile/overview/common/artist-menu.css";

interface ArtistMenuProps {
  formData: {
    name: string;
  };
  error: string | null;
  successMessage: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  submitButtonText: string;
}

const ArtistMenu: React.FC<ArtistMenuProps> = ({
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
      <div className="artist-menu" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h3 className="artist-menu-title">{title}</h3>

        <form className="artist-menu-form" onSubmit={onSubmit}>
          <label className="artist-menu-label">
            Artist Name:
            <input
              type="text"
              name="name"
              placeholder="Enter artist name"
              value={formData.name}
              onChange={onInputChange}
            />
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

          <button type="submit" className="submit-artist-button">
            {submitButtonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArtistMenu;