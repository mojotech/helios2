import React from 'react';
import styled from 'styled-components';
import Logo from '@components/logo';
import { SpacedRow, Row } from '@components/row';
import Date from '@components/date';
import TimeHero from '@components/time-hero';
import Wifi from '@components/wifi';
import Bathroom from '@components/bathroom';
import { spacing, colors } from '@lib/theme';
import Widgets from '@components/widgets';
import widgetShape from '@lib/widget-shape';

const DateLogoRow = styled(SpacedRow)`
  align-items: center;
  margin-bottom: ${spacing.xxl};
  margin-top: 13px;
`;

const CarouselContainer = styled.div`
  margin-top: ${spacing.xxl};
  font-size: 13px;
  color: ${colors.white};
`;

export const FixedContent = ({
  widgets,
  selectedWidget,
  totalTime,
  tabDown,
}) => (
  <div>
    <DateLogoRow>
      <Date />
      <Logo />
    </DateLogoRow>
    <TimeHero />
    <Row>
      <Wifi />
      <Bathroom />
    </Row>
    <CarouselContainer>
      <Widgets
        widgets={widgets}
        selectedWidget={selectedWidget}
        totalTime={totalTime}
        tabDown={tabDown}
      />
    </CarouselContainer>
  </div>
);
FixedContent.propTypes = widgetShape;

export default FixedContent;
