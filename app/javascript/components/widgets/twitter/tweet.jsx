import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, fontSizes } from '@lib/theme';
import { parseMonthDate } from '@lib/datetime';
import TwitterProfile from '@twitter/tweet_profile';
import TweetStats from '@twitter/tweet_stats';
import TweetBody from '@twitter/tweet_body';
import retweetIcon from '@icons/icon-retweet.svg';

const TweetWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: column;
  width: 45vw;
  margin-left: ${(props) => (props.primary ? '100px' : '0px')};
  break-inside: avoid;
`;

const RetweetBanner = styled.div`
  font-size: ${(props) =>
    props.primary ? `${fontSizes.small}` : `${fontSizes.tiny}`};
  color: ${colors.white};
  opacity: 0.5;
  margin-left: 32px;
`;

const RetweetWrapper = styled.div`
  display: ${(props) => props.displayStyle};
  flex-wrap: no-wrap;
  justify-content: flex-start;
  width: 18vw;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 24px;
  margin-left: ${(props) => (props.primary ? '100px' : '0px')};
`;

const RetweetIcon = styled.img`
  height: ${(props) => (props.primary ? '18px' : '16px')};
`;

function Tweet({
  tweet: { status, insertedAt, text, interactions, media, user },
  isPrimary,
}) {
  return (
    <>
      <RetweetWrapper
        displayStyle={status === 'retweet' ? 'flex' : 'none'}
        primary={isPrimary}
      >
        <RetweetIcon src={retweetIcon} alt="retweeted" primary={isPrimary} />
        <RetweetBanner>MojoTech Retweeted</RetweetBanner>
      </RetweetWrapper>

      <TweetWrapper primary={isPrimary}>
        <TwitterProfile
          dateCreated={parseMonthDate(insertedAt)}
          user={user}
          isPrimary={isPrimary}
        />
        <TweetBody
          text={text}
          media={media}
          status={status}
          isPrimary={isPrimary}
        />
        <TweetStats interactions={interactions} isPrimary={isPrimary} />
      </TweetWrapper>
    </>
  );
}

Tweet.propTypes = {
  tweet: PropTypes.shape({
    status: PropTypes.string.isRequired,
    insertedAt: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    interactions: PropTypes.shape({
      favoriteCount: PropTypes.number.isRequired,
      retweetCount: PropTypes.number.isRequired,
    }).isRequired,
    media: PropTypes.shape({
      image: PropTypes.arrayOf(PropTypes.string),
      link: PropTypes.string,
    }).isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      handle: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  isPrimary: PropTypes.bool.isRequired,
};

export default Tweet;
