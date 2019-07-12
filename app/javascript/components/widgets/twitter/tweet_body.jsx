import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fontSizes } from '../../../lib/theme';

const TweetText = styled.div`
  color: #959292;
  font-size: ${fontSizes.large};
  margin-bottom: 29px;
`;

const TweetBody = ({ text }) => {
  return <TweetText>{text}</TweetText>;
};

TweetBody.propTypes = {
  text: PropTypes.string.isRequired,
};

export default TweetBody;
