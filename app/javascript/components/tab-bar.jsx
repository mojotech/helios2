import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { colors } from '../lib/theme';

const width = 568;
const height = 4;

const progressBarFrames = keyframes`
  0% {
    width: ${width}px;
  }
  100% {
    width: 0;
  }
`;

const ProgressBar = styled.div`
  background-color: ${colors.white};
  height: ${height}px;
  width: ${width}px;
  ${props => `animation: ${progressBarFrames} ${props.time}s linear 0s;`}
  animation-fill-mode: forwards;
  animation-play-state: ${props => (props.isPaused ? `paused` : `playing`)};
`;

const SolidBar = styled.div`
  background-color: ${colors.white};
  height: 1px;
  width: ${width}px;
`;

export const CurrentTabBar = ({ isPaused, time }) => (
  <>
    <ProgressBar time={time / 1000} isPaused={isPaused} />
    <SolidBar />
  </>
);

export const OtherTabBar = () => (
  <svg width={width} height={height}>
    <rect width={width} height="1" fill={colors.white} opacity="0.2" />
  </svg>
);

CurrentTabBar.propTypes = {
  time: PropTypes.number.isRequired,
  isPaused: PropTypes.bool.isRequired,
};
