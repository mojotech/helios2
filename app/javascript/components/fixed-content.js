import React from 'react';
import styled from 'styled-components';
import Logo from './logo';
import { SpacedRow } from './row';
import Date from './date';
import Times from './times';
import { spacing } from '../lib/theme';

const DateLogoRow = styled(SpacedRow)`
  align-items: center;
  margin-bottom: ${spacing.xxl};
`;

export const FixedContent = () => (
  <div>
    <DateLogoRow>
      <Date />
      <Logo />
    </DateLogoRow>
    <Times />
  </div>
);

export default FixedContent;
