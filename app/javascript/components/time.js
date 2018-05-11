import React from 'react';
import { GreySubText } from './typography';
import { colors, fontSizes, spacing, weights } from '../lib/theme';
import styled from 'styled-components';
import { Row } from './row';

const Wrapper = styled.div`
  font-size: ${fontSizes.medium};
  font-weight: ${weights.light};
`;

const TimeValue = styled(Row)`
  align-items: flex-end;
  color: ${({ primary }) => (primary ? colors.white : colors.grey)};
`;

const City = styled(GreySubText)`
  margin-bottom: ${spacing.xs};
`;

const HourMin = styled.div`
  ${({ primary }) => primary && `font-size: ${fontSizes.huge}`};
`;

const AMPM = styled.div`
  ${({ primary }) => primary && `font-size: ${fontSizes.large}`};
`;

export const Time = ({ primary }) => (
  <Wrapper>
    <City>Providence</City>
    <TimeValue {...{ primary }}>
      <HourMin {...{ primary }}>6:40</HourMin>
      <AMPM {...{ primary }}>PM</AMPM>
    </TimeValue>
  </Wrapper>
);

export default Time;
