import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { colors, weights, fonts, fontSizes } from '@lib/theme';
import { GreySubText } from '@components/typography';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';

const getTrafficCams = gql`
  {
    primaryLocation {
      trafficCams {
        title
        url
      }
    }
  }
`;

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
  <Query query={getTrafficCams}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <DisconnectedMessage />;
      }

      const { trafficCams } = data.primaryLocation;
      if (!trafficCams) {
        return null;
      }

      const CameraList = (beginning, end) => {
        return trafficCams.map((cam, index) => {
          if (index >= beginning && index < end) {
            return (
              <div key={cam}>
                <Title>{cam.title}</Title>
                <TrafficCam src={cam.url} />
              </div>
            );
          }
          return <div key={cam} />;
        });
      };

      return (
        <>
          <Row>
            <Column>{CameraList(0, 3)}</Column>
            <Column>{CameraList(3, 6)}</Column>
          </Row>
          <Notice>Images from http://www.dot.ri.gov</Notice>
        </>
      );
    }}
  </Query>
);

export default Traffic;