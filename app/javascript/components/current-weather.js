import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CurrentTemp from './current-temp';
import HourlyTemps from './hourly-temps';
import { Row } from './row';

const CenteredRow = styled(Row)`
  align-items: center;
`;

export default () => (
  <CenteredRow>
    <CurrentTemp />
    <HourlyTemps />
  </CenteredRow>
);
