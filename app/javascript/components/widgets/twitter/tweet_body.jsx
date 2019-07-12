import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Highlighter from 'react-highlight-words';
import { getMentionsAndTags } from '@lib/util';
import { fontSizes, colors } from '../../../lib/theme';

const TweetText = styled.div`
  color: #959292;
  font-size: ${fontSizes.large};
  margin-bottom: 29px;
`;

const highlighterStyle = {
  backgroundColor: 'transparent',
  color: `${colors.white}`,
};

const TweetBody = ({ text }) => {
  return (
    <TweetText>
      <Highlighter
        highlightStyle={highlighterStyle}
        searchWords={getMentionsAndTags(text)}
        textToHighlight={text}
      />
    </TweetText>
  );
};

TweetBody.propTypes = {
  text: PropTypes.string.isRequired,
};

export default TweetBody;
