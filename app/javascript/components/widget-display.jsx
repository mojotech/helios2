import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import {
  DisconnectedMessage,
  LoadingMessage,
  WidgetDisabledMessage,
} from '@messages/message';
import FullPanel from '@components/full-panel';
import SidePanel, { getSidePanel } from '@components/side-panel';
import Twitter from '@widgets/twitter';
import Numbers from '@widgets/numbers';
import Weather from '@widgets/weather';
import Traffic from '@widgets/traffic';
import Feed from '@widgets/feed';
import Events from '@widgets/events';
import withFragment from './hocs/with-fragment';

const Wrapper = styled.div`
  outline: none;
`;

export const getWidgetDisplay = gql`
  fragment WidgetDisplay on Location {
    ...SidePanel
  }
  ${getSidePanel}
`;

const widgetElements = {
  Weather,
  Twitter,
  Numbers,
  Traffic,
  Events,
  Feed,
};

export function WidgetDisplay({
  keyToWidgetAction,
  clickToWidgetAction,
  isPaused,
  cityName,
  location,
  loading,
  error,
  startTimer,
}) {
  const { byIdOrFirst: current, enabled: enabledWidgets } = location.widgets;
  const WidgetElement = widgetElements[current.name].Panel;
  return (
    <Wrapper
      onKeyDown={keyToWidgetAction}
      onClick={clickToWidgetAction}
      // eslint-disable-next-line
      tabIndex="0"
    >
      <FullPanel>
        <WidgetElement startTimer={startTimer} cityName={cityName} />
      </FullPanel>
      <SidePanel
        widgets={enabledWidgets}
        selectedWidgetId={current.id}
        showWeather={current.showWeather}
        totalTime={current.durationSeconds * 1000}
        isPaused={isPaused}
        cityName={cityName}
        location={location}
        loading={loading}
        error={error}
      />
    </Wrapper>
  );
}

WidgetDisplay.propTypes = {
  keyToWidgetAction: PropTypes.func.isRequired,
  clickToWidgetAction: PropTypes.func.isRequired,
  isPaused: PropTypes.bool.isRequired,
  cityName: PropTypes.string.isRequired,
  location: PropTypes.shape({
    widgets: PropTypes.shape({
      enabled: PropTypes.arrayOf.isRequired,
      byIdOrFirst: PropTypes.shape({
        durationSeconds: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        showWeather: PropTypes.bool.isRequired,
        sidebarText: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  startTimer: PropTypes.func.isRequired,
};

WidgetDisplay.defaultProps = {
  loading: true,
  error: false,
};

export function LoadingDisplay({ cityName, loading }) {
  return (
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
        loading={loading}
      />
    </Wrapper>
  );
}

LoadingDisplay.propTypes = {
  cityName: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

LoadingDisplay.defaultProps = {
  loading: true,
};

export function DisconnectedDisplay({ cityName, error }) {
  return (
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
        error={error}
      />
    </Wrapper>
  );
}

DisconnectedDisplay.propTypes = {
  cityName: PropTypes.string.isRequired,
  error: PropTypes.bool,
};

DisconnectedDisplay.defaultProps = {
  error: false,
};

export function WidgetDisabledDisplay() {
  return (
    <Wrapper>
      <FullPanel>
        <WidgetDisabledMessage />
      </FullPanel>
      <SidePanel
        widgets={[]}
        selectedWidgetId={0}
        showWeather={false}
        totalTime={0}
        isPaused={false}
      />
    </Wrapper>
  );
}

export default withFragment(WidgetDisplay, { location: getWidgetDisplay });
