import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { parseMonthDate } from '@lib/datetime';
import TwitterProfile from '@twitter/tweet_profile';
import TweetStats from '@twitter/tweet_stats';
import TweetBody from '@twitter/tweet_body';

const TweetWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: column;
  width: 45vw;
  break-inside: avoid;
`;

function Tweet({
  tweet: { status, insertedAt, text, interactions, media, user },
}) {
  return (
    <TweetWrapper>
      <TwitterProfile dateCreated={parseMonthDate(insertedAt)} user={user} />
      <TweetBody text={text} media={media} status={status} />
      <TweetStats interactions={interactions} />
    </TweetWrapper>
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
};

export default Tweet;
