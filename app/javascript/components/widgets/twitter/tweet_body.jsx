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

const TweetBody = ({ text, media: { image, link } }) => {
  if (image === null && link === null) {
    return <TweetText text={text} />;
  }
  if (image !== null && link !== null) {
    return (
      <BothMediaTypes displayText={text} mediaUrl={image} linkUrl={link} />
    );
  }
  return <OneMediaType displayText={text} mediaUrl={image} linkUrl={link} />;
};

TweetBody.propTypes = {
  text: PropTypes.string.isRequired,
  media: PropTypes.shape({
    image: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
};

export default TweetBody;
