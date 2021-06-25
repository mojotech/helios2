import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DisconnectedMessage, LoadingMessage } from '@messages/message';
import FullPanel from '@components/full-panel';
import SidePanel from '@components/side-panel';
import Twitter from '@widgets/twitter';
import Numbers from '@widgets/numbers';
import Weather from '@widgets/weather';
import Traffic from '@widgets/traffic';

const Wrapper = styled.div`
  outline: none;
`;

const widgetElements = {
  Weather,
  Twitter,
  Numbers,
  Traffic,
};

export const WidgetDisplay = ({
  keyToWidgetAction,
  clickToWidgetAction,
  isPaused,
  cityName,
  widgets,
}) => {
  const { byIdOrFirst: current, enabled: enabledWidgets } = widgets;
  const WidgetElement = widgetElements[current.name].Panel;
  return (
    <Wrapper
      onKeyDown={keyToWidgetAction}
      onClick={clickToWidgetAction}
      // eslint-disable-next-line
      tabIndex="0"
    >
      <FullPanel>
        <WidgetElement cityName={cityName} />
      </FullPanel>
      <SidePanel
        widgets={enabledWidgets}
        selectedWidgetId={current.id}
        showWeather={current.showWeather}
        totalTime={current.durationSeconds * 1000}
        isPaused={isPaused}
        cityName={cityName}
      />
    </Wrapper>
  );
};

WidgetDisplay.propTypes = {
  keyToWidgetAction: PropTypes.func.isRequired,
  clickToWidgetAction: PropTypes.func.isRequired,
  isPaused: PropTypes.bool.isRequired,
  cityName: PropTypes.string.isRequired,
  widgets: PropTypes.shape({
    enabled: PropTypes.array.isRequired,
    byIdOrFirst: PropTypes.shape({
      durationSeconds: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      showWeather: PropTypes.bool.isRequired,
      sidebarText: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export const LoadingDisplay = ({ cityName }) => (
  <Wrapper>
    <FullPanel>
      <LoadingMessage />
    </FullPanel>
    <SidePanel
      widgets={[]}
      selectedWidgetId={0}
      showWeather={false}
      totalTime={0}
      isPaused={false}
      cityName={cityName}
    />
  </Wrapper>
);

LoadingDisplay.propTypes = {
  cityName: PropTypes.string.isRequired,
};

export const DisconnectedDisplay = ({ cityName }) => (
  <Wrapper>
    <FullPanel>
      <DisconnectedMessage />
    </FullPanel>
    <SidePanel
      widgets={[]}
      selectedWidgetId={0}
      showWeather={false}
      totalTime={0}
      isPaused={false}
      cityName={cityName}
    />
  </Wrapper>
);

DisconnectedDisplay.propTypes = {
  cityName: PropTypes.string.isRequired,
};

export default WidgetDisplay;
