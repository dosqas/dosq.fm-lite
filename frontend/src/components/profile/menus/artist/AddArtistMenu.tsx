import React from "react";
import ArtistMenu from "./ArtistMenu";

interface AddArtistMenuProps {
  formData: {
    name: string;
  };
  error: string | null;
  successMessage: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddArtistMenu: React.FC<AddArtistMenuProps> = ({
  formData,
  error,
  successMessage,
  onClose,
  onSubmit,
  onInputChange,
}) => {
  return (
    <ArtistMenu
      formData={formData}
      error={error}
      successMessage={successMessage}
      onClose={onClose}
      onSubmit={onSubmit}
      onInputChange={onInputChange}
      title="Add a New Artist"
      submitButtonText="Add Artist"
    />
  );
};

export default AddArtistMenu;