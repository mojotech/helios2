import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { assocPath } from 'ramda';
import SunriseSunset from '@weather/sunrise-sunset';

/* eslint-disable graphql/template-strings */
const getLocationWeather = (WeatherFrag, queryName) => gql`
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

${SunriseSunset.fragments.location}
${WeatherFrag}
`;

/* eslint-enable graphql/template-strings */

/* eslint-disable graphql/template-strings */
const subscribeWeatherPublished = (WeatherFrag, queryName) => gql`
  subscription onWeatherPublished($latitude: Float!, $longitude: Float!) {
    weatherPublished(latitude: $latitude, longitude: $longitude) {
      ...${queryName}
    }
  }

  ${WeatherFrag}
`;
/* eslint-enable graphql/template-strings */

export const WeatherQuery = ({
  Subscription,
  LoadingMessage,
  DisconnectedMessage,
  WeatherFrag,
  queryName,
  cityName,
}) => (
  <Query
    query={getLocationWeather(WeatherFrag, queryName)}
    variables={{ cityName }}
  >
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) {
        return <LoadingMessage />;
      }
      if (error) {
        console.error(error); // eslint-disable-line
        return <DisconnectedMessage />;
      }
      return (
        <Subscription
          primaryLocation={data.location}
          subscribeToPublishedEvents={() =>
            subscribeToMore({
              document: subscribeWeatherPublished(WeatherFrag, queryName),
              variables: {
                latitude: data.location.latitude,
                longitude: data.location.longitude,
              },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                const { weatherPublished } = subscriptionData.data;

                return assocPath(
                  ['primaryLocation', 'weather'],
                  weatherPublished,
                  prev,
                );
              },
            })
          }
        />
      );
    }}
  </Query>
);

WeatherQuery.propTypes = {
  Subscription: PropTypes.func.isRequired,
  LoadingMessage: PropTypes.func.isRequired,
  DisconnectedMessage: PropTypes.func.isRequired,
  WeatherFrag: PropTypes.shape({
    definitions: PropTypes.array.isRequired,
  }).isRequired,
  queryName: PropTypes.string.isRequired,
  cityName: PropTypes.string.isRequired,
};

export default WeatherQuery;
