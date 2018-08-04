import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import withFragment from '../../hocs/with-fragment';

const getMinutelyWeather = gql`
  fragment MinutelyWeather on Weather {
    minutely {
      summary
    }
  }
`;

const MinutelyWeather = ({ weather }) => {
  const { summary } = weather.minutely;
  return <span>{summary}</span>;
};

MinutelyWeather.propTypes = {
  weather: PropTypes.shape({
    minutely: PropTypes.shape({
      summary: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

MinutelyWeather.fragments = {
  weather: getMinutelyWeather,
};

export default withFragment(MinutelyWeather);
