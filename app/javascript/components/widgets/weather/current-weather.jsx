import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import withFragment from '@hocs/with-fragment';
import { SmallSkyIcon, LargeSkyIcon } from '@weather/sky-icons';

export const getCurrentWeather = gql`
  fragment CurrentWeather on Weather {
    current {
      weather {
        description
        icon
      }
      windGust
    }
    minutely {
      precipitation
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const DescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const WeatherDescription = ({ baseDescription, weather }) => {
  if (weather.current.windGust > 15) {
    return `${baseDescription}, gusty wind at ${weather.current.windGust} mph`;
  }
  return baseDescription;
};

export const AnticipatedPrecipitation = ({ weather }) => {
  const precip = [];
  for (let i = 0; i < weather.minutely.length; i += 1) {
    if (weather.minutely[i].precipitation !== 0) {
      precip.push({ minute: i, value: weather.minutely[i].precipitation });
    }
  }
  if (precip.length === 0) {
    return '';
  }
  const averagePrecipitation =
    precip.reduce((acc, val) => acc + val.value, 0) / precip.length;
  let descStart = `in ${precip[0].minute} minutes`;
  let descEnd = `ending in ${precip[precip.length - 1].minute} minutes.`;
  if (precip[0].minute === 0) {
    descStart = `now`;
  }
  if (precip[precip.length - 1].minute === 60) {
    descEnd = `continuing past the hour.`;
  }
  switch (true) {
    case averagePrecipitation > 50.0:
      return `Violent precipitation starting ${descStart} and ${descEnd}`;
    case averagePrecipitation > 7.5:
      return `Heavy precipitation starting ${descStart} and ${descEnd}`;
    case averagePrecipitation > 2.5:
      return `Moderate precipitation starting ${descStart} and ${descEnd}`;
    default:
      return `Light precipitation starting ${descStart} and ${descEnd}`;
  }
};

function CurrentWeather({ weather, useLargeIcon }) {
  const { description, icon } = weather.current.weather;
  return (
    <div>
      <IconWrapper>
        {useLargeIcon ? (
          <LargeSkyIcon icon={icon} />
        ) : (
          <SmallSkyIcon icon={icon} />
        )}
        <WeatherDescription baseDescription={description} weather={weather} />
      </IconWrapper>
      <DescriptionWrapper>
        <AnticipatedPrecipitation weather={weather} />
      </DescriptionWrapper>
    </div>
  );
}

CurrentWeather.propTypes = {
  weather: PropTypes.shape({
    current: PropTypes.shape({
      weather: PropTypes.shape({
        description: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  useLargeIcon: PropTypes.bool,
};

CurrentWeather.defaultProps = {
  useLargeIcon: false,
};

export default withFragment(CurrentWeather, { weather: getCurrentWeather });
