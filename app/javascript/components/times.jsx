import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { sort, prop, descend } from 'ramda';
import { SpacedRow } from './row';
import Time from './time';
import { spacing } from '../lib/theme';

const Wrapper = styled(SpacedRow)`
  align-items: flex-end;
  margin-bottom: ${spacing.xxl};
`;

const LoadingMessage = () => <p>Loading...</p>;

const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const getLocations = gql`
  {
    locations {
      id
      cityName
      isPrimary
      timezone
    }
  }
`;

export const Times = () => (
  <Wrapper>
    <Query query={getLocations}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }

        if (error) {
          return <ErrorMessage message={error.message} />;
        }

        const locations = sort(descend(prop('isPrimary')), data.locations);

        return (
          <React.Fragment>
            {locations.map(({ id, isPrimary, cityName, timezone }) => (
              <Time key={id} {...{ isPrimary, cityName, timezone }} />
            ))}
          </React.Fragment>
        );
      }}
    </Query>
  </Wrapper>
);

export default Times;
