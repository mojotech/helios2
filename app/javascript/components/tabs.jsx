import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { colors, spacing, fontSizes } from '../lib/theme';

const CurrentWidgetText = styled.div`
  margin-top: ${spacing.l};
  font-size: ${fontSizes.small};
  color: ${colors.white};
  cursor: pointer;
`;

const OtherWidgetText = styled.div`
  margin-top: ${spacing.l};
  font-size: ${fontSizes.small};
  color: ${colors.white};
  opacity: 0.5;
  cursor: pointer;
`;

export const TabBar = () => (
  <svg width="568" height="4">
    <rect width="568" height="1" fill={colors.white} opacity="0.2" />
  </svg>
);

export const Tab = props => {
  if (props.selected) {
    return (
      <span>
        <CurrentWidgetText id={`widget_${props.widgetId}`}>
          {props.text}
        </CurrentWidgetText>
        <TabBar />
      </span>
    );
  }
  return (
    <span>
      <OtherWidgetText id={`widget_${props.widgetId}`}>
        {props.text}
      </OtherWidgetText>
      <TabBar />
    </span>
  );
};

Tab.propTypes = {
  selected: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  widgetId: PropTypes.number.isRequired,
};
