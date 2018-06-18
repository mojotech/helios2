import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const getMinutelyWeather = gql`
  {
    primaryLocation {
      weather {
        minutely {
          summary
        }
      }
    }
  }
`;

export default () => (
  <Query query={getMinutelyWeather}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage message={error.message} />;
      }

      const { summary } = data.primaryLocation.weather.minutely;
      return <span>{summary}</span>;
    }}
  </Query>
);
