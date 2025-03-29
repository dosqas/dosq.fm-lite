import React, { useState, forwardRef, useImperativeHandle, useMemo, useEffect } from "react";
import { Song } from "@/types/song";
import SongCard from "./SongCard";
import UpdateTrackMenu from "./track-menu/UpdateTrackMenu";
import AddTrackMenu from "./track-menu/AddTrackMenu";
import { validateForm } from "../../../../utils/formUtils";
import { assignHrColor } from "../../../../utils/songUtils";
import "../../../../styles/profile/overview/common/profile-songs-col.css";

export interface ProfileSongsColHandle {
  openAddMenu: () => void;
  resetPage: () => void;
}

interface ProfileSongsColProps {
  filterByDate?: (song: Song) => boolean; 
  selectedYear?: string | null;
  selectedMonth?: string | null;
  selectedDay?: string | null;
  onGroupedData?: (data: { [key: string]: number }) => void; 
  onPageChange?: (page: number) => void;
}

const ProfileSongsCol = forwardRef<ProfileSongsColHandle, ProfileSongsColProps>(
  ({ filterByDate, selectedYear, selectedMonth, selectedDay, onGroupedData }, ref) => {
    const [songs, setSongs] = useState<Song[]>([]);

    const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [isAutoGenerating, setIsAutoGenerating] = useState(true); 

    useImperativeHandle(ref, () => ({
      openAddMenu: handleOpenAddMenu,
      resetPage: () => {
        setCurrentPage(1);
      },
    }));

    const generateRandomSong = (): Song => {
      const randomId = Date.now();
      const randomArtist = `Artist ${Math.floor(Math.random() * 10) + 1}`;
      const randomAlbum = `Album ${Math.floor(Math.random() * 5) + 1}`;
      const randomGenre = `Genre ${Math.floor(Math.random() * 3) + 1}`;
      const randomYear = `${2020 + Math.floor(Math.random() * 5)}`;
      const randomMonth = `${Math.floor(Math.random() * 12) + 1}`.padStart(2, "0");
      const randomDay = `${Math.floor(Math.random() * 28) + 1}`.padStart(2, "0");
      const randomHour = `${Math.floor(Math.random() * 24)}`.padStart(2, "0");
      const randomMinute = `${Math.floor(Math.random() * 60)}`.padStart(2, "0");

      return {
        id: randomId,
        albumCover: "/images/vinyl-icon.svg",
        title: `Random Song ${randomId}`,
        artist: randomArtist,
        album: randomAlbum,
        genre: randomGenre,
        hour: randomHour,
        minute: randomMinute,
        day: randomDay,
        month: randomMonth,
        year: randomYear,
      };
    };

    useEffect(() => {
      const fetchSongs = async () => {
        try {
          const response = await fetch("/api/songs");
          if (!response.ok) {
            throw new Error("Failed to fetch songs");
          }
          const data: Song[] = await response.json();
          setSongs(data); 
        } catch (error) {
          console.error("Error fetching songs:", error);
        }
      };
    
      fetchSongs();
    }, []);

    const toggleAutoGeneration = () => {
      setIsAutoGenerating((prev) => !prev);
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
        id: Date.now(),
        hour: padWithZero(formData.hour),
        minute: padWithZero(formData.minute),
        day: padWithZero(formData.day),
        month: padWithZero(formData.month),
      };

      try {
        const response = await fetch("/api/songs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedSong),
        });
    
        if (!response.ok) {
          throw new Error("Failed to add song");
        }
    
        const newSong = await response.json();
        setSongs((prevSongs) => [...prevSongs, newSong]); 
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
        const response = await fetch(`/api/songs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedSong),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update song");
        }
    
        const updatedSongData = await response.json();
        setSongs((prevSongs) =>
          prevSongs.map((song) => (song.id === id ? updatedSongData : song))
        );
        handleCloseUpdateMenu();
      } catch (error) {
        console.error("Error updating song:", error);
        setError("Failed to update song");
      }
    };

    const handleDeleteSong = async (id: number) => {
      try {
        const response = await fetch(`/api/songs/${id}`, {
          method: "DELETE",
        });
    
        if (!response.ok) {
          throw new Error("Failed to delete song");
        }
    
        setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
      } catch (error) {
        console.error("Error deleting song:", error);
        setError("Failed to delete song");
      }
    };

    const padWithZero = (value: string) => {
      return value.padStart(2, "0");
    };

    useEffect(() => {
      const fetchFilteredSongs = async () => {
        try {
          const queryParams = new URLSearchParams();
          if (selectedYear) queryParams.append("filterBy", "year");
          if (selectedMonth) queryParams.append("filterBy", "month");
          if (selectedDay) queryParams.append("filterBy", "day");
    
          const response = await fetch(`/api/songs?${queryParams.toString()}`);
          if (!response.ok) {
            throw new Error("Failed to fetch filtered songs");
          }
    
          const data: Song[] = await response.json();
          setSongs(data);
        } catch (error) {
          console.error("Error fetching filtered songs:", error);
        }
      };
    
      fetchFilteredSongs();
    }, [selectedYear, selectedMonth, selectedDay]);

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

    useEffect(() => {
      const fetchGroupedData = async () => {
        try {
          const response = await fetch("/api/songs?groupByDate=true");
          if (!response.ok) {
            throw new Error("Failed to fetch grouped data");
          }
    
          const groupedData = await response.json();
          if (onGroupedData) onGroupedData(groupedData);
        } catch (error) {
          console.error("Error fetching grouped data:", error);
        }
      };
    
      fetchGroupedData();
    }, []); 
    
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