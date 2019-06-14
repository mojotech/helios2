import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '../lib/theme';

const width = 568;
const height = 4;

export const CurrentTabBar = ({ time, max }) => (
  <svg width={width} height={height}>
    <rect width={width * (time / max)} height={height} fill={colors.white} />
    <rect width={width} height="1" fill={colors.white} />
  </svg>
);

export const OtherTabBar = () => (
  <svg width={width} height={height}>
    <rect width={width} height="1" fill={colors.white} opacity="0.2" />
  </svg>
);

CurrentTabBar.propTypes = {
  time: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};
