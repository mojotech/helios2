import React from 'react';
import styled from 'styled-components';
import Logo from './logo';
import { SpacedRow } from './row';
import Date from './date';

const DateLogoRow = styled(SpacedRow)`
  align-items: center;
`;

export const FixedContent = () => (
  <div>
    <DateLogoRow>
      <Date />
      <Logo />
    </DateLogoRow>
  </div>
);

export default FixedContent;
