export interface Song {
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
  
  export const addSong = (songs: Song[], newSong: Song): Song[] => {
    return sortSongs([...songs, newSong]);
  };
  
  export const updateSong = (songs: Song[], id: number, updatedSong: Partial<Song>): Song[] => {
    return sortSongs(songs.map((song) => (song.id === id ? { ...song, ...updatedSong } : song)));
  };
  
  export const deleteSong = (songs: Song[], id: number): Song[] => {
    return songs.filter((song) => song.id !== id);
  };
  
  export const filterSongs = (
    songs: Song[],
    selectedYear?: string | null,
    selectedMonth?: string | null,
    selectedDay?: string | null
  ): Song[] => {
    let parsedDay: string | null | undefined = selectedDay;
    if (selectedDay && selectedDay.includes(" ")) {
      const [day] = selectedDay.split(" "); 
      parsedDay = day.padStart(2, "0"); 
    }
  
    return songs.filter((song) => {
      if (selectedYear && song.year !== selectedYear) return false;
      if (selectedMonth && song.month !== selectedMonth.padStart(2, "0")) return false;
      if (parsedDay && song.day !== parsedDay) return false;
      return true;
    });
  };
  
  export const groupSongsByDate = (
    songs: Song[],
    selectedYear?: string | null,
    selectedMonth?: string | null
  ): { [key: string]: number } => {
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
  };
  
  export const assignHrColor = (index: number, total: number): string => {
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

  export const sortSongs = (songs: Song[]) => {
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