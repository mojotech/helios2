import React from 'react';
import styled from 'styled-components';
import Logo from './logo';
import { SpacedRow, Row } from './row';
import Date from './date';
import Times from './times';
import Wifi from './wifi';
import Bathroom from './bathroom';
import { spacing, colors } from '../lib/theme';
import Carousel from './carousel';

const DateLogoRow = styled(SpacedRow)`
  align-items: center;
  margin-bottom: ${spacing.xxl};
`;

const CarouselContainer = styled.div`
  margin-top: ${spacing.xxl};
  font-size: 13px;
  color: ${colors.white};
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
    <CarouselContainer>
      <Carousel currentWidget="weather" />
    </CarouselContainer>
  </div>
);

export default FixedContent;
