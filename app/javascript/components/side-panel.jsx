import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacing, colors, sidePanelWidth } from '@lib/theme';
import Wifi, { getWifi } from '@components/wifi';
import Bathroom, { getBathroomCode } from '@components/bathroom';
import CityName from '@components/city-name';
import { Row } from '@components/row';
import TopCorner, { getTopCorner } from '@components/top-corner-controller';
import Widgets from '@components/widgets';
import gql from 'graphql-tag';
import withFragment from './hocs/with-fragment';

const Wrapper = styled.div`
  bottom: 0;
  position: absolute;
  right: 0;
  padding: ${spacing.xxxl};
  top: 0;
  width: ${sidePanelWidth}px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.7);
`;

const FixedContent = styled.div`
  margin-top: ${spacing.xxl};
  font-size: 13px;
  color: ${colors.white};
`;

export const getSidePanel = gql`
  fragment SidePanel on Location {
    ...Wifi
    ...Bathroom
    ...TopCorner
  }
  ${getWifi}
  ${getBathroomCode}
  ${getTopCorner}
`;

export const SidePanel = ({
  widgets,
  selectedWidgetId,
  showWeather,
  totalTime,
  isPaused,
  cityName,
  location,
  loading,
  error,
}) => (
  <Wrapper>
    <TopCorner
      showWeather={showWeather}
      cityName={cityName}
      loading={loading}
      error={error}
      location={location}
    />
    <CityName cityName={cityName} />
    <Row>
      <Wifi loading={loading} error={error} location={location} />
      <Bathroom loading={loading} error={error} location={location} />
    </Row>
    <FixedContent>
      <Widgets
        widgets={widgets}
        selectedWidgetId={selectedWidgetId}
        totalTime={totalTime}
        isPaused={isPaused}
      />
    </FixedContent>
  </Wrapper>
);

SidePanel.propTypes = {
  ...Widgets.propTypes,
  showWeather: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

SidePanel.defaultProps = {
  loading: true,
  error: false,
};

export default withFragment({ location: getSidePanel })(SidePanel);
