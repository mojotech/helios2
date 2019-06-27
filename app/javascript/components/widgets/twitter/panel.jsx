import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';
import styled from 'styled-components';
import { colors, fontSizes } from '@lib/theme';
import { parseMonthDate } from '@lib/datetime';
import TwitterProfile from '@twitter/tweet_profile';
import TweetStats from '@twitter/tweet_stats';
import TweetBody from '@twitter/tweet_body';

const getMojoTweets = gql`
  query getTweets {
    tweets {
      createdAt
      text
      favoriteCount
      retweetCount
      media
      link
    }
  }
`;

const TweetWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: column;
  width: 45vw;
  padding-left: 100px;
  break-inside: avoid;
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
  <svg width="960" height="4">
    <rect width="960" height="1" fill={colors.white} opacity="0.2" />
  </svg>
);

const Twitter = ({ tweets }) => {
  const latestTweet = tweets[0];
  const {
    createdAt,
    text,
    favoriteCount,
    retweetCount,
    media,
    link,
  } = latestTweet;

  return (
    <PanelWrapper>
      <TweetWrapper>
        <TwitterProfile dateCreated={parseMonthDate(createdAt)} />
        <TweetBody text={text} mediaUrl={media} linkUrl={link} />
        <TweetStats favorites={favoriteCount} retweets={retweetCount} />
      </TweetWrapper>
      <PreviousWrapper>
        <TweetDivider>Previous Tweets</TweetDivider>
        <TabBar />
      </PreviousWrapper>
    </PanelWrapper>
  );
};

Twitter.propTypes = {
  tweets: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      favoriteCount: PropTypes.number.isRequired,
      retweetCount: PropTypes.number.isRequired,
      media: PropTypes.string,
      link: PropTypes.string,
    }),
  ).isRequired,
};

export default () => (
  <Query query={getMojoTweets}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <DisconnectedMessage />;
      }

      return <Twitter tweets={data.tweets} />;
    }}
  </Query>
);
