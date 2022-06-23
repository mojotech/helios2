import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GreySubText } from '@components/typography';
import { fontSizes, sidePanelWidth } from '@lib/theme';
import sunMoon from '@images/sunmoon.png';

export function LoadingMessage() {
  return <Message message="Loading..." />;
}
export function DisconnectedMessage() {
  return <Message message="Looks like we're disconnected" />;
}
export function WeatherLoadingMessage() {
  return <WeatherMessage />;
}
export function WeatherDisconnectedMessage() {
  return <WeatherMessage />;
}
export function WidgetDisabledMessage() {
  return <Message message="No widget enabled" />;
}

const MessageDisplay = styled(GreySubText)`
  font-size: ${fontSizes.medium};
  text-align: center;
`;

const SidePanelSpacing = styled.div`
  height: 136px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: calc(50vh - 200px);
  margin-right: ${sidePanelWidth}px;
`;

const SunMoon = styled.img`
  width: 100px;
  height: 100px;
  align-self: center;
`;

function Message({ message }) {
  return (
    <Column>
      <SunMoon src={sunMoon} />
      <MessageDisplay>{message}</MessageDisplay>
    </Column>
  );
}

function WeatherMessage() {
  return <SidePanelSpacing />;
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
};
export default Message;
