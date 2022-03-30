import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { GreySubText } from '@components/typography';
import { fontSizes, sidePanelWidth } from '@lib/theme';
import sunMoon from '@images/sunmoon.png';

export const LoadingMessage = () => <Message message="Loading..." />;
export const DisconnectedMessage = () => (
  <Message message="Looks like we're disconnected" />
);
export const NoAnnouncementsMessage = () => (
  <Message message="No announcements today" />
);
export const WeatherLoadingMessage = () => <WeatherMessage />;
export const WeatherDisconnectedMessage = () => <WeatherMessage />;
export const WidgetDisabledMessage = () => (
  <Message message="No widget enabled" />
);

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

const Message = ({ message }) => {
  return (
    <Column>
      <SunMoon src={sunMoon} />
      <MessageDisplay>{message}</MessageDisplay>
    </Column>
  );
};

const WeatherMessage = () => {
  return <SidePanelSpacing />;
};

Message.propTypes = {
  message: PropTypes.string.isRequired,
};
export default Message;
