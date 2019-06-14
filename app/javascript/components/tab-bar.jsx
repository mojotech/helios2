import React from 'react';
import { colors } from '../lib/theme';

const width = 568;
const height = 4;

export const CurrentTabBar = () => (
  <svg width={width} height={height}>
    <rect width={width} height={height} fill={colors.white} />
    <rect width={width} height="1" fill={colors.white} />
  </svg>
);

export const OtherTabBar = () => (
  <svg width={width} height={height}>
    <rect width={width} height="1" fill={colors.white} opacity="0.2" />
  </svg>
);
