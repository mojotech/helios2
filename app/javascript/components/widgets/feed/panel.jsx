import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WhiteSubTitle, WhiteTitleLarge } from '@components/typography';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.css';

const Title = styled.div`
  margin-bottom: 50px;
  margin-left: 50px;
  width: 45vw;
`;

const getMojoDoggos = gql`
  query getDoggos {
    feeds {
      uuid
    }
  }
`;

const PanelWrapper = styled.div`
  overflow: hidden;
  height: 90%;
`;

function Feed({ feeds }) {
  return (
    <PanelWrapper>
      <Title>
        <WhiteTitleLarge>Images at MojoTech</WhiteTitleLarge>
        <WhiteSubTitle>#mojodoggos</WhiteSubTitle>
      </Title>
      <Carousel
        width="60%"
        autoPlay
        showThumbs={false}
        interval={3000}
        showStatus={false}
      >
        {feeds.map(({ uuid }) => (
          <img alt="dog" src={`/images/${uuid}`} />
        ))}
      </Carousel>
    </PanelWrapper>
  );
}

Feed.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

function Feeder({ startTimer }) {
  useEffect(() => {
    startTimer();
  }, []);

  return (
    <Query query={getMojoDoggos} onCompleted={startTimer} onError={startTimer}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }

        if (error) {
          // eslint-disable-next-line
          console.error('error');
          return <DisconnectedMessage />;
        }

        return <Feed feeds={data.feeds} />;
      }}
    </Query>
  );
}
Feeder.propTypes = {
  startTimer: PropTypes.func.isRequired,
};
export default Feeder;
