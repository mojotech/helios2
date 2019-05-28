import { format, isSameDay, differenceInMinutes, getDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const timeForTimezone = (timezone, date = new Date()) =>
  format(utcToZonedTime(new Date(date), timezone), 'hh:mm aa');

export const dateForTimezone = (timezone, date = new Date()) =>
  format(utcToZonedTime(new Date(date), timezone), 'EEEE, MMM dd, yyyy');

export const timeAndDateForTimezone = (timezone, date = new Date()) =>
  new Date(
    format(utcToZonedTime(new Date(date), timezone), "yyyy-MM-dd'T'HH:mm:ss"),
  );

export const parseHour = datetime =>
  format(new Date(datetime), 'haa').toLowerCase();

export const parseTime = datetime =>
  format(new Date(datetime), 'h:mm aa').toLowerCase();

export const timeDiffInMinutes = (date, other) =>
  differenceInMinutes(date, other);

export const isDateToday = datetime =>
  isSameDay(new Date(datetime), new Date());

export const isDateTomorrow = datetime =>
  isSameDay(new Date(datetime), new Date().setDate(new Date().getDate() + 1));

export const parseDay = datetime => {
  if (isDateToday(datetime)) return 'Today';
  if (isDateTomorrow(datetime)) return 'Tomorrow';
  return format(new Date(datetime), 'EEEE');
};

export const getWeekday = day => {
  const weekDays = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return weekDays[day];
};

export const getMostRecentDay = (day, today = new Date()) =>
  format(
    new Date(
      today.setDate(
        today.getDate() - ((getDay(today) + 7 - getWeekday(day)) % 7),
      ),
    ),
    'yyyy-MM-dd',
  );
