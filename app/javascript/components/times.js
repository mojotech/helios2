import React from 'react';
import styled from 'styled-components';
import { SpacedRow } from './row';
import Time from './time';
import { spacing } from '../lib/theme';

const Wrapper = styled(SpacedRow)`
  align-items: flex-end;
  margin-bottom: ${spacing.xxl};
`;

export const Times = () => (
  <Wrapper>
    <Time primary={true} />
    <Time primary={false} />
    <Time primary={false} />
    <Time primary={false} />
  </Wrapper>
);

export default Times;
