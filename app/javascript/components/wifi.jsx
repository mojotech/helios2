import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { WhiteSubTitle, WhiteTitleLarge } from '@components/typography';
import { Row } from '@components/row';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import LockIcon from '@assets/images/lock.png';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 119px;
  margin-bottom: 50px;
  margin-top: 100px;
`;

const getWifiInfo = gql`
  {
    primaryLocation {
      wifiName
      wifiPassword
    }
  }
`;

export const Wifi = () => (
  <div>
    <Query query={getWifiInfo}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }

        if (error) {
          return <ErrorMessage />;
        }

        const { wifiName, wifiPassword } = data.primaryLocation;
        if (!wifiName) {
          return null;
        }

        return (
          <Row>
            <Column>
              <WhiteSubTitle>WIFI</WhiteSubTitle>
              <Row>
                <img src={LockIcon} alt="lock" width={50} height={50} />
                <WhiteTitleLarge>{wifiName}</WhiteTitleLarge>
              </Row>
              <WhiteTitleLarge>{wifiPassword}</WhiteTitleLarge>
            </Column>
          </Row>
        );
      }}
    </Query>
  </div>
);

export default Wifi;
