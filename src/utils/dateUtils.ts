export const formatDateListened = (day: string, month: string, year: string, hour: string, minute: string): string => {
  const formattedDay = day.padStart(2, "0");
  const formattedMonth = month.padStart(2, "0");
  const formattedHour = hour.padStart(2, "0");
  const formattedMinute = minute.padStart(2, "0");

  return `${formattedHour}:${formattedMinute}, ${formattedDay}/${formattedMonth}/${year}`;
};

export const parseDateListened = (dateListened: string) => {
  const [time, date] = dateListened.split(", ");
  const [hour, minute] = time.split(":");
  const [day, month, year] = date.split("/");

  return {
    hour,
    minute,
    day,
    month,
    year,
  };
};