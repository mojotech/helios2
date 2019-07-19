import React from 'react';
import styled from 'styled-components';
import { Row } from '@components/row';
import Wifi from '@components/wifi';
import Bathroom from '@components/bathroom';
import { spacing, colors } from '@lib/theme';
import Widgets from '@components/widgets';
import widgetShape from '@lib/widget-shape';

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
