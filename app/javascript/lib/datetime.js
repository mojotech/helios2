import { format, isSameDay, differenceInMinutes, startOfWeek } from 'date-fns';
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

export const parseDate = datetime =>
  format(new Date(datetime), 'EEEE, MMM dd, yyyy');

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

export const getStartOfWeek = () =>
  startOfWeek(new Date(), { weekStartsOn: 1 }).toUTCString();
