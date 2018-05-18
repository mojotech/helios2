export const timeForTimezone = timeZone =>
  new Date().toLocaleString([], {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  });

export const dateForTimezone = timeZone =>
  new Date().toLocaleString([], {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const parseTime = datetime =>
  new Date(Date.parse(datetime))
    .toLocaleString([], {
      hour: 'numeric',
      hour12: true,
    })
    .split(' ')
    .join('')
    .toLowerCase();
