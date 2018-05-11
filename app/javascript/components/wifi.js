import React from 'react';
import styled from 'styled-components';
import { spacing } from '../lib/theme';
import { WhiteTitle, GreySubText } from './typography';

const Wrapper = styled.div`
  margin-right: ${spacing.xxxl};
`;

export const Wifi = () => (
  <Wrapper>
    <WhiteTitle>Wifi</WhiteTitle>
    <GreySubText>mojotech-guest</GreySubText>
    <GreySubText>Password: p@ssword</GreySubText>
  </Wrapper>
);

export default Wifi;
