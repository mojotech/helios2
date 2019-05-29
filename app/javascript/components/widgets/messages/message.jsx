import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GreySubText } from '../../typography';
import { fontSizes, leftPanelWidth } from '../../../lib/theme';
import sunMoon from '../../../../assets/images/sunmoon.png';

export const LoadingMessage = () => <Message message="Loading..." />;
export const DisconnectedMessage = () => (
  <Message message="Looks like we're disconnected" />
);

const MessageDisplay = styled(GreySubText)`
  font-size: ${fontSizes.medium};
  text-align: center;
  width: ${leftPanelWidth};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px
  margin-bottom: 500px
  height: 100%;
`;

const Message = ({ width, height, message, imageWidth, imageHeight }) => {
  const widthFloat = parseFloat(width);
  const heightFloat = parseFloat(height);

  const svgWidth = width;
  const svgHeight = height;
  return (
    <Column>
      <svg width={svgWidth} height={svgHeight}>
        <image
          x={((widthFloat - parseFloat(imageWidth)) / 2).toString()}
          y={(heightFloat - parseFloat(imageHeight) + 1).toString()}
          width={imageWidth}
          height={imageHeight}
          xlinkHref={sunMoon}
          position="absolute"
        />
      </svg>
      <MessageDisplay>{message}</MessageDisplay>
    </Column>
  );
};

Message.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  message: PropTypes.string.isRequired,
  imageHeight: PropTypes.string,
  imageWidth: PropTypes.string,
};

Message.defaultProps = {
  width: leftPanelWidth,
  height: '344px',
  imageHeight: '100px',
  imageWidth: '100px',
};

export default Message;
