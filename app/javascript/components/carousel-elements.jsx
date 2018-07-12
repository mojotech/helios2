import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { colors, spacing, fontSizes } from '../lib/theme';

const CurrentWidgetText = styled.div`
  margin-top: ${spacing.l};
  font-size: ${fontSizes.small};
  color: ${colors.white};
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
`;

const OtherSubText = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.tiny};
  margin-top: ${spacing.s};
  opacity: 0.5;
  margin-left: ${spacing.l};
`;

export const CurrentWidgetBar = () => (
  <svg width="568" height="4">
    <rect width="568" height="1" fill={colors.white} />
    <rect width="258" height="4" fill={colors.white} />
  </svg>
);

export const OtherWidgetBar = () => (
  <svg width="568" height="4">
    <rect width="568" height="1" fill={colors.white} opacity="0.2" />
  </svg>
);

export const Widget = props => {
  if (props.selected) {
    return (
      <span>
        <CurrentWidgetBar />
        <CurrentWidgetText>{props.text}</CurrentWidgetText>
        <CurrentSubText>{props.children}</CurrentSubText>
      </span>
    );
  }
  return (
    <span>
      <OtherWidgetBar />
      <OtherWidgetText>{props.text}</OtherWidgetText>
      <OtherSubText>{props.children}</OtherSubText>
    </span>
  );
};

Widget.propTypes = {
  selected: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};
