import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { WhiteSubTitle, WhiteTitleLarge } from '@components/typography';
import { Row } from '@components/row';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import WifiIcon from '@assets/images/icons/icon-wifi.svg';
import LockIcon from '@assets/images/icons/icon-key.svg';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 100px;
  margin-bottom: 50px;
  margin-top: 100px;
`;

const Icon = styled.div`
  margin-right: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
`;

const getWifiInfo = gql`
  query getWifiInfo($cityName: String!) {
    location(cityName: $cityName) {
      wifiName
      wifiPassword
    }
  }
`;

export const Wifi = ({ cityName }) => (
  <div>
    <Query query={getWifiInfo} variables={{ cityName }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }

        if (error) {
          return <ErrorMessage />;
        }

        const { wifiName, wifiPassword } = data.location;
        if (!wifiName || !wifiPassword) {
          return null;
        }

        return (
          <Row>
            <Column>
              <WhiteSubTitle>WIFI</WhiteSubTitle>
              <Row>
                <Icon>
                  <img src={WifiIcon} alt="wifi" width={24} height={32} />
                </Icon>
                <WhiteTitleLarge>{wifiName}</WhiteTitleLarge>
              </Row>
              <Row>
                <Icon>
                  <img src={LockIcon} alt="lock" width={24} height={32} />
                </Icon>
                <WhiteTitleLarge>{wifiPassword}</WhiteTitleLarge>
              </Row>
            </Column>
          </Row>
        );
      }}
    </Query>
  </div>
);

Wifi.propTypes = {
  cityName: PropTypes.string.isRequired,
};
export default Wifi;
