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
  isPrimary,
}) {
  return (
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
