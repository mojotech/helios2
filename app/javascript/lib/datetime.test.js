import { utcToZonedTime } from 'date-fns-tz';
import {
  timeForTimezone,
  dateForTimezone,
  parseHour,
  parseTime,
  parseDate,
  timeDiffInMinutes,
  isDateToday,
  isDateTomorrow,
  isDateInFuture,
  isInFutureToday,
  parseDay,
} from './datetime';

describe('#timeForTimezone', () => {
  const timeZone = 'America/New_York';
  const datetime = '2020-05-13T05:00:00.000Z';
  it('returns the hour, minute and period for a timestamp in a specific timezone', () => {
    expect(timeForTimezone(timeZone, datetime)).toEqual('1:00 AM');
  });
});

describe('#dateForTimezone', () => {
  const timeZone = 'America/New_York';
  const datetime = '2020-04-13T04:00:00.000Z';
  it('returns weekday, month, day, year for a timestamp in a specific timezone', () => {
    expect(dateForTimezone(timeZone, datetime)).toEqual('Monday, Apr 13, 2020');
  });
});

describe('#parseHour', () => {
  const datetime = utcToZonedTime(
    new Date('2019-05-28T10:00:00.000Z'),
    'America/New_York',
  );
  it('parses the hour in a datetime', () => {
    expect(parseHour(datetime)).toEqual('6am');
  });
});

describe('#parseTime', () => {
  const datetime = utcToZonedTime(
    new Date('2019-05-28T10:35:00.000Z'),
    'America/New_York',
  );
  it('parses the time in a datetime', () => {
    expect(parseTime(datetime)).toEqual('6:35 am');
    expect(parseTime(datetime)).toEqual('6:35 am');
  });
});

describe('#parseDate', () => {
  const datetime = utcToZonedTime(
    new Date('2019-05-28T10:35:00.000Z'),
    'America/New_York',
  );
  it('parses the date in a datetime', () => {
    expect(parseDate(datetime)).toEqual('Tuesday, May 28, 2019');
  });
});

describe('#timeDiffInMinutes', () => {
  const date1 = new Date(2014, 6, 2, 12, 20, 0);
  const date2 = new Date(2014, 6, 2, 12, 7, 59);
  it('returns difference of two timestamps in minutes', () => {
    expect(timeDiffInMinutes(date1, date2)).toEqual(12);
  });
});

describe('#isDateToday', () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  it('returns true if the given date is today', () => {
    expect(isDateToday(today)).toEqual(true);
    expect(isDateToday(tomorrow)).toEqual(false);
  });
});

describe('#isDateTomorrow', () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  it('returns true if the given date is tomorrow', () => {
    expect(isDateTomorrow(today)).toEqual(false);
    expect(isDateTomorrow(tomorrow)).toEqual(true);
  });
});

describe('#isDateInFuture', () => {
  const before = new Date(2014, 6, 2, 12, 20, 0);
  const after = new Date(2016, 6, 2, 12, 20, 0);
  it('returns true if the first date is after the second', () => {
    expect(isDateInFuture(after, before)).toEqual(true);
  });
});

describe('#isDateInFuture', () => {
  const now = new Date(2016, 6, 2, 12, 20, 0);
  const todayFuture = new Date(2016, 6, 2, 14, 20, 0);
  const todayPast = new Date(2016, 6, 2, 9, 20, 0);
  const tomorrow = new Date(2016, 6, 3, 12, 20, 0);
  const yesterday = new Date(2016, 6, 1, 12, 20, 0);
  it('returns true if date is in future and is today', () => {
    expect(isInFutureToday(todayFuture, now)).toEqual(true);
    expect(isInFutureToday(todayPast, now)).toEqual(false);
    expect(isInFutureToday(tomorrow, now)).toEqual(false);
    expect(isInFutureToday(yesterday, now)).toEqual(false);
  });
});

describe('#parseDay', () => {
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const afterTomorrow = new Date();
  afterTomorrow.setDate(today.getDate() + 2);
  const weekdayAfterTomorrow = weekdays[afterTomorrow.getDay()];

  it('returns name of day for a given datetime', () => {
    expect(parseDay(today)).toEqual('Today');
    expect(parseDay(tomorrow)).toEqual('Tomorrow');
    expect(parseDay(afterTomorrow)).toEqual(weekdayAfterTomorrow);
  });
});
