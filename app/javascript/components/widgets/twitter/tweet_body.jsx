import React from 'react';
import PropTypes from 'prop-types';
import Microlink from '@microlink/react';
import styled from 'styled-components';
import {
  TweetText,
  TweetMedia,
  Text,
  MediaWrapper,
} from '@twitter/tweet_content';
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

export const BothMediaTypes = ({ displayText, images, linkUrl }) => (
  <>
    <div>
      <TweetText text={displayText} />
      <LinkText>{linkUrl}</LinkText>
    </div>
    <TweetMedia images={images} linkUrl={undefined} />
  </>
);

BothMediaTypes.defaultProps = {
  images: null,
  linkUrl: null,
};

BothMediaTypes.propTypes = {
  displayText: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  linkUrl: PropTypes.string,
};

const OneMediaType = ({ displayText, images, linkUrl }) => (
  <>
    <div>
      <TweetText text={displayText} />
    </div>
    <TweetMedia images={images} linkUrl={linkUrl} />
  </>
);

OneMediaType.defaultProps = {
  images: null,
  linkUrl: null,
};

OneMediaType.propTypes = {
  displayText: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  linkUrl: PropTypes.string,
};

export const QuoteTweet = ({ displayText, linkUrl }) => (
  <>
    <TweetText text={displayText} />
    <MediaWrapper>
      <Microlink url={linkUrl} style={quoteStyle} size="small" />
    </MediaWrapper>
  </>
);

QuoteTweet.defaultProps = {
  linkUrl: null,
};

QuoteTweet.propTypes = {
  displayText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string,
};

const removeRetweetSymbol = text => {
  return text.substr(text.indexOf(' ') + 1);
};

const TweetBody = ({ text, media: { images, link }, status }) => {
  // Twitter auto-adds the letters 'RT ' before each retweet
  const displayText = status === 'retweet' ? removeRetweetSymbol(text) : text;
  if (status === 'quote') {
    return <QuoteTweet displayText={displayText} linkUrl={link} />;
  }
  if (images === null && link === null) {
    return <TweetText text={text} />;
  }
  if (images !== null && link !== null) {
    return (
      <BothMediaTypes
        displayText={displayText}
        images={images}
        linkUrl={link}
      />
    );
  }
  return (
    <OneMediaType displayText={displayText} images={images} linkUrl={link} />
  );
};

TweetBody.propTypes = {
  text: PropTypes.string.isRequired,
  media: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
  }).isRequired,
  status: PropTypes.string.isRequired,
};

export default TweetBody;
