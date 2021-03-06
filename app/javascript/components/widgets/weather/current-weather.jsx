import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import withFragment from '@hocs/with-fragment';
import { SmallSkyIcon, LargeSkyIcon } from '@weather/sky-icons';

const getCurrentWeather = gql`
  fragment CurrentWeather on Weather {
    current {
      weather {
        description
        icon
      }
      windGust
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherDescription = ({ baseDescription, weather }) => {
  if (weather.current.windGust > 15) {
    return `${baseDescription}, gusty wind at ${weather.current.windGust} mph`;
  }
  return baseDescription;
};

const CurrentWeather = ({ weather, useLargeIcon }) => {
  const { description, icon } = weather.current.weather;
  return (
    <IconWrapper>
      {useLargeIcon ? (
        <LargeSkyIcon icon={icon} />
      ) : (
        <SmallSkyIcon icon={icon} />
      )}
      <WeatherDescription baseDescription={description} weather={weather} />
    </IconWrapper>
  );
};

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

CurrentWeather.fragments = {
  weather: getCurrentWeather,
};

export default withFragment(CurrentWeather);
