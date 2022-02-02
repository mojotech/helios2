import React from 'react';
import PropTypes from 'prop-types';
import { splitAt, take, uniq, map, compose } from 'ramda';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import ReactHlsPlayer from 'react-hls-player';
import { colors, weights, fonts, fontSizes } from '@lib/theme';
import { GreySubText } from '@components/typography';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';

const getTrafficCams = gql`
  query getTrafficCams($cityName: String!) {
    location(cityName: $cityName) {
      trafficCams {
        id
        title
        url
        feedFormat
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

const TrafficCam = ({ title, url, feedFormat }) => (
  <div>
    <Title>{title}</Title>
    {feedFormat === 'video' ? (
      <ReactHlsPlayer src={url} autoPlay controls width="450px" height="auto" />
    ) : (
      <TrafficCamImage src={url} />
    )}
  </div>
);

TrafficCam.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  feedFormat: PropTypes.string.isRequired,
};

const Traffic = ({ cityName, startTimer }) => (
  <Query
    query={getTrafficCams}
    variables={{ cityName }}
    onCompleted={startTimer}
    onError={startTimer}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <DisconnectedMessage />;
      }

      const { trafficCams } = data.location;
      if (!trafficCams) {
        return null;
      }
      const columnSize = Math.floor(trafficCams.length / 2);
      const [firstColumn, secondColumn] = splitAt(columnSize, trafficCams);
      const getUniqUrls = compose(
        uniq,
        map(cam => new URL(cam.url).hostname),
      );

      return (
        <>
          <Row>
            <Column>
              {take(columnSize, firstColumn).map(({ id, ...cam }) => (
                <TrafficCam key={id} {...cam} />
              ))}
            </Column>
            <Column>
              {take(columnSize, secondColumn).map(({ id, ...cam }) => (
                <TrafficCam key={id} {...cam} />
              ))}
            </Column>
          </Row>
          <Notice>Images from:</Notice>
          {getUniqUrls(trafficCams).map(url => (
            <Notice key={url}>{url}</Notice>
          ))}
        </>
      );
    }}
  </Query>
);

Traffic.propTypes = {
  cityName: PropTypes.string.isRequired,
  startTimer: PropTypes.func.isRequired,
};

export default Traffic;
