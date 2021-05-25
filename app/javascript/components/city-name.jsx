import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { WhiteTitleLarge } from '@components/typography';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';

const getCityName = gql`
  {
    primaryLocation {
      cityName
    }
  }
`;

export const City = () => (
  <Query query={getCityName}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage />;
      }

      const { cityName } = data.primaryLocation;
      return cityName && <WhiteTitleLarge>{cityName}</WhiteTitleLarge>;
    }}
  </Query>
);

export default City;
