import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { sort, prop, descend } from 'ramda';
import { SpacedRow } from './row';
import Time from './time';
import { spacing } from '../lib/theme';
import {
  LoadingMessage,
  ErrorMessage,
} from './widgets/messages/default-messages';

const Wrapper = styled(SpacedRow)`
  align-items: flex-end;
  margin-bottom: ${spacing.xxl};
`;

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

export const TimeHero = () => (
  <Wrapper>
    <Query query={getLocations}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }

        if (error) {
          return <ErrorMessage />;
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

export default TimeHero;
