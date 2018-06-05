export const timeForTimezone = timeZone =>
  new Date().toLocaleString([], {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  });

export const dateForTimezone = timeZone =>
  new Date().toLocaleString([], {
    timeZone,
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

const parseDatetime = datetime => new Date(Date.parse(datetime));

const isToday = datetime =>
  parseDatetime(datetime).toDateString() === new Date().toDateString();

const isTomorrow = datetime => {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(new Date().getDate() + 1);
  return parseDatetime(datetime).toDateString() === tomorrowDate.toDateString();
};

export const parseDay = datetime => {
  if (isToday(datetime)) {
    return 'Today';
  }
  if (isTomorrow(datetime)) {
    return 'Tomorrow';
  }
  return parseDatetime(datetime).toLocaleString([], {
    weekday: 'long',
  });
};
