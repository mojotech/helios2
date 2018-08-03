import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const getCurrentTemp = gql`
  {
    primaryLocation {
      weather {
        currently {
          temperature
        }
      }
    }
  }
`;

export default () => (
  <Query query={getCurrentTemp}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage message={error.message} />;
      }

      return (
        <span>
          {parseInt(data.primaryLocation.weather.currently.temperature, 10)}°
        </span>
      );
    }}
  </Query>
);
