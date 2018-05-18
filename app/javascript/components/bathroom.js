import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { spacing } from '../lib/theme';
import { WhiteTitle, GreySubText } from './typography';

const LoadingMessage = () => <p>Loading...</p>;

const ErrorMessage = ({ message }) => <p>Error: {message}</p>;

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
        return <ErrorMessage message={error.message} />;
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
