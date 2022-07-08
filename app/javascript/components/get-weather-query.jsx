import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { getSunriseSunsetLocation } from '@weather/sunrise-sunset';

/* eslint-disable graphql/template-strings */
const getLocationWeather = (WeatherFrag, queryName) => gql`
${getSunriseSunsetLocation}
query getLocationWeather($cityName: String!) {
  location(cityName: $cityName) {
    latitude
    longitude
    ...SunriseSunsetLocation
    weather {
      ...${queryName}
    }
  }
}

${WeatherFrag}
`;

export function WeatherQuery({
  Subscription,
  LoadingMessage,
  DisconnectedMessage,
  WeatherFrag,
  queryName,
  cityName,
  startTimer,
}) {
  return (
    <Query
      query={getLocationWeather(WeatherFrag, queryName)}
      variables={{ cityName }}
      onCompleted={startTimer}
      onError={startTimer}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }
        if (error) {
        console.error(error); // eslint-disable-line
          return <DisconnectedMessage />;
        }

        return <Subscription location={data.location} />;
      }}
    </Query>
  );
}

WeatherQuery.propTypes = {
  Subscription: PropTypes.func.isRequired,
  LoadingMessage: PropTypes.func.isRequired,
  DisconnectedMessage: PropTypes.func.isRequired,
  WeatherFrag: PropTypes.shape({
    definitions: PropTypes.arrayOf.isRequired,
  }).isRequired,
  queryName: PropTypes.string.isRequired,
  cityName: PropTypes.string.isRequired,
  startTimer: PropTypes.func.isRequired,
};

export default WeatherQuery;
