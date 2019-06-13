import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { WhiteSubTitle, WhiteTitleLarge } from './typography';
import {
  LoadingMessage,
  ErrorMessage,
} from './widgets/messages/default-messages';

const getBathroomCode = gql`
  {
    primaryLocation {
      bathroomCode
    }
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
`;

export const Bathroom = () => (
  <Query query={getBathroomCode}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage />;
      }

      const { bathroomCode } = data.primaryLocation;
      if (!bathroomCode) {
        return null;
      }

      return (
        <Column>
          <WhiteSubTitle>BATHROOM CODE</WhiteSubTitle>
          <WhiteTitleLarge>{bathroomCode}</WhiteTitleLarge>
        </Column>
      );
    }}
  </Query>
);

export default Bathroom;
