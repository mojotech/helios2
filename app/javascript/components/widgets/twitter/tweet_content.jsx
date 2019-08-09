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
  font-size: ${props =>
    props.primary ? `${fontSizes.large}` : `${fontSizes.small}`};
  margin-bottom: ${props => (props.primary ? '29px' : `${spacing.xl}`)};
`;

const TwitterImage = styled.img`
  height: ${props => (props.isMain ? '100%' : 'auto')};
  width: ${props => (!props.isMain ? '100%' : 'auto')};
  text-align: center;
`;

const ImageGrid = styled.div`
  display: inline-grid;
  height: 487px;
  width: ${props => (props.oneImg ? 'auto' : '100%')};
  grid-gap: ${spacing.s};
  grid-template-columns: auto auto;
  overflow: hidden;
  border-radius: 6px;
`;

const ImageWrapper = styled.div`
  display: flex;
  grid-row: ${props => (props.main ? ' 1 / 3' : 'auto')};
  justify-content: center;
  align-items: center;
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

export const TweetText = ({ text, isPrimary }) => (
  <Text primary={isPrimary}>
    {isPrimary ? (
      <Highlighter
        highlightStyle={highlighterStyle}
        searchWords={getMentionsAndTags(text)}
        textToHighlight={text}
      />
    ) : (
      text
    )}
  </Text>
);

TweetText.defaultProps = {
  isPrimary: true,
};

TweetText.propTypes = {
  text: PropTypes.string.isRequired,
  isPrimary: PropTypes.bool,
};

const imageLayout = images => {
  return images.map(image => {
    const isMain = image === images[0] && images.length === 3;
    return (
      <ImageWrapper main={isMain}>
        <TwitterImage isMain={isMain} src={image} alt="twitterMedia" />
      </ImageWrapper>
    );
  });
};

export const TweetMedia = ({ images, linkUrl }) => {
  return (
    <MediaWrapper>
      {images !== null && (
        <ImageGrid oneImg={images.length === 1}>
          {imageLayout(images)}
        </ImageGrid>
      )}
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
