import React from "react";
import TrackMenu from "./TrackMenu";

interface AddTrackMenuProps {
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
}

const AddTrackMenu: React.FC<AddTrackMenuProps> = ({
  formData,
  error,
  successMessage,
  onClose,
  onSubmit,
  onInputChange,
}) => {
  return (
    <TrackMenu
      formData={formData}
      error={error}
      successMessage={successMessage}
      onClose={onClose}
      onSubmit={onSubmit}
      onInputChange={onInputChange}
      title="Add a New Track"
      submitButtonText="Add"
    />
  );
};

export default AddTrackMenu;