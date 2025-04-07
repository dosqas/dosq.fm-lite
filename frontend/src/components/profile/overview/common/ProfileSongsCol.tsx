import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { Song } from "@shared/types/song";
import SongCard from "./SongCard";
import UpdateTrackMenu from "./track-menu/UpdateTrackMenu";
import AddTrackMenu from "./track-menu/AddTrackMenu";
import { assignHrColor } from "../../../../utils/songcardUtils";
import { validateForm } from "@shared/utils/validation";
import { sortSongs, filterSongs } from "@shared/utils/filterAndSort";
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
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [hasMore, setHasMore] = useState(true); // Track if there are more songs to fetch
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const itemsPerPage = 15; // Fixed to 15 items per page
    const containerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container


    const [isAutoGenerating, setIsAutoGenerating] = useState(false); 
    
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const { isOnline, isServerReachable } = useConnectionStatus();
    const [connectionStatus, setConnectionStatus] = useState("connecting");

    const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP;

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
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", itemsPerPage.toString());
    
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

        console.log("Fetching songs with query params:", queryParams.toString());
    
        const response = await fetch(`http://${SERVER_IP}/api/songs/limited?${queryParams.toString()}`);
        if (!response.ok) throw new Error(`Failed to fetch songs: ${response.status}`);

        const result = await response.json();

        // Extract songs and hasMore from the response
        const { songs: newSongs, hasMore: moreAvailable } = result;

        console.log("Fetched songs:", newSongs);
        console.log("Updated hasMore:", moreAvailable);

        // Append only unique songs to the list
        setSongs((prevSongs) => {
          const songIds = new Set(prevSongs.map((song) => song.id)); // Track existing song IDs
          const uniqueSongs = newSongs.filter((song: Song) => !songIds.has(song.id)); // Filter out duplicates
          return [...prevSongs, ...uniqueSongs];
        });

        // Update the hasMore state
        setHasMore(moreAvailable);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      console.log("Selected filters changed:", { selectedYear, selectedMonth, selectedDay });
      setSongs([]); // Reset songs when filters change
      setCurrentPage(1);
      setHasMore(true);
      fetchSongs(1);
    }, [selectedYear, selectedMonth, selectedDay]);

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

    
    useEffect(() => {
      let ws: WebSocket | null = null;
      let retryCount = 0;
      const maxRetries = 5;
      const baseDelay = 1000;
      let retryTimeout: NodeJS.Timeout | null = null;
    
      const connectWebSocket = () => {
        setConnectionStatus(retryCount > 0 ? "retrying..." : "connecting");
        
        try {
          ws = new WebSocket(`ws://${SERVER_IP}`);
    
          ws.onopen = () => {
            console.log("WebSocket connected successfully");
            setConnectionStatus("connected");
            retryCount = 0;
          };
    

          ws.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data);

              if (message.type === "NEW_SONG") {
                const newSong = message.payload;

                setSongs((prevSongs) => {
                  // Combine the new song with the existing list
                  const updatedSongs = [newSong, ...prevSongs];

                  // Apply filtering based on the current filters
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
                      ? "1month"
                      : "1day"
                  );

                  // Sort the filtered songs
                  return sortSongs(filteredSongs);
                });
              }
            } catch (error) {
              console.error("Failed to process WebSocket message:", error);
            }
          };
    
          ws.onclose = (event) => {
            console.log("WebSocket closed:", {
              code: event.code,
              reason: event.reason,
              wasClean: event.wasClean
            });
            
            if (!event.wasClean) {
              scheduleReconnect();
            }
          };
    
        } catch (error) {
          console.error("WebSocket initialization crashed:", error);
          scheduleReconnect();
        }
      };
    
      const scheduleReconnect = () => {
        if (retryCount < maxRetries) {
          const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000); // Cap at 30s
          retryCount++;
          
          console.groupCollapsed(`WebSocket retry #${retryCount}`);
          console.log("Next attempt in:", `${delay}ms`);
          console.log("Current retry count:", retryCount);
          console.groupEnd();
    
          retryTimeout = setTimeout(connectWebSocket, delay);
        } else {
          console.error("Maximum retry attempts reached");
          setConnectionStatus("failed");
        }
      };
    
      // Initial connection
      connectWebSocket();
    
      return () => {
        if (ws) {
          // Disable all handlers before closing
          ws.onopen = null;
          ws.onclose = null;
          ws.onmessage = null;
          
          if (ws.readyState === WebSocket.OPEN) {
            ws.close(1000, "Component unmounting");
          }
        }
        if (retryTimeout) clearTimeout(retryTimeout);
      };
    }, [SERVER_IP]);
    

    // Toggle auto-generation of songs
    const toggleAutoGeneration = async () => {
      try {
        if (!isAutoGenerating) {
          const response = await fetch(`http://${SERVER_IP}/api/songs/start-auto-generation`, {
            method: "POST",
          });
    
          if (!response.ok) {
            throw new Error("Failed to start auto-generation");
          }
    
          console.log("Auto-generation started");
        } else {
          const response = await fetch(`http://${SERVER_IP}/api/songs/stop-auto-generation`, {
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
            url: `http://${SERVER_IP}/api/songs`,
            body: formattedSong,
          });
          setSuccessMessage("Track added locally. It will sync when back online.");
          handleCloseAddMenu();
          return;
        }
    
        const response = await fetch(`http://${SERVER_IP}/api/songs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedSong),
        });
    
        if (!response.ok) {
          throw new Error("Failed to add song");
        }
    
        const newSong = await response.json();
    
        // Add the new song to the songs list in the frontend
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
        const response = await fetch(`http://${SERVER_IP}/api/songs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedSong),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update song");
        }
    
        const updatedSongData = await response.json();
    
        setSongs((prevSongs) =>
          prevSongs.map((song) =>
            song.id === id ? { ...song, ...updatedSongData } : song
          )
        );
    
        handleCloseUpdateMenu();
      } catch (error) {
        console.error("Error updating song:", error);
        setError("Failed to update song");
      }
    };

    const handleDeleteSong = async (id: number) => {
      try {
        const response = await fetch(`http://${SERVER_IP}/api/songs/${id}`, {
          method: "DELETE",
        });
    
        if (!response.ok) {
          throw new Error("Failed to delete song");
        }
    
        const newSongs = songs.filter((song) => song.id !== id);
        setSongs(newSongs);
        
      } catch (error) {
        console.error("Error deleting song:", error);
        setError("Failed to delete song");
      }
    };

    const padWithZero = (value: string) => {
      return value.padStart(2, "0");
    };
    
    return (
      <div className="profile-songs-col">
        <div className="profile-songs-col-header">
          <button onClick={toggleAutoGeneration} className="toggle-auto-generation-button">
            {isAutoGenerating ? "Stop Auto-Generation" : "Start Auto-Generation"}
          </button>
        </div>
    
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
            onSubmit={(updatedSong) => handleUpdateSong(selectedSong.id, updatedSong)}
          />
        )}
      </div>
    );
  }
);

export default ProfileSongsCol;