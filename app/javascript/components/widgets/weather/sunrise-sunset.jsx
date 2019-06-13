import React from 'react';
import gql from 'graphql-tag';
import { take, takeLast, splitWhen, replace, toUpper } from 'ramda';
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
    solarcycles {
      type
      time
    }
  }
`;

const getSunriseSunsetWeather = gql`
  fragment SunriseSunsetWeather on Weather {
    daily {
      data {
        moonPhase
      }
    }
  }
`;

const SunriseSunset = ({ location, weather }) => {
  const { timezone, solarcycles } = location;
  const currDate = new Date();

  const [beforeNow, afterNow] = splitWhen(
    cycle => new Date(cycle.time).getTime() - currDate.getTime() > 0,
    solarcycles,
  );
  const beginTime = takeLast(1, beforeNow)[0];
  const endTime = take(1, afterNow)[0];

  const capitalize = replace(/^./, toUpper());

  const isNight = beginTime.type === 'sunset';

  return (
    <SunriseSunsetContainer>
      <SemiCircle
        totalTime={timeDiffInMinutes(
          new Date(endTime.time),
          new Date(beginTime.time),
        )}
        endTime={new Date(endTime.time)}
        width={leftPanelWidth}
        height={containerHeight}
        timezone={timezone}
        nightMode={isNight}
        moonPhase={weather.daily.data[0].moonPhase}
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
    solarcycles: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
  weather: PropTypes.shape({
    daily: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          moonPhase: PropTypes.number.isRequired,
        }),
      ),
    }).isRequired,
  }).isRequired,
};

SunriseSunset.fragments = {
  location: getSunriseSunsetLocation,
  weather: getSunriseSunsetWeather,
};

export default withFragment(SunriseSunset);
