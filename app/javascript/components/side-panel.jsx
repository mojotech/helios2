import React from 'react';
import styled from 'styled-components';
import { spacing } from '@lib/theme';
import FixedContent from '@components/fixed-content';
import widgetShape from '@lib/widget-shape';

const Wrapper = styled.div`
  bottom: 0;
  position: absolute;
  right: 0;
  padding: ${spacing.xxxl};
  top: 0;
  width: 600px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const SidePanel = ({ widgets, selectedWidget }) => (
  <Wrapper>
    <FixedContent widgets={widgets} selectedWidget={selectedWidget} />
  </Wrapper>
);

SidePanel.propTypes = widgetShape;

export default SidePanel;
