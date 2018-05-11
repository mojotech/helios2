import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({message}) => <p>Error: {message}</p>;

const getWeather = gql`
  query weather($latitude: Float!, $longitude: Float!) {
    weather(latitude: $latitude, longitude: $longitude) {
      currently {
        summary
        temperature
        time
        icon
      }
      minutely {
        summary
        icon
      }
      hourly {
        data {
          summary
          temperature
          time
        }
      }
      daily {
        summary
        icon
        data {
          time
          sunriseTime
          sunsetTime
          summary
          temperatureLow
          temperatureHigh
        }
      }
    }
  } 
`;

const SampleWeather =  ({ data: { currently, hourly, daily } }) => (
  <div>
    <p>Currently</p>
    <pre>
      {JSON.stringify(currently, null, 2) }
    </pre>
    <p>Hourly</p>
    <pre>
      {JSON.stringify(hourly.data.slice(5), null, 2) }
    </pre>
    <p>Daily</p>
    <pre>
      {JSON.stringify(daily.data.slice(5), null, 2) }
    </pre>
  </div>
);

SampleWeather.propsTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default ({ latitude, longitude }) => (
  <Query query={getWeather} variables={{ latitude, longitude }}>
    {({ loading, error, data }) => {
      if(loading) {
        return <LoadingMessage />;
      }

      if(error) {
        return <ErrorMessage message={error.message} />;
      }

      return <SampleWeather data={data["weather"]} />;
    }}
  </Query>
);
