import React from 'react';
import styled from 'styled-components';
import CurrentTemp from './current-temp';
import HourlyTemps from './hourly-temps';
import MinutelyWeather from './minutely-weather';
import DailyWeather from './daily-weather';
import { Row } from './row';

const CenteredRow = styled(Row)`
  align-items: center;
`;

export default () => (
  <div>
    <CenteredRow>
      <CurrentTemp />
      <HourlyTemps />
    </CenteredRow>
    <MinutelyWeather />
    <DailyWeather />
  </div>
);
