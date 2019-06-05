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

const CurrentSubText = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.tiny};
  margin-top: ${spacing.s};
`;

const OtherWidgetText = styled.div`
  margin-top: ${spacing.l};
  font-size: ${fontSizes.small};
  color: ${colors.white};
  opacity: 0.5;
  margin-left: ${spacing.l};
  cursor: pointer;
`;

const OtherSubText = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.tiny};
  margin-top: ${spacing.s};
  opacity: 0.5;
  margin-left: ${spacing.l};
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
        <TabBar />
        <CurrentWidgetText id={`widget_${props.widgetId}`}>
          {props.text}
        </CurrentWidgetText>
        <CurrentSubText>{props.children}</CurrentSubText>
      </span>
    );
  }
  return (
    <span>
      <TabBar />
      <OtherWidgetText id={`widget_${props.widgetId}`}>
        {props.text}
      </OtherWidgetText>
      <OtherSubText>{props.children}</OtherSubText>
    </span>
  );
};

Tab.propTypes = {
  selected: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  widgetId: PropTypes.number.isRequired,
};
