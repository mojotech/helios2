import React from 'react';
import styled from 'styled-components';
import { colors, weights, fonts, fontSizes } from '@lib/theme';
import { GreySubText } from '@components/typography';

const Title = styled.div`
  margin-top: 16px;
  margin-bottom: 8px;
  color: ${colors.white};
  weight: ${weights.regular};
  font-size: 24px;
  font-family: ${fonts.extended};
`;

const TrafficCam = styled.img`
  width: 400px;
  height: 250px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  margin-right: 50px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 700px;
`;

const Notice = styled(GreySubText)`
  margin-top: 16px;
  font-size: ${fontSizes.tiny};
  text-align: center;
  margin-right: 750px;
`;

const Traffic = () => (
  <>
    <Row>
      <Column>
        <Title>I-95 at Broad St</Title>
        <TrafficCam src="http://www.dot.ri.gov/img/travel/camimages/95-21%20I-95%20S%20@%20Broad%20St%20.jpg" />
        <Title>I-95 at Lonsdale</Title>
        <TrafficCam src="http://www.dot.ri.gov/img/travel/camimages/95-26%20I-95%20N%20@%20Lonsdale%20Ave.jpg" />
        <Title>I-95 at Kinsley</Title>
        <TrafficCam src="http://www.dot.ri.gov/img/travel/camimages/95-22b%20I-95%20N%20@%20Kinsley%20Ave.jpg" />
      </Column>
      <Column>
        <Title>Exit 10 (near I-295)</Title>
        <TrafficCam src="http://www.dot.ri.gov/img/travel/camimages/95-11%20I-95%20N%20@%20Toll%20Gate%20Rd.jpg" />
        <Title>I-95 I-195 Split</Title>
        <TrafficCam src="http://www.dot.ri.gov/img/travel/camimages/195-1%20I-195%20W%20Split%20@%20I-95.jpg" />
        <Title>Tobey Street</Title>
        <TrafficCam src="http://www.dot.ri.gov/img/travel/camimages/6-2%20Rt%206%20E%20%20%2010%20N%20@%20Tobey%20St.jpg" />
      </Column>
    </Row>
    <Notice>Images from http://www.dot.ri.gov</Notice>
  </>
);

export default Traffic;
