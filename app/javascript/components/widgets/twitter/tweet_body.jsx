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
import { AllHtmlEntities as Entities } from 'html-entities';
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

export function BothMediaTypes({ displayText, images, linkUrl }) {
  return (
    <>
      <div>
        <TweetText text={displayText} />
        <LinkText>{linkUrl}</LinkText>
      </div>
      <TweetMedia images={images} linkUrl={undefined} />
    </>
  );
}
BothMediaTypes.defaultProps = {
  images: null,
  linkUrl: null,
};
BothMediaTypes.propTypes = {
  displayText: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      mediaUrl: PropTypes.string.isRequired,
    }),
  ),
  linkUrl: PropTypes.string,
};
function OneMediaType({ displayText, images, linkUrl }) {
  return (
    <>
      <div>
        <TweetText text={displayText} isPrimary />
      </div>
      <TweetMedia images={images} linkUrl={linkUrl} />
    </>
  );
}
OneMediaType.defaultProps = {
  images: null,
  linkUrl: null,
};
OneMediaType.propTypes = {
  displayText: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      mediaUrl: PropTypes.string.isRequired,
    }),
  ),
  linkUrl: PropTypes.string,
};
export function QuoteTweet({ displayText, linkUrl }) {
  return (
    <>
      <TweetText text={displayText} isPrimary />
      <MediaWrapper>
        <Microlink url={linkUrl} style={quoteStyle} size="small" />
      </MediaWrapper>
    </>
  );
}
QuoteTweet.defaultProps = {
  linkUrl: null,
};
QuoteTweet.propTypes = {
  displayText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string,
};

function TweetBody({ text, media: { images, link }, status, isPrimary }) {
  const displayText = new Entities().decode(text);

  // Twitter auto-adds the letters 'RT ' before each retweet
  if (status === 'quote') {
    return <QuoteTweet displayText={displayText} linkUrl={link} />;
  }
  if (images !== null && !isPrimary) {
    return (
      <OneMediaType
        displayText={displayText}
        images={images}
        linkUrl={undefined}
      />
    );
  }
  if (images === null && link === null) {
    return <TweetText text={displayText} isPrimary={isPrimary} />;
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
}

TweetBody.propTypes = {
  text: PropTypes.string.isRequired,
  media: PropTypes.shape({
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        mediaUrl: PropTypes.string.isRequired,
      }),
    ),
    link: PropTypes.string,
  }).isRequired,
  status: PropTypes.string.isRequired,
  isPrimary: PropTypes.bool.isRequired,
};

export default TweetBody;
