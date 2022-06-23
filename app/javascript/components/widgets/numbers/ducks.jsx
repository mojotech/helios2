/* eslint-disable graphql/template-strings */
import React from 'react';
import { withQuery } from 'react-apollo';
import gql from 'graphql-tag';

export const withLocalMutation = (WrappedComponent) =>
  // eslint-disable-next-line func-names
  function (props) {
    return (
      <WrappedComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...{
          ...props,
          mutation: ({ world }) => {
            // eslint-disable-next-line react/prop-types
            props.client.writeData({
              data: {
                fallingBlocksState: {
                  __typename: 'FallingBlocksState',
                  world,
                },
              },
            });
          },
        }}
      />
    );
  };

export const nullState = {
  world: null,
};

export const getState = ({
  fallingBlocksState: { world = null } = {},
} = {}) => {
  if (!Array.isArray(world)) {
    return nullState;
  }

  return { world };
};

export const withLocalState = withQuery(
  gql`
    {
      fallingBlocksState @client {
        world
      }
    }
  `,
  {
    props: ({ data }) => getState(data),
    options: {
      fetchPolicy: 'cache-first',
    },
  },
);
