import React from 'react';
import styled from 'styled-components';
import FixedContent from './fixed-content';
import widgetShape from '../lib/widget-shape';

const SidePanelWrapper = styled.div`
  flex: 2;
`;

export const SidePanel = ({ widgets, selectedWidget }) => (
  <SidePanelWrapper>
    <FixedContent widgets={widgets} selectedWidget={selectedWidget} />
  </SidePanelWrapper>
);

SidePanel.propTypes = widgetShape;

export default SidePanel;
