import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
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

const progressBarAnimation = (props) => css`
  animation: ${progressBarFrames} ${props.time}s linear 0s;
  animation-fill-mode: forwards;
  animation-play-state: ${props.isPaused ? `paused` : `playing`};
`;

const ProgressBar = styled.div`
  background-color: ${colors.white};
  height: ${height}px;
  width: ${width}px;
  ${progressBarAnimation};
`;

const SolidBar = styled.div`
  background-color: ${colors.white};
  height: 1px;
  width: ${width}px;
`;

export function CurrentTabBar({ isPaused, time }) {
  return (
    <>
      <ProgressBar time={time / 1000} isPaused={isPaused} />
      <SolidBar />
    </>
  );
}

export function OtherTabBar() {
  return (
    <svg width={width} height={height}>
      <rect width={width} height="1" fill={colors.white} opacity="0.2" />
    </svg>
  );
}

CurrentTabBar.propTypes = {
  time: PropTypes.number.isRequired,
  isPaused: PropTypes.bool.isRequired,
};
