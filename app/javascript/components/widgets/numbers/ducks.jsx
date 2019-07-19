/* eslint-disable graphql/template-strings */
import React from 'react';
import { withQuery } from 'react-apollo';
import gql from 'graphql-tag';

export const withLocalMutation = WrappedComponent => props => (
  <WrappedComponent
    {...{
      ...props,
      mutation: variables => {
        // eslint-disable-next-line react/prop-types
        props.client.writeData({
          data: {
            fallingBlocksState: {
              __typename: 'FallingBlocksState',
              ...variables,
            },
          },
        });
      },
    }}
  />
);

export const withLocalState = withQuery(
  gql`
    {
      fallingBlocksState @client {
        githubCommit
        githubPull
        slackMessage
        world
      }
    }
  `,
  {
    props: ({ data }) => ({ localState: data.fallingBlocksState }),
    options: {
      fetchPolicy: 'cache-first',
    },
  },
);
