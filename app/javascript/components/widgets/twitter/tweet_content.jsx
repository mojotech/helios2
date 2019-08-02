import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Highlighter from 'react-highlight-words';
import Microlink from '@microlink/react';
import { getMentionsAndTags } from '@lib/util';
import { colors, fonts, fontSizes, spacing } from '../../../lib/theme';

export const MediaWrapper = styled.div`
  display: block;
  width: auto;
  height: auto;
  max-width: auto;
  max-height: 487px;
  margin-bottom: 29px;
`;

export const Text = styled.div`
  color: #959292;
  font-size: ${fontSizes.large};
  margin-bottom: 29px;
`;

const TwitterImage = styled.img`
  height: ${props => (props.oneImg ? '487px' : 'auto')};
  width: auto;
`;

const ImageGrid = styled.div`
  display: inline-grid;
  height: 487px;
  width: 100%;
  grid-gap: ${spacing.s};
  grid-template-columns: auto auto;
  overflow: hidden;
  border-radius: 6px;
`;

const ImageWrapper = styled.div`
  grid-row: ${props => (props.main ? ' 1 / 3' : 'auto')};
  overflow: hidden;
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

const imageLayout = images => {
  return images.map(image => {
    const isMain = image === images[0] && images.length === 3;
    return (
      <ImageWrapper main={isMain}>
        <TwitterImage
          src={image}
          alt="twitterMedia"
          oneImg={images.length === 1}
        />
      </ImageWrapper>
    );
  });
};

export const TweetMedia = ({ images, linkUrl }) => {
  return (
    <MediaWrapper>
      {images !== null && <ImageGrid>{imageLayout(images)}</ImageGrid>}
      {linkUrl !== null && (
        <Microlink url={linkUrl} style={linkStyle} size="large" />
      )}
    </MediaWrapper>
  );
};

TweetMedia.defaultProps = {
  images: null,
  linkUrl: null,
};

TweetMedia.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  linkUrl: PropTypes.string,
};
