import React from 'react';
import PropTypes from 'prop-types';
import { splitAt, take } from 'ramda';
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

const TrafficCamImage = styled.img`
  width: 376px;
  height: 240px;
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

const TrafficCam = ({ title, url }) => (
  <div>
    <Title>{title}</Title>
    <TrafficCamImage src={url} />
  </div>
);

TrafficCam.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

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

      const [firstColumn, secondColumn] = splitAt(3, trafficCams);

      return (
        <>
          <Row>
            <Column>
              {take(3, firstColumn).map(cam => (
                <TrafficCam key={cam} {...cam} />
              ))}
            </Column>
            <Column>
              {take(3, secondColumn).map(cam => (
                <TrafficCam key={cam} {...cam} />
              ))}
            </Column>
          </Row>
          <Notice>Images from http://www.dot.ri.gov</Notice>
        </>
      );
    }}
  </Query>
);

export default Traffic;
