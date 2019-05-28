import { utcToZonedTime } from 'date-fns-tz';
import {
  timeForTimezone,
  dateForTimezone,
  parseHour,
  parseTime,
  timeDiffInMinutes,
  isDateToday,
  isDateTomorrow,
  parseDay,
  getMostRecentDay,
} from './datetime';

describe('#timeForTimezone', () => {
  const timeZone = 'America/New_York';
  const datetime = '2020-05-13T04:00:00.000Z';
  it('returns the hour, minute and period for a timestamp in a specific timezone', () => {
    expect(timeForTimezone(timeZone, datetime)).toEqual('12:00 AM');
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

describe('#getMostRecentDay', () => {
  const today = new Date('Monday May 13, 2019');
  it('gets most recent Monday if today is Monday', () => {
    expect(getMostRecentDay('Monday', today)).toEqual('2019-05-13');
  });
  it('gets most recent Tuesday if today is Monday', () => {
    expect(getMostRecentDay('Tuesday', today)).toEqual('2019-05-07');
  });
});
