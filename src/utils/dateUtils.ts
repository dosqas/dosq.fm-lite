export const formatDateListened = (day: string, month: string, year: string, hour: string, minute: string): string => {
  const now = new Date();
  const listenedDate = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1, // Months are 0-indexed in JavaScript
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10)
  );

  const diffInMs = now.getTime() - listenedDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    // Format as "17 Mar 19:20"
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    };
    return listenedDate.toLocaleDateString("en-GB", options);
  } else if (diffInHours > 0) {
    return `${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minutes ago`;
  } else {
    return "Just now";
  }
};