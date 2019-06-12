import React from 'react';
import styled from 'styled-components';
import { spacing } from '@lib/theme';
import FixedContent from '@components/fixed-content';
import widgetShape from '@lib/widget-shape';
import TopCorner from '@components/top-corner-controller';

export const width = 600;

const Wrapper = styled.div`
  bottom: 0;
  position: absolute;
  right: 0;
  padding: ${spacing.xxxl};
  top: 0;
  width: ${width}px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const SidePanel = ({ widgets, selectedWidget, totalTime, tabDown }) => (
  <Wrapper>
    <TopCorner showTime={widgets[selectedWidget].showTime} />
    <FixedContent
      widgets={widgets}
      selectedWidget={selectedWidget}
      totalTime={totalTime}
      tabDown={tabDown}
    />
  </Wrapper>
);

SidePanel.propTypes = widgetShape;

export default SidePanel;
