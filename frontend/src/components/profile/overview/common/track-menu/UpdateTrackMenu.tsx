import React, { useState, useEffect } from "react";
import TrackMenu from "./TrackMenu";
import { Song } from "../../../../../../../shared/entities/song"; // Adjust the import path as necessary

interface UpdateTrackMenuProps {
  song: Song;
  error: string | null;
  successMessage: string | null;
  onClose: () => void;
  onSubmit: (updatedSong: Partial<Song>) => void; 
}

const UpdateTrackMenu: React.FC<UpdateTrackMenuProps> = ({
  song,
  error,
  successMessage,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Song>(song);

  useEffect(() => {
    setFormData(song);
  }, [song]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the `id` is preserved correctly
    onSubmit({ ...formData, id: song.id });
  };

  return (
    <TrackMenu
      formData={formData}
      error={error}
      successMessage={successMessage}
      onClose={onClose}
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      title="Update Track"
      submitButtonText="Update"
    />
  );
};

export default UpdateTrackMenu;