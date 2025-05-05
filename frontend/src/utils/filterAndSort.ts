import { Song } from "@entities/song";

export const sortSongs = (songs: Song[]) => {
  return songs.sort((a, b) => {
    const dateA = new Date(a.dateListened);
    const dateB = new Date(b.dateListened);
    return dateB.getTime() - dateA.getTime(); // Sort in descending order
  });
};

export const filterSongs = (
  songs: Song[],
  from?: string | null,
  rangeType?: "all" | "year" | "month" | "day" | null
): Song[] => {
  const fromDate = from ? new Date(from) : null;

  return songs.filter((song) => {
    if (!fromDate) return true;

    const songDate = new Date(song.dateListened);

    if (rangeType === "year") {
      return songDate.getFullYear() === fromDate.getFullYear();
    } else if (rangeType === "month") {
      return (
        songDate.getFullYear() === fromDate.getFullYear() &&
        songDate.getMonth() === fromDate.getMonth()
      );
    } else if (rangeType === "day") {
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