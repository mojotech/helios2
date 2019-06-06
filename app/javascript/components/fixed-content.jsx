import React from 'react';
import styled from 'styled-components';
import Logo from './logo';
import { SpacedRow, Row } from './row';
import Date from './date';
import Times from './times';
import Wifi from './wifi';
import Bathroom from './bathroom';
import { spacing, colors } from '../lib/theme';
import Widgets from './widgets';
import widgetShape from '../lib/widget-shape';

const DateLogoRow = styled(SpacedRow)`
  align-items: center;
  margin-bottom: ${spacing.xxl};
`;

const CarouselContainer = styled.div`
  margin-top: ${spacing.xxl};
  font-size: 13px;
  color: ${colors.white};
`;

export const FixedContent = ({ widgets, selectedWidget }) => (
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
      <Widgets widgets={widgets} selectedWidget={selectedWidget} />
    </CarouselContainer>
  </div>
);
FixedContent.propTypes = widgetShape;

export default FixedContent;
