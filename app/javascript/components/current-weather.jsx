import React from 'react';
import styled from 'styled-components';
import CurrentTemp from './current-temp';
import HourlyTemps from './hourly-temps';
import MinutelyWeather from './minutely-weather';
import DailyWeather from './daily-weather';
import SunriseSunset from './sunrise-sunset';
import { Row } from './row';
import {
  colors,
  weights,
  fontSizes,
  spacing,
  fonts,
  leftPanelWidth,
} from '../lib/theme';
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
  font-size: ${fontSizes.huge};
  font-weight: ${weights.light};
  margin-right: ${spacing.xxxl};
  font-family: ${fonts.thin};
`;

const SummaryText = styled(WhiteText)`
  font-size: ${fontSizes.large};
  font-weight: ${weights.light};
  margin-top: 50px;
  margin-bottom: 50px;
  width: ${leftPanelWidth};
  text-align: center;
  font-family: ${fonts.light};
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
