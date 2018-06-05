import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { weights, fontSizes, spacing } from '../lib/theme';
import { WhiteText } from './typography';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const SummaryText = styled(WhiteText)`
  font-size: ${fontSizes.xlarge};
  font-weight: ${weights.light};
  margin-top: ${spacing.xl};
  padding: 0 100px;
`;

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
      return <SummaryText>{summary}</SummaryText>;
    }}
  </Query>
);
