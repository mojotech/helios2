import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';

const getLivestreamUrl = gql`
  {
    primaryLocation {
      livestreamUrl
    }
  }
`;
const Wrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  overflow: hidden;
`;

const LiveStream = () => (
  <Query query={getLivestreamUrl}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <DisconnectedMessage />;
      }

      const { livestreamUrl } = data.primaryLocation;
      return (
        <Wrapper>
          <iframe
            title="livestream"
            width={window.innerWidth}
            height={window.innerHeight}
            src={livestreamUrl}
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </Wrapper>
      );
    }}
  </Query>
);

export default LiveStream;
