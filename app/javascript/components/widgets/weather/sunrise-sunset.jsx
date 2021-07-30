import React from 'react';
import gql from 'graphql-tag';
import { isEmpty, take, takeLast, splitWhen, replace, toUpper } from 'ramda';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  colors,
  fontSizes,
  weights,
  spacing,
  leftPanelWidth,
} from '@lib/theme';
import { parseTime, timeDiffInMinutes } from '@lib/datetime';
import { WhiteText } from '@components/typography';
import withFragment from '@hocs/with-fragment';
import SemiCircle from '@weather/semi-circle';
import WeatherEffect, { getWeatherEffect } from '@weather/weather-effect';

const containerHeight = '344px';

const SunriseSunsetContainer = styled.div`
  width: ${leftPanelWidth};
  height: ${containerHeight};
  position: relative;
  top: 0px;
`;

const Text = styled(WhiteText)`
  font-size: ${fontSizes.small};
`;

const Time = styled.div`
  font-size: ${fontSizes.small};
  margin-top: ${spacing.m};
  color: ${colors.grey};
  font-weight: ${weights.light};
  margin-top: ${spacing.s};
`;

const SunriseLabel = styled.div`
  position: absolute;
  top: 252px;
  left: 14px;
  z-index: 2;
`;

const SunsetLabel = styled.div`
  position: absolute;
  top: 252px;
  left: 739px;
  z-index: 2;
`;

export const getSunriseSunsetWeather = gql`
  fragment SunriseSunsetWeather on Weather {
    ...WeatherEffect
  }
  ${getWeatherEffect}
`;

export const getSunriseSunsetLocation = gql`
  fragment SunriseSunsetLocation on Location {
    timezone
    moonPhase
    cityName
    solarCycles {
      type
      time
    }
  }
`;

export const SunriseSunset = ({ location, weather }) => {
  const { solarCycles, timezone, cityName, moonPhase } = location;

  const currDate = new Date();

  const [beforeNow, afterNow] = splitWhen(
    cycle => new Date(cycle.time).getTime() - currDate.getTime() > 0,
    solarCycles,
  );

  if (isEmpty(beforeNow) || isEmpty(afterNow)) {
    // eslint-disable-next-line no-console
    console.warn({ currDate, beforeNow, afterNow, ...location });
    return (
      <SunriseSunsetContainer>
        <WeatherEffect weather={weather} />
      </SunriseSunsetContainer>
    );
  }

  const beginTime = takeLast(1, beforeNow)[0];
  const endTime = take(1, afterNow)[0];

  const capitalize = replace(/^./, toUpper());

  const isNight = beginTime.type === 'sunset';

  return (
    <SunriseSunsetContainer>
      <WeatherEffect weather={weather} />
      <SemiCircle
        totalTime={timeDiffInMinutes(
          new Date(endTime.time),
          new Date(beginTime.time),
        )}
        endTime={new Date(endTime.time)}
        width={leftPanelWidth}
        height={containerHeight}
        timezone={timezone}
        cityName={cityName}
        nightMode={isNight}
        moonPhase={moonPhase}
      />
      <SunriseLabel>
        <Text>{capitalize(beginTime.type)}</Text>
        <Time>{parseTime(beginTime.time)}</Time>
      </SunriseLabel>
      <SunsetLabel>
        <Text>{capitalize(endTime.type)} </Text>
        <Time>{parseTime(endTime.time)}</Time>
      </SunsetLabel>
    </SunriseSunsetContainer>
  );
};

SunriseSunset.propTypes = {
  location: PropTypes.shape({
    timezone: PropTypes.string.isRequired,
    moonPhase: PropTypes.number.isRequired,
    cityName: PropTypes.string.isRequired,
    solarCycles: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  weather: PropTypes.shape({}).isRequired,
};

export default withFragment(SunriseSunset, {
  weather: getSunriseSunsetWeather,
  location: getSunriseSunsetLocation,
});
