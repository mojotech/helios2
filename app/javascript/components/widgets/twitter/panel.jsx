import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';
import styled from 'styled-components';
import Tweet from '@twitter/tweet';
import { takeLast, splitAt } from 'ramda';
import 'react-responsive-carousel/lib/styles/carousel.css';
import { Carousel } from 'react-responsive-carousel';

const getMojoTweets = gql`
  query getTweets {
    tweets {
      status
      insertedAt
      text
      interactions {
        favoriteCount
        retweetCount
      }
      media {
        images {
          id
          mediaUrl
        }
        link
      }
      user {
        name
        handle
        avatar
      }
    }
  }
`;

const PanelWrapper = styled.div`
  overflow: hidden;
  height: 80%;
`;

function Twitter({ tweets }) {
  const previous = takeLast(1, splitAt(1, tweets))[0];
  return (
    <PanelWrapper>
      <Carousel
        width="50%"
        autoPlay
        showThumbs={false}
        interval={4000}
        showStatus={false}
      >
        <Tweet tweet={tweets[0]} isPrimary />
        {previous.map((tweet) => (
          <React.Fragment key={tweet.insertedAt}>
            <Tweet tweet={tweet} isPrimary={false} />
          </React.Fragment>
        ))}
      </Carousel>
    </PanelWrapper>
  );
}

Twitter.propTypes = {
  tweets: PropTypes.arrayOf(
    PropTypes.shape({
      insertedAt: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      interactions: PropTypes.shape({
        favoriteCount: PropTypes.number.isRequired,
        retweetCount: PropTypes.number.isRequired,
      }).isRequired,
      media: PropTypes.shape({
        images: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            mediaUrl: PropTypes.string.isRequired,
          }),
        ),
        link: PropTypes.string,
      }),
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        handle: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};

function TwitterController({ startTimer }) {
  return (
    <Query query={getMojoTweets} onCompleted={startTimer} onError={startTimer}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }

        if (error) {
          // eslint-disable-next-line
        console.error(error);
          return <DisconnectedMessage />;
        }

        return <Twitter tweets={data.tweets} />;
      }}
    </Query>
  );
}

TwitterController.propTypes = {
  startTimer: PropTypes.func.isRequired,
};

export default TwitterController;
