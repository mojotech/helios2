import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { assocPath } from 'ramda';
import CurrentTemp from './current-temp';
import MinutelyWeather from './minutely-weather';
import { LoadingMessage, ErrorMessage } from '../messages/default-messages';

const getPrimaryLocationWeather = gql`
  {
    primaryLocation {
      latitude
      longitude
      weather {
        ...CurrentTemp
        ...MinutelyWeather
      }
    }
  }

  ${CurrentTemp.fragments.weather}
  ${MinutelyWeather.fragments.weather}
`;

const subscribeWeatherPublished = gql`
  subscription onWeatherPublished($latitude: Float!, $longitude: Float!) {
    weatherPublished(latitude: $latitude, longitude: $longitude) {
      ...CurrentTemp
      ...MinutelyWeather
    }
  }

  ${CurrentTemp.fragments.weather}
  ${MinutelyWeather.fragments.weather}
`;

class SubscribedWeather extends React.Component {
  componentDidMount() {
    this.props.subscribeToPublishedEvents();
  }

  render() {
    const { primaryLocation } = this.props;
    const { weather } = primaryLocation;
    return (
      <div>
        <CurrentTemp weather={weather} /> -
        <MinutelyWeather weather={weather} />
      </div>
    );
  }
}

SubscribedWeather.propTypes = {
  primaryLocation: PropTypes.shape({
    weather: PropTypes.shape({}).isRequired,
  }).isRequired,
  subscribeToPublishedEvents: PropTypes.func.isRequired,
};

export default () => (
  <Query query={getPrimaryLocationWeather}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage />;
      }

      return (
        <SubscribedWeather
          primaryLocation={data.primaryLocation}
          subscribeToPublishedEvents={() =>
            subscribeToMore({
              document: subscribeWeatherPublished,
              variables: {
                latitude: data.primaryLocation.latitude,
                longitude: data.primaryLocation.longitude,
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
