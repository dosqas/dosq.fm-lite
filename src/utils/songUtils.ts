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