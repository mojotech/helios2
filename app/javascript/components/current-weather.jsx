import React from 'react';
import styled from 'styled-components';
import CurrentTemp from './current-temp';
import HourlyTemps from './hourly-temps';
import MinutelyWeather from './minutely-weather';
import DailyWeather from './daily-weather';
import SunriseSunset from './sunrise-sunset';
import { Row } from './row';
import { colors, weights, fontSizes, spacing } from '../lib/theme';
import { WhiteText } from './typography';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const CenteredRow = styled(Row)`
  align-items: center;
`;

const TempText = styled.div`
  color: ${colors.white};
  font-size: 70px;
  font-weight: ${weights.light};
`;

const SummaryText = styled(WhiteText)`
  font-size: ${fontSizes.xlarge};
  font-weight: ${weights.light};
  margin-top: ${spacing.xl};
  padding: 0 100px;
`;

export default () => (
  <Column>
    <CenteredRow>
      <TempText>
        <CurrentTemp />
      </TempText>
      <HourlyTemps />
    </CenteredRow>
    <SummaryText>
      <MinutelyWeather />
    </SummaryText>
    <SunriseSunset />
    <DailyWeather />
  </Column>
);
