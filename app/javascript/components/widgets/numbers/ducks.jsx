/* eslint-disable graphql/template-strings */
import React from 'react';
import { withQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { inflateSync, deflateSync } from 'zlib';

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
              world: deflateSync(Buffer.from(variables.world)).toString(
                'base64',
              ),
            },
          },
        });
      },
    }}
  />
);

export const nullState = {
  githubPull: 0,
  githubCommit: 0,
  slackMessage: 0,
  world: null,
};

export const getState = ({
  fallingBlocksState: {
    githubCommit = 0,
    githubPull = 0,
    slackMessage = 0,
    world = null,
  } = {},
} = {}) => {
  if (!world) {
    return nullState;
  }

  try {
    return {
      githubCommit,
      githubPull,
      slackMessage,
      world: inflateSync(Buffer.from(world, 'base64')).toString(),
    };
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.warn(`Failed to inflate world: ${ex}`);
    return nullState;
  }
};

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
    props: ({ data }) => ({ localState: getState(data) }),
    options: {
      fetchPolicy: 'cache-first',
    },
  },
);
