import React from 'react';
import styled from 'styled-components';
import { colors } from '../lib/theme';
import { WhiteText } from './typography';
import SampleWeather from './sample-weather';

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
      <p>... and now for something completely different</p>
      <SampleWeather latitude={40.712} longitude={-74.0059} />
    </WhiteText>
  </Wrapper>
);

export default FullPanel;
