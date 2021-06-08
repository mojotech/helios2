import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const location = {
  timezone: 'America/New_York',
  solarCycles: [
    { type: 'sunset', time: '2021-06-09T00:18:31Z' },
    { type: 'sunrise', time: '2021-06-09T09:10:37Z' },
    { type: 'sunset', time: '2021-06-10T00:19:07Z' },
    { type: 'sunrise', time: '2021-06-10T09:10:26Z' },
  ],
};

const weather = { moonPhase: 1, current: { weather: { id: 803 } } };

describe('SunriseSunset component', () => {
  const mockDate = new Date('2021-06-09T00:18:31Z');
  const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

  // TODO: Something is wrong with our jest/nodejs. Fresh projects can correctly
  // import and then mock. Our project requires the mock to exist prior to
  // importing so we have this hack require right here.
  // eslint-disable-next-line global-require
  const { SunriseSunset } = require('./sunrise-sunset');
  const renderer = ReactTestRenderer.create(
    <SunriseSunset location={location} weather={weather} />,
  );

  it('should render without exceptions', () => {
    renderer.toJSON();
  });

  spy.mockRestore();
});
