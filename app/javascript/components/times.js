import React from 'react';
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

const getLocations = gql`
  {
    locations {
      id
      cityName
      isPrimary
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
            {locations.map(({ id, isPrimary, cityName }) => (
              <Time key={id} {...{ isPrimary, cityName }} />
            ))}
          </React.Fragment>
        );
      }}
    </Query>
  </Wrapper>
);

export default Times;
