"use client";

import React, { useState } from "react";
import "../styles/profile-sidebar.css";

interface ProfileSidebarProps {
  addSong: (newSong: {
    title: string;
    artist: string;
    album: string;
    genre: string;
    hour: string;
    minute: string;
    day: string;
    month: string;
    year: string;
  }) => void;
  updateSong: (updatedSong: {
    id: number;
    title: string;
    artist: string;
    album: string;
    genre: string;
    hour: string;
    minute: string;
    day: string;
    month: string;
    year: string;
  }) => void;
  songToEdit: {
    id: number;
    title: string;
    artist: string;
    album: string;
    genre: string;
    hour: string;
    minute: string;
    day: string;
    month: string;
    year: string;
  } | null;
  clearEdit: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  addSong,
  updateSong,
  songToEdit,
  clearEdit,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    hour: "",
    minute: "",
    day: "",
    month: "",
    year: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setSuccessMessage(null); 
    setErrors([]); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    const hour = parseInt(formData.hour, 10);
    const minute = parseInt(formData.minute, 10);
    const day = parseInt(formData.day, 10);
    const month = parseInt(formData.month, 10);
    const year = parseInt(formData.year, 10);

    if (!formData.title) newErrors.push("Song Title is required.");
    else if (!formData.artist) newErrors.push("Artist is required.");
    else if (!formData.album) newErrors.push("Album is required.");
    else if (!formData.genre) newErrors.push("Genre is required.");
    else if (isNaN(hour) || hour < 0 || hour > 23)
      newErrors.push("Hour must be between 0 and 23.");
    else if (isNaN(minute) || minute < 0 || minute > 59)
      newErrors.push("Minute must be between 0 and 59.");
    else if (isNaN(day) || day < 1 || day > 31)
      newErrors.push("Day must be between 1 and 31.");
    else if (isNaN(month) || month < 1 || month > 12)
      newErrors.push("Month must be between 1 and 12.");
    else if (isNaN(year) || year < 1900 || year > 2100)
      newErrors.push("Year must be between 1900 and 2100.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (songToEdit) {
        updateSong({ ...formData, id: songToEdit.id }); 
        clearEdit(); 
      } else {
        addSong(formData); 
      }
      setFormData({
        title: "",
        artist: "",
        album: "",
        genre: "",
        hour: "",
        minute: "",
        day: "",
        month: "",
        year: "",
      });
      setErrors([]);
      setSuccessMessage(
        songToEdit ? "Track updated successfully!" : "Track added successfully!"
      );
    }
  };

  React.useEffect(() => {
    if (songToEdit) {
      setFormData(songToEdit); 
      setIsMenuOpen(true);
    } else {
      setFormData({
        title: "",
        artist: "",
        album: "",
        genre: "",
        hour: "",
        minute: "",
        day: "",
        month: "",
        year: "",
      });
      setIsMenuOpen(false); 
    }
    setSuccessMessage(null); 
    setErrors([]); 
  }, [songToEdit]);

  return (
    <div className="profile-sidebar">
      <div className="profile-sidebar-content">
        <p className="profile-sidebar-bio">
          This is a short bio about the user. It can include some details about
          their music preferences or other relevant information.
        </p>
        <hr className="profile-sidebar-divider" />
        <button
          className="profile-sidebar-add-track-button"
          onClick={toggleMenu}
        >
          Add Track
        </button>
      </div>

      {(isMenuOpen || songToEdit) && (
        <div className="add-track-menu">
          <h3 className="add-track-main-label">
            {songToEdit ? "Update Track" : "Add a New Track"}
          </h3>
          <form className="add-track-form" onSubmit={handleSubmit}>
            <label className="add-track-label">
              Song Title:
              <input
                type="text"
                name="title"
                placeholder="Enter song title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </label>
            <label className="add-track-label">
              Artist:
              <input
                type="text"
                name="artist"
                placeholder="Enter artist name"
                value={formData.artist}
                onChange={handleInputChange}
              />
            </label>
            <label className="add-track-label">
              Album:
              <input
                type="text"
                name="album"
                placeholder="Enter album name"
                value={formData.album}
                onChange={handleInputChange}
              />
            </label>
            <label className="add-track-label">
              Genre:
              <input
                type="text"
                name="genre"
                placeholder="Enter genre name"
                value={formData.genre}
                onChange={handleInputChange}
              />
            </label>
            <div className="add-track-row">
              <label className="add-track-label">
                Hour:
                <input
                  type="number"
                  name="hour"
                  placeholder="HH"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={handleInputChange}
                />
              </label>
              <label className="add-track-label">
                Minute:
                <input
                  type="number"
                  name="minute"
                  placeholder="MM"
                  min="0"
                  max="59"
                  value={formData.minute}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="add-track-row">
              <label className="add-track-label">
                Day:
                <input
                  type="number"
                  name="day"
                  placeholder="DD"
                  min="1"
                  max="31"
                  value={formData.day}
                  onChange={handleInputChange}
                />
              </label>
              <label className="add-track-label">
                Month:
                <input
                  type="number"
                  name="month"
                  placeholder="MM"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={handleInputChange}
                />
              </label>
              <label className="add-track-label">
                Year:
                <input
                  type="number"
                  name="year"
                  placeholder="YYYY"
                  min="1900"
                  max="2100"
                  value={formData.year}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            {errors.length > 0 && (
              <div className="error-message">
                {errors.map((error, index) => (
                  <p key={index} className="error-text">
                    {error}
                  </p>
                ))}
              </div>
            )}
            {successMessage && (
              <div className="success-message">
                <p className="success-text">{successMessage}</p>
              </div>
            )}
            <button type="submit" className="submit-track-button">
              {songToEdit ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;