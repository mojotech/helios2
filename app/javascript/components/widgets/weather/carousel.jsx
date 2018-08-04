import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { path } from 'ramda';
import CurrentTemp from './current-temp';
import MinutelyWeather from './minutely-weather';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const getPrimaryLocationWeather = gql`
  {
    primaryLocation {
      weather {
        ...CurrentTemp
        ...MinutelyWeather
      }
    }
  }

  ${CurrentTemp.fragments.weather}
  ${MinutelyWeather.fragments.weather}
`;

export default () => (
  <Query query={getPrimaryLocationWeather}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage message={error.message} />;
      }

      const weather = path(['primaryLocation', 'weather'], data);
      return (
        <div>
          <CurrentTemp weather={weather} /> -
          <MinutelyWeather weather={weather} />
        </div>
      );
    }}
  </Query>
);
