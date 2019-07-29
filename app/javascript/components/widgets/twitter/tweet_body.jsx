import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TweetText, TweetMedia, Text } from './tweet_content';
import { colors, fontSizes } from '../../../lib/theme';

const LinkText = styled(Text)`
  color: ${colors.white};
  text-decoration: underline;
  font-size: ${fontSizes.medium};
`;

const BothMediaTypes = ({ displayText, mediaUrl, linkUrl }) => (
  <>
    <div>
      <TweetText text={displayText} />
      <LinkText>{linkUrl}</LinkText>
    </div>
    <TweetMedia mediaUrl={mediaUrl} linkUrl={undefined} />
  </>
);

BothMediaTypes.propTypes = {
  displayText: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
};

const OneMediaType = ({ displayText, mediaUrl, linkUrl }) => (
  <>
    <div>
      <TweetText text={displayText} />
    </div>
    <TweetMedia mediaUrl={mediaUrl} linkUrl={linkUrl} />
  </>
);

OneMediaType.propTypes = {
  displayText: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
};

const removeRetweetSymbol = text => {
  return text.substr(text.indexOf(' ') + 1);
};

const TweetBody = ({ text, media: { image, link }, status }) => {
  // Twitter auto-adds the letters 'RT ' before each retweet
  const displayText = status === 'retweet' ? removeRetweetSymbol(text) : text;
  if (image === null && link === null) {
    return <TweetText text={displayText} />;
  }
  if (image !== null && link !== null) {
    return (
      <BothMediaTypes
        displayText={displayText}
        mediaUrl={image}
        linkUrl={link}
      />
    );
  }
  return (
    <OneMediaType displayText={displayText} mediaUrl={image} linkUrl={link} />
  );
};

TweetBody.propTypes = {
  text: PropTypes.string.isRequired,
  media: PropTypes.shape({
    image: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  status: PropTypes.string.isRequired,
};

export default TweetBody;
