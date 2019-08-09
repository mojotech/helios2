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
      <TweetText text={displayText} isPrimary />
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
    <TweetText text={displayText} isPrimary />
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

const TweetBody = ({ text, media: { images, link }, status, isPrimary }) => {
  // Twitter auto-adds the letters 'RT ' before each retweet
  if (status === 'quote') {
    return <QuoteTweet displayText={text} linkUrl={link} />;
  }
  if ((images === null && link === null) || !isPrimary) {
    return <TweetText text={text} isPrimary={isPrimary} />;
  }
  if (images !== null && link !== null) {
    return <BothMediaTypes displayText={text} images={images} linkUrl={link} />;
  }
  return <OneMediaType displayText={text} images={images} linkUrl={link} />;
};

TweetBody.propTypes = {
  text: PropTypes.string.isRequired,
  media: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
  }).isRequired,
  status: PropTypes.string.isRequired,
  isPrimary: PropTypes.bool.isRequired,
};

export default TweetBody;
