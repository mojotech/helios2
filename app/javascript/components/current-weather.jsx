import React from 'react';
import CurrentTemp from './current-temp';
import HourlyTemps from './hourly-temps';
import MinutelyWeather from './minutely-weather';
import DailyWeather from './daily-weather';
import SunriseSunset from './sunrise-sunset';
import { ExtendedTxt } from './typography';
import { Flex } from 'grid-styled';
import { fontSizes, spacing } from '../lib/theme';
import { InnerBound } from './Layout';
import styled from '../../../node_modules/styled-components';

const Column = styled(InnerBound)`
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`;

export default () => (
  <Column>
    <Flex alignItems={'center'}>
      <ExtendedTxt fontSize={fontSizes.huge} mr={spacing.xxl}>
        <CurrentTemp />
      </ExtendedTxt>
      <HourlyTemps />
    </Flex>
    <ExtendedTxt fontSize={fontSizes.large}>
      <MinutelyWeather />
    </ExtendedTxt>
    <SunriseSunset />
    <DailyWeather />
  </Column>
);
