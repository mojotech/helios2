import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  colors,
  fontSizes,
  weights,
  spacing,
  leftPanelWidth,
} from '../../../lib/theme';
import { parseTime, timeDiffInMinutes } from '../../../lib/datetime';
import { WhiteText } from '../../typography';
import withFragment from '../../hocs/with-fragment';
import SemiCircle from './semi-circle';

const containerHeight = '344px';

const SunriseSunsetContainer = styled.div`
  margin-top: ${spacing.xxl};
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

const getSunriseSunsetLocation = gql`
  fragment SunriseSunsetLocation on Location {
    timezone
  }
`;

const getSunriseSunsetWeather = gql`
  fragment SunriseSunsetWeather on Weather {
    daily {
      data {
        sunriseTime
        sunsetTime
      }
    }
  }
`;

const SunriseSunset = ({ weather, location }) => {
  const { sunriseTime, sunsetTime } = weather.daily.data[0];
  const { timezone } = location;

  return (
    <SunriseSunsetContainer>
      <SemiCircle
        totalTime={timeDiffInMinutes(
          new Date(sunsetTime),
          new Date(sunriseTime),
        )}
        sunset={new Date(sunsetTime)}
        width={leftPanelWidth}
        height={containerHeight}
        timezone={timezone}
      />
      <SunriseLabel>
        <Text> Sunrise </Text>
        <Time>{parseTime(sunriseTime)}</Time>
      </SunriseLabel>
      <SunsetLabel>
        <Text> Sunset </Text>
        <Time>{parseTime(sunsetTime)}</Time>
      </SunsetLabel>
    </SunriseSunsetContainer>
  );
};

SunriseSunset.propTypes = {
  weather: PropTypes.shape({
    daily: PropTypes.shape({
      data: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    timezone: PropTypes.string.isRequired,
  }).isRequired,
};

SunriseSunset.fragments = {
  location: getSunriseSunsetLocation,
  weather: getSunriseSunsetWeather,
};

export default withFragment(SunriseSunset);
