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

const TweetBody = ({ text, mediaUrl, linkUrl }) => {
  if (mediaUrl === null && linkUrl === null) {
    return <TweetText text={text} />;
  }
  if (mediaUrl !== null && linkUrl !== null) {
    return (
      <BothMediaTypes
        displayText={text}
        mediaUrl={mediaUrl}
        linkUrl={linkUrl}
      />
    );
  }
  return (
    <OneMediaType displayText={text} mediaUrl={mediaUrl} linkUrl={linkUrl} />
  );
};

TweetBody.defaultProps = {
  mediaUrl: null,
  linkUrl: null,
};

TweetBody.propTypes = {
  text: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string,
  linkUrl: PropTypes.string,
};

export default TweetBody;
