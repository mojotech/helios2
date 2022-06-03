import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';
import styled from 'styled-components';
import { colors, fontSizes, spacing } from '@lib/theme';
import Tweet from '@twitter/tweet';
import { takeLast, splitAt } from 'ramda';

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

const TweetDivider = styled.div`
  margin-top: 81px;
  color: #959292;
  display: flex;
  margin-bottom: 16px;
  flex-wrap: no-wrap;
  justify-content: space-between;
  flex-direction: column;
  width: 45vw;
  font-size: ${fontSizes.small};
`;

const PanelWrapper = styled.div`
  overflow: hidden;
`;

const PreviousWrapper = styled.div`
  margin-left: 100px;
  break-inside: avoid;
`;

export const TabBar = () => (
  <svg width="1020" height="4" style={{ marginBottom: `${spacing.xxxl}` }}>
    <rect width="1020" height="1" fill={colors.white} opacity="0.2" />
  </svg>
);

const Twitter = ({ tweets }) => {
  const previous = takeLast(1, splitAt(1, tweets))[0];
  return (
    <PanelWrapper>
      <Tweet tweet={tweets[0]} isPrimary />
      <PreviousWrapper>
        <TweetDivider>Previous Tweets</TweetDivider>
        <TabBar />
        {previous.map(tweet => (
          <React.Fragment key={tweet.insertedAt}>
            <Tweet tweet={tweet} isPrimary={false} />
            <TabBar />
          </React.Fragment>
        ))}
      </PreviousWrapper>
    </PanelWrapper>
  );
};

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

const TwitterController = ({ startTimer }) => (
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

TwitterController.propTypes = {
  startTimer: PropTypes.func.isRequired,
};

export default TwitterController;
