import {
  format,
  isSameDay,
  isAfter,
  differenceInMinutes,
  startOfWeek,
  formatISO,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const timeForTimezone = (timezone, date = new Date()) =>
  format(utcToZonedTime(new Date(date), timezone), 'h:mm aa');

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

export const parseMonthDate = datetime => format(new Date(datetime), 'MMM dd');

export const timeDiffInMinutes = (date, other) =>
  differenceInMinutes(date, other);

export const isDateToday = (datetime, today = new Date()) =>
  isSameDay(new Date(datetime), new Date(today));

export const isDateTomorrow = datetime =>
  isSameDay(new Date(datetime), new Date().setDate(new Date().getDate() + 1));

export const isDateInFuture = (datetime, datetimeToCompare = new Date()) =>
  isAfter(new Date(datetime), new Date(datetimeToCompare));

export const isInFutureToday = (datetime, today = new Date()) =>
  isDateToday(datetime, today) && isDateInFuture(datetime, today);

export const parseDay = datetime => {
  if (isDateToday(datetime)) return 'Today';
  if (isDateTomorrow(datetime)) return 'Tomorrow';
  return format(new Date(datetime), 'EEEE');
};

export const getStartOfWeek = () =>
  formatISO(startOfWeek(new Date(), { weekStartsOn: 1 }));
