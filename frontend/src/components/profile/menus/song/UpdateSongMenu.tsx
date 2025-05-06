import React from "react";
import SongMenu from "./SongMenu";

interface UpdateSongMenuProps {
  formData: {
    title: string;
    album: string;
    dateListened: string; // ISO string for the date
    timeListened: string;
    artistId: string; // Artist ID as a string
  };
  error: string | null;
  successMessage: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  artists: { id: number; name: string }[]; // List of available artists
}

const UpdateSongMenu: React.FC<UpdateSongMenuProps> = ({
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
      title="Update Song"
      submitButtonText="Update Song"
      artists={artists}
    />
  );
};

export default UpdateSongMenu;