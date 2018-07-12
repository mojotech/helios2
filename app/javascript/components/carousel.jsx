import React from 'react';
import styled from 'styled-components';
import { take } from 'ramda';
import { spacing } from '../lib/theme';
import { Widget } from './carousel-elements';
import widgetShape from '../lib/widget-shape';

const WidgetContainer = styled.div`
  margin-bottom: ${spacing.l};
`;

export const Carousel = ({ widgets, selectedWidget }) =>
  take(widgets.length - 1, widgets).map((widget, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <WidgetContainer key={index}>
      <Widget
        widgetId={index}
        selected={index === selectedWidget}
        text={widget.text}
      >
        {widget.children}
      </Widget>
    </WidgetContainer>
  ));

Carousel.propTypes = widgetShape;

export default Carousel;
