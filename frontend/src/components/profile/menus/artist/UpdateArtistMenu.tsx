import React from "react";
import ArtistMenu from "./ArtistMenu";

interface UpdateArtistMenuProps {
  formData: {
    name: string;
  };
  error: string | null;
  successMessage: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UpdateArtistMenu: React.FC<UpdateArtistMenuProps> = ({
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
      title="Update Artist"
      submitButtonText="Update Artist"
    />
  );
};

export default UpdateArtistMenu;