export const timeForTimezone = timeZone =>
  new Date().toLocaleString('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  });

export const dateForTimezone = timeZone =>
  new Date().toLocaleString('en-US', {
    timeZone,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const timeAndDateForTimezone = timezone =>
  new Date(
    new Date().toLocaleString('en-US', {
      timezone,
    }),
  );

export const parseHour = datetime =>
  new Date(Date.parse(datetime))
    .toLocaleString('en-US', {
      hour: 'numeric',
      hour12: true,
    })
    .split(' ')
    .join('')
    .toLowerCase();

export const parseTime = datetime =>
  new Date(Date.parse(datetime))
    .toLocaleString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
    })
    .toLowerCase();

export const timeDiffInMinutes = (date, other) => {
  const difference = date.getTime() - other.getTime();
  return Math.round(difference / 60000);
};

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
  return parseDatetime(datetime).toLocaleString('en-US', {
    weekday: 'long',
  });
};
