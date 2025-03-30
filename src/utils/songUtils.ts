import { Song } from "../types/song";

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

export const validateForm = (formData: {
  title: string;
  artist: string;
  album: string;
  genre: string;
  hour: string;
  minute: string;
  day: string;
  month: string;
  year: string;
}) => {
  const hour = parseInt(formData.hour, 10);
  const minute = parseInt(formData.minute, 10);
  const day = parseInt(formData.day, 10);
  const month = parseInt(formData.month, 10);
  const year = parseInt(formData.year, 10);

  if (!formData.title) return "Song Title is required.";
  if (!formData.artist) return "Artist is required.";
  if (!formData.album) return "Album is required.";
  if (!formData.genre) return "Genre is required.";
  if (isNaN(hour) || hour < 0 || hour > 23) return "Hour must be between 0 and 23.";
  if (isNaN(minute) || minute < 0 || minute > 59) return "Minute must be between 0 and 59.";
  if (isNaN(day) || day < 1 || day > 31) return "Day must be between 1 and 31.";
  if (isNaN(month) || month < 1 || month > 12) return "Month must be between 1 and 12.";
  if (isNaN(year) || year < 1900 || year > 2100) return "Year must be between 1900 and 2100.";

  return null;
};

export const filterSongs = (
  songs: Song[],
  from?: string | null,
  rangeType?: "all" | "year" | "1month" | "1day" | null
): Song[] => {
  const fromDate = from ? new Date(from) : null;

  return songs.filter((song) => {
    if (!fromDate) return true; 

    const songDate = new Date(
      `${song.year}-${song.month.padStart(2, "0")}-${song.day.padStart(2, "0")}`
    );

    if (rangeType === "year") {
      return songDate.getFullYear() === fromDate.getFullYear();
    } else if (rangeType === "1month") {
      return (
        songDate.getFullYear() === fromDate.getFullYear() &&
        songDate.getMonth() === fromDate.getMonth()
      );
    } else if (rangeType === "1day") {
      return (
        songDate.getFullYear() === fromDate.getFullYear() &&
        songDate.getMonth() === fromDate.getMonth() &&
        songDate.getDate() === fromDate.getDate()
      );
    }

    // Default behavior for "all"
    return songDate >= fromDate;
  });
};

export const groupSongs = (
  songs: Song[],
  rangeType: "all" | "year" | "1month" | "1day"
): { [key: string]: number } => {
  return songs.reduce((acc: { [key: string]: number }, song) => {
    let key = "";

    if (rangeType === "all") {
      key = song.year; // Group by year
    } else if (rangeType === "year") {
      key = song.month.padStart(2, "0"); // Group by month
    } else if (rangeType === "1month") {
      key = song.day.padStart(2, "0"); // Group by day
    } else if (rangeType === "1day") {
      key = `${song.hour}:${song.minute}`; // Group by hour (if needed)
    }

    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
};