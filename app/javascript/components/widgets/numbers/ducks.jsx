/* eslint-disable graphql/template-strings */
import React from 'react';
import { withQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { inflateSync, deflateSync } from 'zlib';
import { pathOr } from 'ramda';

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
    props: ({ data }) => {
      const nullState = {
        githubPull: 0,
        githubCommit: 0,
        slackMessage: 0,
      };
      const compressedWorld = pathOr(
        null,
        ['fallingBlocksState', 'world'],
        data,
      );
      return {
        localState: {
          ...nullState,
          ...data.fallingBlocksState,
          world:
            compressedWorld &&
            inflateSync(Buffer.from(compressedWorld, 'base64')).toString(),
        },
      };
    },
    options: {
      fetchPolicy: 'cache-first',
    },
  },
);
