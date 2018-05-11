import React from 'react';
import PropTypes from 'prop-types';
import { GreySubText } from './typography';
import { colors, fontSizes, spacing, weights } from '../lib/theme';
import styled from 'styled-components';
import { Row } from './row';

const Wrapper = styled.div`
  font-size: ${fontSizes.medium};
  font-weight: ${weights.light};
`;

const HourMin = styled.div``;

const AMPM = styled.div``;

const TimeValue = styled(Row)`
  align-items: flex-end;
  color: ${({ isPrimary }) => (isPrimary ? colors.white : colors.grey)};

  ${/* sc-sel */ HourMin} {
    ${({ isPrimary }) => isPrimary && `font-size: ${fontSizes.huge}`};
  }

  ${/* sc-sel */ AMPM} {
    ${({ isPrimary }) => isPrimary && `font-size: ${fontSizes.large}`};
  }
`;

const City = styled(GreySubText)`
  margin-bottom: ${spacing.xs};
`;

export const Time = ({ isPrimary, cityName }) => (
  <Wrapper>
    <City>{cityName}</City>
    <TimeValue {...{ isPrimary }}>
      <HourMin>6:40</HourMin>
      <AMPM>PM</AMPM>
    </TimeValue>
  </Wrapper>
);

Time.propTypes = {
  isPrimary: PropTypes.bool.isRequired,
  cityName: PropTypes.string.isRequired,
};

export default Time;
