import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import ArtistCard from "../cards/ArtistCard";
import AddArtistMenu from "@menus/artist/AddArtistMenu";
import UpdateArtistMenu from "@menus/artist/UpdateArtistMenu";
import { useMenuHandlersArtist } from "@hooks/useMenuHandlersArtist";

import { fetchArtistsLimited, addArtistOnline, updateArtistOnline, deleteArtistOnline } from "@service/artistService";


export interface ArtistListHandle {
  openAddMenu: () => void;
  resetPage: () => void;
}

interface Artist {
  artistId: number;
  name: string;
  songCount: number;
}

const ArtistList = forwardRef<ArtistListHandle>((_, ref) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 15;
  const containerRef = useRef<HTMLDivElement>(null);

  const [containsString, setContainsString] = useState<string>("");

  const {
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
  } = useMenuHandlersArtist();

  useImperativeHandle(ref, () => ({
    openAddMenu: handleOpenAddMenu,
    resetPage: () => {
      setCurrentPage(1);
    },
  }));

  const fetchArtists = async (page: number, containsString: string) => {
    if (isLoading || !hasMore) return;
  
    setIsLoading(true);
    try {
      const { artists: paginatedArtists, hasMore: moreAvailable } = await fetchArtistsLimited(page, itemsPerPage, containsString);

      console.log("Fetched artists:", paginatedArtists);

      const validArtists = paginatedArtists && paginatedArtists.length > 0
        ? paginatedArtists.map((artist: Partial<Artist>) => ({
            artistId: artist.artistId ?? 0,
            name: artist.name ?? "Unknown",
            songCount: artist.songCount ?? 0,
          }))
        : [];

      setArtists((prevArtists) => {
        const artistIds = new Set(prevArtists.map((artist) => artist.artistId));
        const uniqueArtists = validArtists.filter((artist) => !artistIds.has(artist.artistId));
        return [...prevArtists, ...uniqueArtists];
      });
  
      setHasMore(moreAvailable);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setArtists([]); // Reset artists when the component mounts or page changes
    fetchArtists(currentPage, containsString);
  }, [currentPage, containsString]);

  const handleScroll = () => {
    if (!containerRef.current || isLoading || !hasMore) return;

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleAddArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Artist name is required.");
      return;
    }
  
    try {
      const newArtist = await addArtistOnline(formData); // Use the artistService function
      setArtists((prevArtists) => [
        {
          artistId: newArtist.artistId ?? 0,
          name: newArtist.name ?? "Unknown",
          songCount: newArtist.songCount ?? 0,
        },
        ...prevArtists,
      ]);
      setSuccessMessage("Artist added successfully!");
      handleCloseAddMenu();
    } catch (error) {
      console.error("Error adding artist:", error);
      setError("Failed to add artist.");
    }
  };

  const handleUpdateArtist = async (id: number, updatedArtist: Partial<Artist>) => {
    if (!updatedArtist.name) {
      setError("Artist name is required.");
      return;
    }
  
    try {
      const updatedData = await updateArtistOnline(id, updatedArtist); // Use the artistService function
      setArtists((prevArtists) =>
        prevArtists.map((artist) => (artist.artistId === id ? { ...artist, ...updatedData } : artist))
      );
      setSuccessMessage("Artist updated successfully!");
      handleCloseUpdateMenu();
    } catch (error) {
      console.error("Error updating artist:", error);
      setError("Failed to update artist.");
    }
  };

  const handleDeleteArtist = async (id: number) => {
    try {
      await deleteArtistOnline(id);
      setArtists((prevArtists) => prevArtists.filter((artist) => artist.artistId !== id));
      setSuccessMessage("Artist deleted successfully!");
    } catch (error) {
      console.error("Error deleting artist:", error);
      setError("Failed to delete artist.");
    }
  };

  return (
    <div className="profile-artists-col">
            <div className="profile-artists-col-header">
        {/* Input field for containsString */}
        <input
          type="text"
          placeholder="Search artists..."
          value={containsString}
          onChange={(e) => {
            setContainsString(e.target.value);
            setCurrentPage(1); // Reset to the first page when the search string changes
            setArtists([]); // Clear the current list to fetch new results
            setHasMore(true); // Reset hasMore to allow fetching
          }}
          className="search-input"
          style={{
            marginBottom: "10px",
            padding: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div
        className="profile-artists-col-list"
        ref={containerRef}
        style={{
          height: "600px",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {artists.map((artist) => (
          <ArtistCard
            key={artist.artistId}
            name={artist.name}
            listenCount={artist.songCount}
            isMenuOpen={openMenuId === artist.artistId}
            onMenuToggle={() => handleMenuToggle(artist.artistId)}
            onMenuClose={handleMenuClose}
            onModify={() => handleOpenUpdateMenu(artist)}
            onDelete={() => handleDeleteArtist(artist.artistId)}
          />
        ))}

        {isLoading && <div className="loading-indicator">Loading...</div>}
        {!hasMore && artists.length > 0 && (
          <div className="no-more-artists-message">No more artists to load</div>
        )}
      </div>

      {isAddMenuOpen && (
        <AddArtistMenu
          formData={formData}
          error={error}
          successMessage={successMessage}
          onClose={handleCloseAddMenu}
          onSubmit={handleAddArtist}
          onInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        />
      )}

      {isUpdateMenuOpen && selectedArtist && (
        <UpdateArtistMenu
          formData={formData}
          error={error}
          successMessage={successMessage}
          onClose={handleCloseUpdateMenu}
          onSubmit={(e) => {
            e.preventDefault(); // Prevent page reload
            handleUpdateArtist(selectedArtist.artistId, formData);
          }}
          onInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        />
      )}
    </div>
  );
});

export default ArtistList;