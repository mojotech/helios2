import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
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

const getLocation = gql`
  {
    primaryLocation {
      timezone
    }
  }
`;

export const TimeHero = () => (
  <Wrapper>
    <Query query={getLocation}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }

        if (error) {
          return <ErrorMessage />;
        }

        return <Time timezone={data.primaryLocation.timezone} />;
      }}
    </Query>
  </Wrapper>
);

export default TimeHero;
