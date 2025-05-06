import { Artist } from "@entities/artist";

export const validateForm = (formData: {
  title: string | undefined;
  artist: Partial<Artist>;
  album: string;
  dateListened: string; // ISO 8601 string
}) => {
  if (!formData.title) return "Song Title is required.";
  if (!formData.artist || !formData.artist.artistId) return "Artist is required.";
  if (!formData.album) return "Album is required.";

  // Validate the dateListened field
  const date = new Date(formData.dateListened);
  if (isNaN(date.getTime())) {
    return "Invalid date.";
  }

  const now = new Date();
  now.setHours(now.getHours() + 3)
  if (date > now) {
    return "Date cannot be in the future.";
  }

  return null;
};