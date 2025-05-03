import React from "react";
import SongMenu from "./SongMenu";

interface AddSongMenuProps {
  formData: {
    title: string;
    album: string;
    dateListened: string; // ISO string for the date
    artistId: string; // Artist ID as a string
  };
  error: string | null;
  successMessage: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  artists: { id: number; name: string }[]; // List of available artists
}

const AddSongMenu: React.FC<AddSongMenuProps> = ({
  formData,
  error,
  successMessage,
  onClose,
  onSubmit,
  onInputChange,
  artists,
}) => {
  return (
    <SongMenu
      formData={formData}
      error={error}
      successMessage={successMessage}
      onClose={onClose}
      onSubmit={onSubmit}
      onInputChange={onInputChange}
      title="Add a New Song"
      submitButtonText="Add Song"
      artists={artists}
    />
  );
};

export default AddSongMenu;