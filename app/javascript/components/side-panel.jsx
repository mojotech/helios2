import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacing, sidePanelWidth } from '@lib/theme';
import FixedContent from '@components/fixed-content';
import widgetShape from '@lib/widget-shape';
import TopCorner from '@components/top-corner-controller';

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

export const SidePanel = ({
  widgets,
  selectedWidget,
  totalTime,
  tabDown,
  isPaused,
}) => (
  <Wrapper>
    <TopCorner showWeather={widgets[selectedWidget].showWeather} />
    <FixedContent
      widgets={widgets}
      selectedWidget={selectedWidget}
      totalTime={totalTime}
      tabDown={tabDown}
      isPaused={isPaused}
    />
  </Wrapper>
);

SidePanel.propTypes = {
  ...widgetShape,
  isPaused: PropTypes.bool.isRequired,
};

export default SidePanel;
