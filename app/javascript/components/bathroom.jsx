import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { WhiteTitle, GreySubText } from './typography';
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
        <div>
          <WhiteTitle>Bathroom Code</WhiteTitle>
          <GreySubText>{bathroomCode}</GreySubText>
        </div>
      );
    }}
  </Query>
);

export default Bathroom;
