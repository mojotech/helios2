import React from 'react';
import styled from 'styled-components';
import { colors } from '../lib/theme';
import CurrentWeather from './current-weather';

const Wrapper = styled.div`
  background: ${colors.black};
  height: 100vh;
  padding: 100px;
  width: 100vw;
`;

export const FullPanel = () => (
  <Wrapper>
    <CurrentWeather />
  </Wrapper>
);

export default FullPanel;
