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
import retweetIcon from '@icons/icon-retweet.svg';

const getMojoTweets = gql`
  query getTweets {
    tweets {
      status
      createdAt
      text
      interactions {
        favoriteCount
        retweetCount
      }
      media {
        image
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

const RetweetBanner = styled.div`
  font-size: ${fontSizes.small};
  color: ${colors.white};
  opacity: 0.5;
  margin-left: 32px;
  position: absolute;
`;

const RetweetWrapper = styled.div`
  display: ${props => (props.displayStyle === 'retweet' ? 'flex' : 'none')};
  flex-wrap: no-wrap;
  justify-content: flex-start;
  width: 18vw;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 24px;
  padding-left: 100px;
`;

export const TabBar = () => (
  <svg width="960" height="4">
    <rect width="960" height="1" fill={colors.white} opacity="0.2" />
  </svg>
);

const Twitter = ({ tweets }) => {
  const latestTweet = tweets[0];
  const { status, createdAt, text, interactions, media, user } = latestTweet;

  return (
    <PanelWrapper>
      <RetweetWrapper displayStyle={status}>
        <img src={retweetIcon} alt="retweeted" />
        <RetweetBanner>MojoTech Retweeted</RetweetBanner>
      </RetweetWrapper>

      <TweetWrapper>
        <TwitterProfile dateCreated={parseMonthDate(createdAt)} user={user} />
        <TweetBody text={text} media={media} status={status} />
        <TweetStats interactions={interactions} />
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
      interactions: PropTypes.shape({
        favoriteCount: PropTypes.number.isRequired,
        retweetCount: PropTypes.number.isRequired,
      }).isRequired,
      media: PropTypes.shape({
        image: PropTypes.string,
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
