import { AnticipatedPrecipitation } from './current-weather';

function genHourlyJson(id, id2 = id) {
  return [
    {
      weather: {
        id,
      },
    },
    {
      weather: {
        id: id2,
      },
    },
  ];
}

describe('AnticipatedPrecipitation component', () => {
  test('Light precipitation starting in 10 minutes and continuing past the hour.', () => {
    const precip = [];
    for (let i = 0; i < 61; i += 1) {
      if (i >= 0 && i < 10) {
        precip.push({ precipitation: 0.0 });
      } else {
        precip.push({ precipitation: 0.5 });
      }
    }
    const byHour = genHourlyJson(804);

    const weather = { minutely: precip, hourly: byHour };
    const result = AnticipatedPrecipitation({ weather });
    expect(result).toBe(
      'Light precipitation starting in 10 minutes and continuing past the hour.',
    );
  });
  test('Moderate precipitation starting in 10 minutes and ending in 50 minutes.', () => {
    const precip = [];
    for (let i = 0; i < 61; i += 1) {
      if (i >= 0 && i < 10) {
        precip.push({ precipitation: 0.0 });
      } else if (i >= 10 && i < 51) {
        precip.push({ precipitation: 4.5 });
      } else {
        precip.push({ precipitation: 0.0 });
      }
    }
    const byHour = genHourlyJson(804);
    const weather = { minutely: precip, hourly: byHour };
    const result = AnticipatedPrecipitation({ weather });
    expect(result).toBe(
      'Moderate precipitation starting in 10 minutes and ending in 50 minutes.',
    );
  });
  test('Moderate rain starting in 10 minutes and ending in 50 minutes.', () => {
    const precip = [];
    for (let i = 0; i < 61; i += 1) {
      if (i >= 0 && i < 10) {
        precip.push({ precipitation: 0.0 });
      } else if (i >= 10 && i < 51) {
        precip.push({ precipitation: 4.5 });
      } else {
        precip.push({ precipitation: 0.0 });
      }
    }
    const byHour = genHourlyJson(501);

    const weather = { minutely: precip, hourly: byHour };
    const result = AnticipatedPrecipitation({ weather });
    expect(result).toBe(
      'Moderate rain starting in 10 minutes and ending in 50 minutes.',
    );
  });
  test('Light snow starting in 10 minutes and continuing past the hour.', () => {
    const precip = [];
    for (let i = 0; i < 61; i += 1) {
      if (i >= 0 && i < 10) {
        precip.push({ precipitation: 0.0 });
      } else {
        precip.push({ precipitation: 0.5 });
      }
    }
    const byHour = genHourlyJson(602, 501);

    const weather = { minutely: precip, hourly: byHour };
    const result = AnticipatedPrecipitation({ weather });
    expect(result).toBe(
      'Light snow starting in 10 minutes and continuing past the hour.',
    );
  });
  test('Moderate sleet starting in 10 minutes and ending in 50 minutes.', () => {
    const precip = [];
    for (let i = 0; i < 61; i += 1) {
      if (i >= 0 && i < 10) {
        precip.push({ precipitation: 0.0 });
      } else if (i >= 10 && i < 51) {
        precip.push({ precipitation: 4.5 });
      } else {
        precip.push({ precipitation: 0.0 });
      }
    }
    const byHour = genHourlyJson(611, 801);

    const weather = { minutely: precip, hourly: byHour };
    const result = AnticipatedPrecipitation({ weather });
    expect(result).toBe(
      'Moderate sleet starting in 10 minutes and ending in 50 minutes.',
    );
  });
  test('Moderate rain and thunderstorms starting in 10 minutes and ending in 50 minutes.', () => {
    const precip = [];
    for (let i = 0; i < 61; i += 1) {
      if (i >= 0 && i < 10) {
        precip.push({ precipitation: 0.0 });
      } else if (i >= 10 && i < 51) {
        precip.push({ precipitation: 4.5 });
      } else {
        precip.push({ precipitation: 0.0 });
      }
    }
    const byHour = genHourlyJson(202, 801);

    const weather = { minutely: precip, hourly: byHour };
    const result = AnticipatedPrecipitation({ weather });
    expect(result).toBe(
      'Moderate rain and thunderstorms starting in 10 minutes and ending in 50 minutes.',
    );
  });
  test('Array with all 0s expects empty string to return', () => {
    const precip2 = [];
    for (let i = 0; i < 61; i += 1) {
      precip2.push({ precipitation: 0.0 });
    }
    const weather2 = { minutely: precip2 };
    const result = AnticipatedPrecipitation({ weather: weather2 });
    expect(result).toBe('');
  });
  test('Empty Array expects empty string to return', () => {
    const weather = { minutely: [] };
    const result = AnticipatedPrecipitation({ weather });
    expect(result).toBe('');
  });
});
