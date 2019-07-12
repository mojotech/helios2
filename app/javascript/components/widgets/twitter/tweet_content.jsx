import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Highlighter from 'react-highlight-words';
import Microlink from '@microlink/react';
import { getMentionsAndTags } from '@lib/util';
import { colors, fonts, fontSizes } from '../../../lib/theme';

const MediaWrapper = styled.div`
  display: block;
  width: auto;
  height: auto;
  max-width: auto;
  max-height: 487px;
  margin-bottom: 29px;
`;

const MediaImage = styled.img`
  display: ${props => props.mediaDisplay};
  width: auto;
  height: auto;
  max-width: auto;
  max-height: 487px;
  border-radius: 6px;
  border-collapse: separate;
`;

export const Text = styled.div`
  color: #959292;
  font-size: ${fontSizes.large};
  margin-bottom: 29px;
`;

const highlighterStyle = {
  backgroundColor: 'transparent',
  color: `${colors.white}`,
};

const linkStyle = {
  fontFamily: `${fonts.regular}`,
  height: '487px',
  maxWidth: '100%',
  color: `${colors.white}`,
  backgroundColor: `${colors.black}`,
  borderRadius: '6px',
  borderCollapse: 'separate',
  border: 'solid 1px #333333',
};

export const TweetText = ({ text }) => (
  <Text>
    <Highlighter
      highlightStyle={highlighterStyle}
      searchWords={getMentionsAndTags(text)}
      textToHighlight={text}
    />
  </Text>
);

TweetText.propTypes = {
  text: PropTypes.string.isRequired,
};

export const TweetMedia = ({ mediaUrl, linkUrl }) => {
  return (
    <MediaWrapper>
      <MediaImage
        src={mediaUrl}
        alt="twitter"
        mediaDisplay={mediaUrl !== null ? 'block' : 'none'}
      />
      {linkUrl !== null && (
        <Microlink url={linkUrl} style={linkStyle} size="large" />
      )}
    </MediaWrapper>
  );
};

TweetMedia.defaultProps = {
  mediaUrl: null,
  linkUrl: null,
};

TweetMedia.propTypes = {
  mediaUrl: PropTypes.string,
  linkUrl: PropTypes.string,
};
