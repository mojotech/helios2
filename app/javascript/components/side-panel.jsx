import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacing, colors, sidePanelWidth } from '@lib/theme';
import Wifi from '@components/wifi';
import Bathroom from '@components/bathroom';
import { Row } from '@components/row';
import TopCorner from '@components/top-corner-controller';
import Widgets from '@components/widgets';

const Wrapper = styled.div`
  bottom: 0;
  position: absolute;
  right: 0;
  padding: ${spacing.xxxl};
  top: 0;
  width: ${sidePanelWidth}px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.7);
`;

const FixedContent = styled.div`
  margin-top: ${spacing.xxl};
  font-size: 13px;
  color: ${colors.white};
`;

export const SidePanel = ({
  widgets,
  selectedWidgetId,
  totalTime,
  showWeather,
  isPaused,
  props,
}) => (
  <Wrapper>
    <TopCorner showWeather={showWeather} {...props} />
    <Row>
      <Wifi />
      <Bathroom />
    </Row>
    <FixedContent>
      <Widgets
        widgets={widgets}
        selectedWidgetId={selectedWidgetId}
        totalTime={totalTime}
        isPaused={isPaused}
      />
    </FixedContent>
  </Wrapper>
);

SidePanel.propTypes = {
  ...Widgets.propTypes,
  showWeather: PropTypes.bool.isRequired,
};

export default SidePanel;
