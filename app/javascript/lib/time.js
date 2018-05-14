export const timeForTimezone = timeZone =>
  new Date().toLocaleString([], {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  });

export default timeForTimezone;
