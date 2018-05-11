import React from 'react';
import styled from 'styled-components';
import { colors } from '../lib/theme';
import { WhiteText } from './typography';

const Wrapper = styled.div`
  background: ${colors.black};
  height: 100vh;
  padding: 100px 200px;
  width: 100vw;
`;

export const FullPanel = () => (
  <Wrapper>
    <WhiteText>
      <h1>Helios</h1>
    </WhiteText>
  </Wrapper>
);

export default FullPanel;
