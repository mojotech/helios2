import React from 'react';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

const getVersion = gql`
  {
    schemaSha
  }
`;

let lastValue = null;

export const Version = () => (
  <Subscription subscription={getVersion}>
    {({ loading, error, data }) => {
      if (loading || error) {
        return null;
      }

      const newValue = data.schemaSha;
      if (lastValue == null) {
        lastValue = newValue;
        console.log(lastValue);
        console.log(newValue);
      } else if (newValue !== lastValue) {
        lastValue = newValue;
        window.location.reload();
      }

      return newValue;
    }}
  </Subscription>
);

export default Version;
