import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { assocPath } from 'ramda';
import SunriseSunset from '@weather/sunrise-sunset';

/* eslint-disable graphql/template-strings */
const getLocationWeather = (WeatherFrag, queryName) => gql`
query getLocationWeather($loc: String!) {
  location(cityName: $loc) {
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
  location,
}) => (
  <Query
    query={getLocationWeather(WeatherFrag, queryName)}
    variables={{ loc: location.pathname.substring(1) }}
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
          primaryLocation={data.location[0]}
          subscribeToPublishedEvents={() =>
            subscribeToMore({
              document: subscribeWeatherPublished(WeatherFrag, queryName),
              variables: {
                latitude: data.location[0].latitude,
                longitude: data.location[0].longitude,
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
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default WeatherQuery;
