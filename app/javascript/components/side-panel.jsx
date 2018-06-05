import React from 'react';
import styled from 'styled-components';
import { spacing } from '../lib/theme';
import FixedContent from './fixed-content';

const Wrapper = styled.div`
  bottom: 0;
  position: absolute;
  right: 0;
  padding: ${spacing.xxxl};
  top: 0;
  width: 400px;
`;

export const SidePanel = () => (
  <Wrapper>
    <FixedContent />
  </Wrapper>
);

export default SidePanel;
