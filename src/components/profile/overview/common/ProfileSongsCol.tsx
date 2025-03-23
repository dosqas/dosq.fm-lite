import React, { useState, forwardRef, useImperativeHandle, useMemo, useEffect } from "react";
import SongCard from "./SongCard";
import UpdateTrackMenu from "./track-menu/UpdateTrackMenu";
import AddTrackMenu from "./track-menu/AddTrackMenu";
import { validateForm } from "../../../../utils/formUtils";
import "../../../../styles/profile/overview/common/profile-songs-col.css";

interface Song {
  id: number;
  albumCover: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  hour: string;
  minute: string;
  day: string;
  month: string;
  year: string;
}

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
    const [songs, setSongs] = useState<Song[]>([
      {
        id: 1,
        albumCover: "/images/vinyl-icon.svg",
        title: "Song 1",
        artist: "Artist 1",
        album: "Album 1",
        genre: "Genre 1",
        hour: "12",
        minute: "30",
        day: "01",
        month: "01",
        year: "2025",
      },
      {
        id: 2,
        albumCover: "/images/vinyl-icon.svg",
        title: "Song 2",
        artist: "Artist 1",
        album: "Album 1",
        genre: "Genre 1",
        hour: "14",
        minute: "00",
        day: "02",
        month: "01",
        year: "2024",
      },
      {
        id: 3,
        albumCover: "/images/vinyl-icon.svg",
        title: "Song 3",
        artist: "Artist 1",
        album: "Album 1",
        genre: "Genre 1",
        hour: "14",
        minute: "00",
        day: "03",
        month: "01",
        year: "2023",
      },
      {
        id: 4,
        albumCover: "/images/vinyl-icon.svg",
        title: "Song 4",
        artist: "Artist 1",
        album: "Album 1",
        genre: "Genre 1",
        hour: "14",
        minute: "00",
        day: "04",
        month: "01",
        year: "2022",
      },
      {
        id: 5,
        albumCover: "/images/vinyl-icon.svg",
        title: "Song 5",
        artist: "Artist 1",
        album: "Album 1",
        genre: "Genre 1",
        hour: "14",
        minute: "00",
        day: "05",
        month: "01",
        year: "2024",
      },
      {
        id: 6,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 6',
        artist: 'Artist 2',
        album: 'Album 2',
        genre: 'Genre 2',
        hour: "12",
        minute: "30",
        day: "06",
        month: "01",
        year: "2023",
      },
      {
        id: 7,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 7',
        artist: 'Artist 2',
        album: 'Album 2',
        genre: 'Genre 2',
        hour: "12",
        minute: "30",
        day: "07",
        month: "01",
        year: "2023",
      },
      {
        id: 8,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 8',
        artist: 'Artist 2',
        album: 'Album 2',
        genre: 'Genre 2',
        hour: "12",
        minute: "30",
        day: "08",
        month: "01",
        year: "2024",
      },
      {
        id: 9,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 9',
        artist: 'Artist 2',
        album: 'Album 2',
        genre: 'Genre 2',
        hour: "12",
        minute: "30",
        day: "09",
        month: "01",
        year: "2022",
      },
      {
        id: 10,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 10',
        artist: 'Artist 2',
        album: 'Album 2',
        genre: 'Genre 2',
        hour: "12",
        minute: "30",
        day: "10",
        month: "01",
        year: "2024",
      },
      {
        id: 11,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 11',
        artist: 'Artist 3',
        album: 'Album 3',
        genre: 'Genre 3',
        hour: "12",
        minute: "30",
        day: "11",
        month: "01",
        year: "2023",
      },
      {
        id: 12,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 12',
        artist: 'Artist 3',
        album: 'Album 3',
        genre: 'Genre 3',
        hour: "12",
        minute: "30",
        day: "12",
        month: "01",
        year: "2025",
      },
      {
        id: 13,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 13',
        artist: 'Artist 3',
        album: 'Album 3',
        genre: 'Genre 3',
        hour: "12",
        minute: "30",
        day: "12",
        month: "01",
        year: "2025",
      },
      {
        id: 14,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 14',
        artist: 'Artist 3',
        album: 'Album 3',
        genre: 'Genre 3',
        hour: "12",
        minute: "30",
        day: "14",
        month: "02",
        year: "2024",
      },
      {
        id: 15,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 15',
        artist: 'Artist 3',
        album: 'Album 3',
        genre: 'Genre 3',
        hour: "12",
        minute: "30",
        day: "15",
        month: "01",
        year: "2025",
      },
      {
        id: 16,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 16',
        artist: 'Artist 4',
        album: 'Album 4',
        genre: 'Genre 4',
        hour: "12",
        minute: "30",
        day: "16",
        month: "01",
        year: "2025",
      },
      {
        id: 17,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 17',
        artist: 'Artist 4',
        album: 'Album 4',
        genre: 'Genre 4',
        hour: "12",
        minute: "30",
        day: "17",
        month: "01",
        year: "2025",
      },
      {
        id: 18,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 18',
        artist: 'Artist 4',
        album: 'Album 4',
        genre: 'Genre 4',
        hour: "12",
        minute: "30",
        day: "18",
        month: "01",
        year: "2025",
      },
      {
        id: 19,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 19',
        artist: 'Artist 4',
        album: 'Album 4',
        genre: 'Genre 4',
        hour: "12",
        minute: "30",
        day: "19",
        month: "01",
        year: "2025",
      },
      {
        id: 20,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 20',
        artist: 'Artist 4',
        album: 'Album 4',
        genre: 'Genre 4',
        hour: "12",
        minute: "30",
        day: "20",
        month: "01",
        year: "2025",
      },
      {
        id: 21,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 21',
        artist: 'Artist 5',
        album: 'Album 5',
        genre: 'Genre 5',
        hour: "12",
        minute: "30",
        day: "21",
        month: "01",
        year: "2025",
      },
      {
        id: 22,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 22',
        artist: 'Artist 5',
        album: 'Album 5',
        genre: 'Genre 5',
        hour: "12",
        minute: "30",
        day: "22",
        month: "01",
        year: "2025",
      },
      {
        id: 23,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 23',
        artist: 'Artist 5',
        album: 'Album 5',
        genre: 'Genre 5',
        hour: "12",
        minute: "30",
        day: "23",
        month: "01",
        year: "2025",
      },
      {
        id: 24,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 24',
        artist: 'Artist 5',
        album: 'Album 5',
        genre: 'Genre 5',
        hour: "12",
        minute: "30",
        day: "24",
        month: "01",
        year: "2025",
      },
      {
        id: 25,
        albumCover: '/images/vinyl-icon.svg',
        title: 'Song 25',
        artist: 'Artist 5',
        album: 'Album 5',
        genre: 'Genre 5',
        hour: "12",
        minute: "30",
        day: "25",
        month: "01",
        year: "2025",
      },
    ]);

    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 25;

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
      const interval = setInterval(() => {
        setSongs((prevSongs) => sortSongs([...prevSongs, generateRandomSong()]));
      }, 1000);
    
      const timeout = setTimeout(() => {
        clearInterval(interval); 
      }, 60000); 
    
      return () => {
        clearInterval(interval);
        clearTimeout(timeout); 
      };
    }, []);

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

    const handleAddSong = (e: React.FormEvent) => {
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

      setSongs((prevSongs) => sortSongs([...prevSongs, formattedSong]));
      setSuccessMessage("Track added successfully!");
      setError(null);
      handleCloseAddMenu();
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

    const handleUpdateSong = (id: number, updatedSong: Partial<Song>) => {
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

      setSongs((prevSongs) =>
        sortSongs(
          prevSongs.map((song) =>
            song.id === id ? { ...song, ...formattedSong } : song
          )
        )
      );
      handleCloseUpdateMenu();
    };

    const handleDeleteSong = (id: number) => {
      setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
    };

    const sortSongs = (songs: Song[]) => {
      return songs.sort((a, b) => {
        const dateA = new Date(
          parseInt(a.year),
          parseInt(a.month) - 1,
          parseInt(a.day),
          parseInt(a.hour),
          parseInt(a.minute)
        );
        const dateB = new Date(
          parseInt(b.year),
          parseInt(b.month) - 1,
          parseInt(b.day),
          parseInt(b.hour),
          parseInt(b.minute)
        );
        return dateB.getTime() - dateA.getTime(); 
      });
    };

    const padWithZero = (value: string) => {
      return value.padStart(2, "0");
    };

    const filteredSongs = useMemo(() => {
      let result = songs;
    
      if (filterByDate) {
        result = result.filter(filterByDate);
      }
    
      result = result.filter((song) => {
        if (selectedYear && song.year !== selectedYear) return false;
        if (selectedMonth && song.month !== selectedMonth.padStart(2, "0")) return false; 
        if (selectedDay && song.day !== selectedDay.padStart(2, "0")) return false; 
        return true;
      });
    
      return result;
    }, [songs, filterByDate, selectedYear, selectedMonth, selectedDay]);

    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
    const paginatedSongs = filteredSongs.slice(
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

    const groupedData = useMemo(() => {
      const data: { [key: string]: number } = {};
    
      if (!selectedYear) {
        songs.forEach((song) => {
          data[song.year] = (data[song.year] || 0) + 1;
        });
      } else if (!selectedMonth) {
        songs
          .filter((song) => song.year === selectedYear)
          .forEach((song) => {
            const monthKey = song.month.padStart(2, "0"); 
            data[monthKey] = (data[monthKey] || 0) + 1;
          });
      } else {
        songs
          .filter((song) => song.year === selectedYear && song.month === selectedMonth.padStart(2, "0"))
          .forEach((song) => {
            const dayKey = song.day.padStart(2, "0");
            data[dayKey] = (data[dayKey] || 0) + 1;
          });
      }
    
      return data;
    }, [songs, selectedYear, selectedMonth]);

    useEffect(() => {
      if (onGroupedData)
        onGroupedData!(groupedData);
    }, [groupedData, onGroupedData]);

    const assignHrColor = (index: number, total: number) => {
      const topThreshold = Math.floor(total / 3);
      const middleThreshold = Math.floor((2 * total) / 3);

      if (index < topThreshold) {
        return "green"; 
      } else if (index < middleThreshold) {
        return "orange";
      } else {
        return "red"; 
      }
    };

    return (
      <div className="profile-songs-col">
        {paginatedSongs.map((song, index) => {
          const hrColor = assignHrColor(index + (currentPage - 1) * 25, filteredSongs.length);

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

        <div className="pagination-controls">
          <div className="pagination-button-container" style={{ flex: "1 1 25%" }}>
            {currentPage > 1 && (
              <button
                onClick={handlePreviousPage}
                className="pagination-button"
              >
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
                  className={`pagination-button ${
                    page === currentPage ? "active" : ""
                  }`}
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
              <button
                onClick={handleNextPage}
                className="pagination-button"
              >
                Next
              </button>
            )}
          </div>
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