import { useState } from "react";
import { Artist } from "@entities/artist";

export const useMenuHandlersArtist = () => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isUpdateMenuOpen, setIsUpdateMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const defaultFormData = {
    artistId: 0,
    name: "",
    listenCount: 0,
  };

  const [formData, setFormData] = useState<Artist>(defaultFormData);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleMenuToggle = (artistId: number | string) => {
    setOpenMenuId((prevId) => (prevId === artistId ? null : artistId));
  };

  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  const handleOpenAddMenu = () => {
    setFormData(defaultFormData);
    setError(null);
    setSuccessMessage(null);
    setIsAddMenuOpen(true);
  };

  const handleCloseAddMenu = () => {
    setIsAddMenuOpen(false);
  };

  const handleOpenUpdateMenu = (artist: Artist) => {
    setSelectedArtist(artist);
    setFormData({
      artistId: artist.artistId,
      name: artist.name,
    });
    setError(null);
    setSuccessMessage(null);
    setIsUpdateMenuOpen(true);
  };

  const handleCloseUpdateMenu = () => {
    setSelectedArtist(null);
    setIsUpdateMenuOpen(false);
  };

  return {
    isAddMenuOpen,
    isUpdateMenuOpen,
    openMenuId,
    selectedArtist,
    formData,
    setFormData,
    error,
    successMessage,
    handleMenuToggle,
    handleMenuClose,
    handleOpenAddMenu,
    handleCloseAddMenu,
    handleOpenUpdateMenu,
    handleCloseUpdateMenu,
    setError,
    setSuccessMessage,
  };
};