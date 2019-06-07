import React from 'react';
import styled from 'styled-components';
import { spacing } from '../lib/theme';
import { Tab } from './tabs';
import widgetShape from '../lib/widget-shape';

const WidgetContainer = styled.div`
  margin-bottom: ${spacing.l};
`;

export const Widgets = ({ widgets, selectedWidget }) =>
  widgets.map((widget, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <WidgetContainer key={index}>
      <Tab
        widgetId={index}
        selected={index === selectedWidget}
        text={widget.text}
      >
        {widget.children}
      </Tab>
    </WidgetContainer>
  ));

Widgets.propTypes = widgetShape;

export default Widgets;