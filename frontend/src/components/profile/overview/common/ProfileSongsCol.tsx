import React, { useState, forwardRef, useImperativeHandle, useMemo, useEffect } from "react";
import { Song } from "@shared/types/song";
import SongCard from "./SongCard";
import UpdateTrackMenu from "./track-menu/UpdateTrackMenu";
import AddTrackMenu from "./track-menu/AddTrackMenu";
import { assignHrColor } from "../../../../utils/songcardUtils";
import { validateForm } from "@shared/utils/validation";
import { useConnectionStatus } from "../../../../context/ConnectionStatusContext";
import { addToOfflineQueue } from "../../../../utils/offlineUtils";
import "../../../../styles/profile/overview/common/profile-songs-col.css";

export interface ProfileSongsColHandle {
  openAddMenu: () => void;
  resetPage: () => void;
}

interface ProfileSongsColProps {
  selectedYear?: string | null;
  selectedMonth?: string | null;
  selectedDay?: string | null;
}

const ProfileSongsCol = forwardRef<ProfileSongsColHandle, ProfileSongsColProps>(
  ({ selectedYear, selectedMonth, selectedDay }, ref) => {
    const [songs, setSongs] = useState<Song[]>([]);

    const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [isAutoGenerating, setIsAutoGenerating] = useState(false); 
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const { isOnline, isServerReachable } = useConnectionStatus();

    const handleMenuToggle = (songId: number) => {
      setOpenMenuId((prevId) => (prevId === songId ? null : songId)); 
    };

    const handleMenuClose = () => {
      setOpenMenuId(null);
    };

    useImperativeHandle(ref, () => ({
      openAddMenu: handleOpenAddMenu,
      resetPage: () => {
        setCurrentPage(1);
      },
    }));

    const fetchFilteredSongs = async () => {
      try {
        const queryParams = new URLSearchParams();
    
        if (!selectedYear) {
          queryParams.append("from", "1900-01-01");
          queryParams.append("rangetype", "all");
        } else if (!selectedMonth) {
          queryParams.append("from", `${selectedYear}-01-01`);
          queryParams.append("rangetype", "year");
        } else if (!selectedDay) {
          queryParams.append("from", `${selectedYear}-${selectedMonth}-01`);
          queryParams.append("rangetype", "1month");
        } else {
          queryParams.append(
            "from",
            `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
          );
          queryParams.append("rangetype", "1day");
        }

        console.log("Fetching songs with query:", queryParams.toString());
    
        const response = await fetch(`http://localhost:5000/api/songs?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch filtered songs");
        }
    
        const data: Song[] = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching filtered songs:", error);
      }
    };

    useEffect(() => {
      fetchFilteredSongs();
    }, [selectedYear, selectedMonth, selectedDay]);

    useEffect(() => {
      // Connect to the WebSocket server
      const ws = new WebSocket("ws://localhost:5000");
  
      ws.onopen = () => {
        console.log("Connected to WebSocket server");
      };
  
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
  
        if (message.type === "SONG_LIST") {
          // Initial list of songs
          setSongs(message.payload);
        } else if (message.type === "NEW_SONG") {
          // Add the new song to the list
          setSongs((prevSongs) => [...prevSongs, message.payload]);
        }
      };
  
      ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };
  
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      // Cleanup the WebSocket connection when the component unmounts
      return () => {
        ws.close();
      };
    }, []);

    // Toggle auto-generation of songs
    const toggleAutoGeneration = async () => {
      try {
        if (!isAutoGenerating) {
          const response = await fetch("http://localhost:5000/api/songs/start-auto-generation", {
            method: "POST",
          });
    
          if (!response.ok) {
            throw new Error("Failed to start auto-generation");
          }
    
          console.log("Auto-generation started");
        } else {
          const response = await fetch("http://localhost:5000/api/songs/stop-auto-generation", {
            method: "POST",
          });
    
          if (!response.ok) {
            throw new Error("Failed to stop auto-generation");
          }
    
          console.log("Auto-generation stopped");
        }
    
        setIsAutoGenerating((prev) => !prev);
      } catch (error) {
        console.error("Error toggling auto-generation:", error);
      }
    };

    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [isUpdateMenuOpen, setIsUpdateMenuOpen] = useState(false);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

    const [formData, setFormData] = useState<Song>({
      id: 0,
      albumCover: "/images/vinyl-icon.svg",
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

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      openAddMenu: handleOpenAddMenu,
      resetPage: () => {
        setCurrentPage(1);
      },
    }));

    const handleOpenAddMenu = () => {
      setFormData({
        id: 0,
        albumCover: "/images/vinyl-icon.svg",
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
      setError(null);
      setSuccessMessage(null);
      setIsAddMenuOpen(true);
    };

    const handleCloseAddMenu = () => {
      setIsAddMenuOpen(false);
    };

    const handleAddSong = async (e: React.FormEvent) => {
      e.preventDefault();

      const validationResult = validateForm(formData);

      if (validationResult) {
        setError(validationResult);
        return;
      }

      const formattedSong = {
        ...formData,
        hour: padWithZero(formData.hour),
        minute: padWithZero(formData.minute),
        day: padWithZero(formData.day),
        month: padWithZero(formData.month),
      };

      try {
        if (!isOnline || !isServerReachable) {
          addToOfflineQueue({
            method: "POST",
            url: "http://localhost:5000/api/songs",
            body: formattedSong,
          });
          setSuccessMessage("Track added locally. It will sync when back online.");
          handleCloseAddMenu();
          return;
        }

        const response = await fetch("http://localhost:5000/api/songs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedSong),
        });
    
        if (!response.ok) {
          throw new Error("Failed to add song");
        }
    
        const newSong = await response.json();
        fetchFilteredSongs();
        setSuccessMessage("Track added successfully!");
        setError(null);
        handleCloseAddMenu();
      } catch (error) {
        console.error("Error adding song:", error);
        setError("Failed to add song");
      }
    };

    const handleOpenUpdateMenu = (song: Song) => {
      setSelectedSong(song);
      setError(null);
      setSuccessMessage(null);
      setIsUpdateMenuOpen(true);
    };

    const handleCloseUpdateMenu = () => {
      setSelectedSong(null);
      setIsUpdateMenuOpen(false);
    };

    const handleUpdateSong = async (id: number, updatedSong: Partial<Song>) => {
      const validationResult = validateForm(updatedSong as Song);

      if (validationResult) {
        setError(validationResult);
        return;
      }

      const formattedSong = {
        ...updatedSong,
        hour: padWithZero(updatedSong.hour || ""),
        minute: padWithZero(updatedSong.minute || ""),
        day: padWithZero(updatedSong.day || ""),
        month: padWithZero(updatedSong.month || ""),
      };

      try {
        const response = await fetch(`http://localhost:5000/api/songs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedSong),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update song");
        }
    
        const updatedSongData = await response.json();
        fetchFilteredSongs();        
        handleCloseUpdateMenu();
      } catch (error) {
        console.error("Error updating song:", error);
        setError("Failed to update song");
      }
    };

    const handleDeleteSong = async (id: number) => {
      try {
        const response = await fetch(`http://localhost:5000/api/songs/${id}`, {
          method: "DELETE",
        });
    
        if (!response.ok) {
          throw new Error("Failed to delete song");
        }
    
        fetchFilteredSongs();
      } catch (error) {
        console.error("Error deleting song:", error);
        setError("Failed to delete song");
      }
    };

    const padWithZero = (value: string) => {
      return value.padStart(2, "0");
    };

    const totalPages = Math.ceil(songs.length / itemsPerPage);
    const paginatedSongs = songs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const handlePageClick = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    const generatePageNumbers = () => {
      const pageNumbers: (number | string)[] = [];
      const maxVisiblePages = 5; 

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);

        if (currentPage > 3) {
          pageNumbers.push("...");
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }

        if (currentPage < totalPages - 2) {
          pageNumbers.push("...");
        }

        pageNumbers.push(totalPages);
      }

      return pageNumbers;
    };

    const pageNumbers = generatePageNumbers();
    
    return (
      <div className="profile-songs-col">
        <div className="profile-songs-col-header">
          <div className="profile-songs-col-items-per-page">
            <label className="profile-songs-col-items-per-page-label" htmlFor="items-per-page">
              Items per page:
            </label>
            <select
              className="profile-songs-col-items-per-page-select"
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setCurrentPage(1); 
                setItemsPerPage(value); 
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </div>
          
          <button onClick={toggleAutoGeneration} className="toggle-auto-generation-button">
            {isAutoGenerating ? "Stop Auto-Generation" : "Start Auto-Generation"}
          </button>
        </div>

        {paginatedSongs.map((song, index) => {
          const hrColor = assignHrColor(index + (currentPage - 1) * itemsPerPage, songs.length);

          return (
            <SongCard
              key={song.id}
              albumCover={song.albumCover}
              title={song.title}
              artist={song.artist}
              album={song.album}
              genre={song.genre}
              dateListened={`${song.hour}:${song.minute}, ${song.day}/${song.month}/${song.year}`}
              onUpdate={() => handleOpenUpdateMenu(song)}
              onDelete={() => handleDeleteSong(song.id)}
              hrColor={hrColor}
              isMenuOpen={openMenuId === song.id}
              onMenuToggle={() => handleMenuToggle(song.id)} 
              onMenuClose={handleMenuClose} 
            />
          );
        })}

      {itemsPerPage > 0 && totalPages > 0 && (
      <div className="pagination-controls">
        <div className="pagination-button-container" style={{ flex: "1 1 25%" }}>
          {currentPage > 1 && (
            <button onClick={handlePreviousPage} className="pagination-button">
              Previous
            </button>
          )}
        </div>

        <div className="numbered-pagination" style={{ flex: "1 1 50%" }}>
          {pageNumbers.map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                onClick={() => handlePageClick(page)}
                className={`pagination-button ${page === currentPage ? "active" : ""}`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="ellipsis">
                {page}
              </span>
            )
          )}
        </div>

        <div className="pagination-button-container" style={{ flex: "1 1 25%" }}>
          {currentPage < totalPages && (
            <button onClick={handleNextPage} className="pagination-button">
              Next
            </button>
            )}
          </div>
        </div>
      )}

        {isAddMenuOpen && (
          <AddTrackMenu
            formData={formData}
            error={error}
            successMessage={successMessage}
            onClose={handleCloseAddMenu}
            onSubmit={handleAddSong}
            onInputChange={(e) => {
              const { name, value } = e.target;
              setFormData({ ...formData, [name]: value });
            }}
          />
        )}

        {isUpdateMenuOpen && selectedSong && (
          <UpdateTrackMenu
            song={selectedSong}
            error={error}
            successMessage={successMessage}
            onClose={handleCloseUpdateMenu}
            onSubmit={(updatedSong) =>
              handleUpdateSong(selectedSong.id, updatedSong)
            }
          />
        )}
      </div>
    );
  }
);

export default ProfileSongsCol;