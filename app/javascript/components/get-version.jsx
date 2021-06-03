import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const getVersion = gql`
  {
    schemaSha
  }
`;

let lastValue = null;

export const Version = () => (
  <Query query={getVersion}>
    {({ loading, error, data }) => {
      if (loading || error) {
        return null;
      }

      const newValue = data.schemaSha;
      if (lastValue == null) {
        lastValue = newValue;
      } else if (newValue !== lastValue) {
        lastValue = newValue;
        window.location.reload();
      }

      return newValue;
    }}
  </Query>
);

export default Version;
