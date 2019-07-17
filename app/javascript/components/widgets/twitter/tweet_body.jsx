import React from 'react';
import PropTypes from 'prop-types';
import Microlink from '@microlink/react';
import styled from 'styled-components';
import { TweetText, TweetMedia, Text, MediaWrapper } from './tweet_content';
import { colors, fonts, fontSizes } from '../../../lib/theme';

const LinkText = styled(Text)`
  color: ${colors.white};
  text-decoration: underline;
  font-size: ${fontSizes.medium};
`;

const quoteStyle = {
  fontFamily: `${fonts.regular}`,
  height: '192px',
  color: `${colors.white}`,
  backgroundColor: `${colors.black}`,
  borderRadius: '6px',
  borderCollapse: 'separate',
  border: 'solid 1px #333333',
  paddingLeft: `24px`,
};

export const BothMediaTypes = ({ displayText, mediaUrl, linkUrl }) => (
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

export const QuoteTweet = ({ displayText, linkUrl }) => (
  <React.Fragment>
    <TweetText text={displayText} />
    <MediaWrapper>
      <Microlink url={linkUrl} style={quoteStyle} size="small" />
    </MediaWrapper>
  </React.Fragment>
);

QuoteTweet.propTypes = {
  displayText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
};

const removeRetweetSymbol = text => {
  return text.substr(text.indexOf(' ') + 1);
};

const TweetBody = ({ text, media: { image, link }, status }) => {
  // Twitter auto-adds the letters 'RT ' before each retweet
  const displayText = status === 'retweet' ? removeRetweetSymbol(text) : text;
  if (status === 'quote') {
    return <QuoteTweet displayText={displayText} linkUrl={link} />;
  }
  if (image === null && link === null) {
    return <TweetText text={text} />;
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
