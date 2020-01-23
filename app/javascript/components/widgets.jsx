import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacing } from '@lib/theme';
import { Tab } from '@components/tabs';
import widgetShape from '@lib/widget-shape';

const WidgetContainer = styled.div`
  margin-bottom: ${spacing.l};
`;

export const Widgets = ({
  widgets,
  selectedWidget,
  totalTime,
  tabDown,
  isPaused,
}) =>
  widgets.map((widget, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <WidgetContainer key={index}>
      <Tab
        widgetId={index}
        selected={index === selectedWidget}
        totalTime={totalTime}
        tabDown={tabDown}
        text={widget.text}
        isPaused={isPaused}
      />
    </WidgetContainer>
  ));

Widgets.propTypes = {
  ...widgetShape,
  isPaused: PropTypes.bool.isRequired,
};

export default Widgets;
