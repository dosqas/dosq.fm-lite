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