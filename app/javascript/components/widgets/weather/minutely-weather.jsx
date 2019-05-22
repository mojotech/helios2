import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import withFragment from '../../hocs/with-fragment';
import { SmallSkyIcon, LargeSkyIcon } from './sky-icons';

const getMinutelyWeather = gql`
  fragment MinutelyWeather on Weather {
    minutely {
      summary
      icon
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MinutelyWeather = ({ weather, useLargeIcon }) => {
  const { summary, icon } = weather.minutely;
  return (
    <IconWrapper>
      {useLargeIcon ? (
        <LargeSkyIcon icon={icon} />
      ) : (
        <SmallSkyIcon icon={icon} />
      )}
      {summary}
    </IconWrapper>
  );
};

MinutelyWeather.propTypes = {
  weather: PropTypes.shape({
    minutely: PropTypes.shape({
      summary: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  useLargeIcon: PropTypes.bool,
};

MinutelyWeather.defaultProps = {
  useLargeIcon: false,
};

MinutelyWeather.fragments = {
  weather: getMinutelyWeather,
};

export default withFragment(MinutelyWeather);
