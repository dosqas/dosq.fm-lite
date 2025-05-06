import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { Song } from "@entities/song";
import SongCard from "../cards/SongCard";
import UpdateSongMenu from "@menus/song/UpdateSongMenu";
import AddSongMenu from "@menus/song/AddSongMenu";
import { assignHrColor } from "@utils/songCardUtils";
import { validateForm } from "@utils/validation";
import { sortSongs, filterSongs } from "@utils/filterAndSort";
import { useConnectionStatus } from "@context/ConnectionStatusContext";
import "@styles/profile/overview/common/profile-songs-col.css";
import { syncOfflineQueue } from "@utils/offline/offlineQueueUtils";

import { useMenuHandlers } from "@hooks/useMenuHandlers";


import { toggleAutoGeneration as toggleAutoGenerationService } from "@service/songService";
import { fetchSongsLimited as fetchSongsLimitedService } from "@service/songService";
import { connectWebSocket as connectWebSocketService } from "@service/songService";
import { addSongOffline as addSongOfflineService, addSongOnline as addSongOnlineService } from "@service/songService";
import { updateSongOffline as updateSongOfflineService, updateSongOnline as updateSongOnlineService } from "@service/songService";
import { deleteSongOffline as deleteSongOfflineService, deleteSongOnline as deleteSongOnlineService } from "@service/songService";

export interface SongListHandle {
  openAddMenu: () => void;
  resetPage: () => void;
}

interface SongListProps {
  selectedYear?: string | null;
  selectedMonth?: string | null;
  selectedDay?: string | null;
}

const SongList = forwardRef<SongListHandle, SongListProps>(
  ({ selectedYear, selectedMonth, selectedDay }, ref) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [hasMore, setHasMore] = useState(true); // Track if there are more songs to fetch
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const itemsPerPage = 15; // Fixed to 15 items per page
    const containerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container

    const [isAutoGenerating, setIsAutoGenerating] = useState(false); 

    const { isOnline, isServerReachable } = useConnectionStatus();
    const [connectionStatus, setConnectionStatus] = useState("connecting");

    const [containsString, setContainsString] = useState<string | null>(null); // State for the search string

    const {
      isAddMenuOpen,
      isUpdateMenuOpen,
      openMenuId,
      selectedSong,
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
    } = useMenuHandlers();

    useEffect(() => {
      if (isOnline && isServerReachable) {
        console.log("Server is back online. Syncing offline queue...");
        syncOfflineQueue();
      }
    }, [isOnline, isServerReachable]);

    useEffect(() => {
      if (isOnline && isServerReachable && songs.length < 15) {
        fetchSongs(1);
      }
    }, [isOnline, isServerReachable, songs.length]);

    useImperativeHandle(ref, () => ({
      openAddMenu: handleOpenAddMenu,
      resetPage: () => {
        setCurrentPage(1);
      },
    }));

    const fetchSongs = async (page: number) => {
      console.log("Fetching songs for page:", page);
      if (isLoading) {
        console.log("Skipping fetch: Already loading");
        return;
      }
      if (!hasMore && page > 1) {
        console.log("Skipping fetch: No more songs to load");
        return;
      }
    
      setIsLoading(true);
    
      try {
        const { songs: newSongs, hasMore: moreAvailable } = await fetchSongsLimitedService(
          page,
          itemsPerPage,
          selectedYear,
          selectedMonth,
          selectedDay,
          containsString
        );
    
        console.log("Fetched songs:", newSongs);
        console.log("Updated hasMore:", moreAvailable);
    
        setSongs((prevSongs) => {
          const songIds = new Set(prevSongs.map((song) => song.songId));
          const uniqueSongs = newSongs.filter((song) => !songIds.has(song.songId));
          const mergedSongs = [...prevSongs, ...uniqueSongs];
          return sortSongs(mergedSongs);
        });
    
        setHasMore(moreAvailable);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      console.log("Selected filters changed:", { selectedYear, selectedMonth, selectedDay, containsString });
      setSongs([]); // Reset songs when filters change
      setCurrentPage(1);
      setHasMore(true);
      fetchSongs(1);
    }, [selectedYear, selectedMonth, selectedDay, containsString]);

    const handleScroll = () => {
      if (!containerRef.current || isLoading || !hasMore) return;

      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

      // Check if the user has scrolled near the bottom
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setCurrentPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchSongs(nextPage);
          return nextPage;
        });
      }
    };

    // Attach scroll event listener
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }, [handleScroll]);

    
    // WebSocket connection (runs only once)
    useEffect(() => {
      const cleanup = connectWebSocketService(
        (message) => {
          if (message.type === "AUTO_GENERATION_STATUS") {
            setIsAutoGenerating(message.payload.isActive);   
          } 
          else if (message.type === "NEW_SONG") {
            // Normalize the payload to match SongCardProps
            const newSong = {
              songId: message.payload.SongId,
              title: message.payload.Title,
              album: message.payload.Album,
              dateListened: message.payload.DateListened, // Already in ISO format
              artist: {
                name: message.payload.Artist.Name, // Extract artist name
              }
            };
    
            // Add the normalized song to the state
            setSongs((prevSongs) => [newSong, ...prevSongs]);
          }
        },
        (status) => setConnectionStatus(status)
      );
    
      return cleanup; // Cleanup WebSocket on component unmount
    }, []);

    // Filter songs when selectedYear, selectedMonth, or selectedDay changes
    useEffect(() => {
      setSongs((prevSongs) => {
        const filteredSongs = filterSongs(
          prevSongs,
          selectedYear
            ? selectedMonth
              ? selectedDay
                ? `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
                : `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`
              : `${selectedYear}-01-01`
            : null,
          !selectedYear
            ? "all"
            : !selectedMonth
            ? "year"
            : !selectedDay
            ? "month"
            : "day"
        );
        return sortSongs(filteredSongs);
      });
    }, [selectedYear, selectedMonth, selectedDay]);
    

    // Toggle auto-generation of songs
    const toggleAutoGeneration = async () => {
      try {
        await toggleAutoGenerationService(isAutoGenerating);
        setIsAutoGenerating((prev) => !prev);
      } catch (error) {
        console.error("Error toggling auto-generation:", error);
      }
    };

    useImperativeHandle(ref, () => ({
      openAddMenu: handleOpenAddMenu,
      resetPage: () => {
        setCurrentPage(1);
      },
    }));

    const handleAddSong = async (e: React.FormEvent) => {  
      // Combine dateListened and timeListened into a single ISO 8601 string
      const combinedDateTime = `${formData.dateListened}T${formData.timeListened || "00:00"}:00Z`;
    
      const artist = songs.find((song) => song.artist.artistId === formData.artist?.artistId);

      const updatedFormData = {
        songId: formData.songId,
        title: formData.title,
        album: formData.album,
        dateListened: combinedDateTime,
        artist: {
          artistId: formData.artist?.artistId || 0, // Include artistId, default to 0 if undefined
          name: artist?.artist.name || "", // Get the artist's name or fallback to an empty string
        },
        artistId: formData.artist?.artistId || 0, // Include artistId, default to 0 if undefined
        userId: formData.userId,
      };

      const validationResult = validateForm(updatedFormData);
    
      if (validationResult) {
        setError(validationResult);
        return;
      }
    
      try {
        if (!isOnline || !isServerReachable) {
          // Handle offline mode
          const offlineSong = addSongOfflineService(updatedFormData, selectedYear, selectedMonth, selectedDay);
    
          // Reflect changes in the frontend
          setSongs((prevSongs) => {
            const updatedSongs = [...prevSongs, offlineSong];
            const filteredSongs = filterSongs(
              updatedSongs,
              selectedYear
                ? selectedMonth
                  ? selectedDay
                    ? `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
                    : `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`
                  : `${selectedYear}-01-01`
                : null,
              !selectedYear
                ? "all"
                : !selectedMonth
                ? "year"
                : !selectedDay
                ? "month"
                : "day"
            );
            return sortSongs(filteredSongs);
          });
    
          setSuccessMessage("Track added locally. It will sync when back online.");
          handleCloseAddMenu();
          return;
        }
    
        // Handle online mode
        const newSong = await addSongOnlineService(updatedFormData);
    
        // Reflect changes in the frontend
        setSongs((prevSongs) => {
          const updatedSongs = [...prevSongs, newSong];
          const filteredSongs = filterSongs(
            updatedSongs,
            selectedYear
              ? selectedMonth
                ? selectedDay
                  ? `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
                  : `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`
                : `${selectedYear}-01-01`
              : null,
            !selectedYear
              ? "all"
              : !selectedMonth
              ? "year"
              : !selectedDay
              ? "month"
              : "day"
          );
          return sortSongs(filteredSongs);
        });
    
        setSuccessMessage("Track added successfully!");
        setError(null);
        handleCloseAddMenu();
      } catch (error) {
        console.error("Error adding song:", error);
        setError("Failed to add song");
      }
    };

    const handleUpdateSong = async (id: number | string, updatedSong: Partial<Song>) => {
      const validationResult = validateForm(updatedSong as Song);
    
      if (validationResult) {
        setError(validationResult);
        return;
      }
    
      try {
        if (!isOnline || !isServerReachable) {
          // Handle offline mode
          const offlineSong = updateSongOfflineService(id, updatedSong);
    
          // Reflect changes in the frontend
          setSongs((prevSongs) => {
            const updatedSongs = prevSongs.map((song) =>
              song.songId === id ? { ...song, ...offlineSong } : song
            );
    
            const filteredSongs = filterSongs(
              updatedSongs,
              selectedYear
                ? selectedMonth
                  ? selectedDay
                    ? `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
                    : `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`
                  : `${selectedYear}-01-01`
                : null,
              !selectedYear
                ? "all"
                : !selectedMonth
                ? "year"
                : !selectedDay
                ? "month"
                : "day"
            );
    
            return sortSongs(filteredSongs);
          });
    
          setSuccessMessage("Track updated locally. It will sync when back online.");
          handleCloseUpdateMenu();
          return;
        }
    
        // Handle online mode
        const updatedSongWithArtistId = {
          ...updatedSong,
          artistId: updatedSong.artist?.artistId || 0, // Ensure artistId is included
          dateListened: updatedSong.dateListened || "", // Ensure dateListened is always a string
          artist: updatedSong.artist || { name: "" }, // Ensure artist is always included
          userId: 0, // Ensure userId is included
        };

        const updatedSongData = await updateSongOnlineService(id, updatedSongWithArtistId);
    
        // Reflect changes in the frontend
        setSongs((prevSongs) => {
          const updatedSongs = prevSongs.map((song) =>
            song.songId === id ? { ...song, ...updatedSongData } : song
          );
    
          const filteredSongs = filterSongs(
            updatedSongs,
            selectedYear
              ? selectedMonth
                ? selectedDay
                  ? `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
                  : `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`
                : `${selectedYear}-01-01`
              : null,
            !selectedYear
              ? "all"
              : !selectedMonth
              ? "year"
              : !selectedDay
              ? "month"
              : "day"
          );
    
          return sortSongs(filteredSongs);
        });
    
        handleCloseUpdateMenu();
      } catch (error) {
        console.error("Error updating song:", error);
        setError("Failed to update song");
      }
    };

    const handleDeleteSong = async (id: string | number) => {
      try {
        if (!isOnline || !isServerReachable) {
          // Handle offline mode
          const deletedSongId = deleteSongOfflineService(id);
    
          // Reflect changes in the frontend
          setSongs((prevSongs) => {
            const updatedSongs = prevSongs.filter((song) => song.songId !== deletedSongId);
    
            const filteredSongs = filterSongs(
              updatedSongs,
              selectedYear
                ? selectedMonth
                  ? selectedDay
                    ? `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
                    : `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`
                  : `${selectedYear}-01-01`
                : null,
              !selectedYear
                ? "all"
                : !selectedMonth
                ? "year"
                : !selectedDay
                ? "month"
                : "day"
            );
    
            return sortSongs(filteredSongs);
          });
    
          setSuccessMessage("Track deleted locally. It will sync when back online.");
          return;
        }
    
        // Handle online mode
        await deleteSongOnlineService(id);
    
        // Reflect changes in the frontend
        setSongs((prevSongs) => {
          const updatedSongs = prevSongs.filter((song) => song.songId !== id);
    
          const filteredSongs = filterSongs(
            updatedSongs,
            selectedYear
              ? selectedMonth
                ? selectedDay
                  ? `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
                  : `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`
                : `${selectedYear}-01-01`
              : null,
            !selectedYear
              ? "all"
              : !selectedMonth
              ? "year"
              : !selectedDay
              ? "month"
              : "day"
          );
    
          return sortSongs(filteredSongs);
        });
      } catch (error) {
        console.error("Error deleting song:", error);
        setError("Failed to delete song");
      }
    };
    
    return (
      <div className="profile-songs-col">
        <div className="profile-songs-col-header">
          <button onClick={toggleAutoGeneration} className="toggle-auto-generation-button">
            {isAutoGenerating ? "Stop Auto-Generation" : "Start Auto-Generation"}
          </button>
        </div>

        <input
    type="text"
    placeholder="Search songs..."
    value={containsString || ""}
    onChange={(e) => setContainsString(e.target.value)}
    className="search-input"
    style={{
      marginLeft: "10px",
      padding: "5px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    }}
  />
    
        <div
          className="profile-songs-col-list"
          ref={containerRef}
          style={{
            height: "600px", // Fixed height for scrolling
            overflowY: "auto",
            position: "relative",
          }}
          onScroll={handleScroll} // Attach the scroll handler
        >
          {songs.map((song, index) => {
            const hrColor = assignHrColor(index, songs.length); // Use the index directly
    
            return (
              <SongCard
                key={`${song.songId}-${index}`} // Ensure uniqueness by appending the index
                title={song.title}
                artist={song.artist?.name || "test"} // Use artist's name or fallback to an empty string
                album={song.album}
                dateListened={new Date(song.dateListened).toLocaleString()} // Format ISO date
                onUpdate={() => handleOpenUpdateMenu(song)}
                onDelete={() => handleDeleteSong(song.songId)}
                hrColor={hrColor}
                isMenuOpen={openMenuId === song.songId}
                onMenuToggle={() => handleMenuToggle(song.songId)}
                onMenuClose={handleMenuClose}
              />
            );
          })}
    
          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
            </div>
          )}
    
          {!hasMore && songs.length > 0 && (
            <div className="no-more-songs-message" style= {{color:"white", display:"flex", justifyContent:"center"}}>No more songs to load</div>
          )}
        </div>
    
        {isAddMenuOpen && (
          <AddSongMenu
          formData={{
            title: formData.title,
            album: formData.album,
            dateListened: formData.dateListened,
            timeListened: formData.timeListened ?? "", // Include time if applicable, default to an empty string
            artistId: formData.artist?.artistId?.toString() ?? "", // Convert artistId to string or fallback to an empty string
          }}
          error={error}
          successMessage={successMessage}
          onClose={handleCloseAddMenu}
          onSubmit={(e) => handleAddSong(e)} // Pass the event correctly
          onInputChange={(e) => {
            const { name, value } = e.target;
            if (name === "artistId") {
              setFormData({
                ...formData,
                artist: { ...formData.artist, artistId: parseInt(value, 10) }, // Update artistId as a number
              });
            } else {
              setFormData({ ...formData, [name]: value });
            }
          }}
          artists={Array.from(
              new Map(
                songs
                  .filter((song) => song.artist.artistId !== undefined && song.artist.name !== undefined)
                  .map((song) => [song.artist.artistId!, { id: song.artist.artistId!, name: song.artist.name! }])
              ).values()
            )}
        />
        )}
    
        {isUpdateMenuOpen && selectedSong && (
          <UpdateSongMenu
            formData={{
              ...formData,
              timeListened: formData.timeListened || "", // Ensure timeListened is always a string
              artistId: formData.artist?.artistId?.toString() || "", // Ensure artistId is included as a string
            }}
            error={error}
            successMessage={successMessage}
            onClose={handleCloseUpdateMenu}
            onSubmit={(e) => {
              handleUpdateSong(selectedSong.songId, formData);
            }}
            onInputChange={(e) => {
              const { name, value } = e.target;
              if (name === "artistId") {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  artist: { ...prevFormData.artist, artistId: parseInt(value, 10) },
                }));
              } else {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [name]: value,
                }));
              }
            }}
            artists={Array.from(
              new Map(
                songs
                  .filter((song) => song.artist.artistId !== undefined && song.artist.name !== undefined)
                  .map((song) => [song.artist.artistId!, { id: song.artist.artistId!, name: song.artist.name! }])
              ).values()
            )}
          />
        )}
      </div>
    );
  }
);

export default SongList;