import React from 'react';
import styled from 'styled-components';
import Logo from './logo';
import { SpacedRow, Row } from './row';
import Date from './date';
import Times from './times';
import Wifi from './wifi';
import Bathroom from './bathroom';
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
    <Row>
      <Wifi />
      <Bathroom />
    </Row>
  </div>
);

export default FixedContent;
