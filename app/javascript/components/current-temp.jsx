import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { colors, weights } from '../lib/theme';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const TempText = styled.div`
  color: ${colors.white};
  font-size: 70px;
  font-weight: ${weights.light};
`;

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
        <TempText>
          {parseInt(data.primaryLocation.weather.currently.temperature, 10)}°
        </TempText>
      );
    }}
  </Query>
);
