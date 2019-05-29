import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { spacing } from '../lib/theme';
import { WhiteTitle, GreySubText } from './typography';
import { Row } from './row';
import {
  LoadingMessage,
  ErrorMessage,
} from './widgets/messages/default-messages';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${spacing.xxxl};
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
              <WhiteTitle>Wifi</WhiteTitle>
              <GreySubText>{wifiName}</GreySubText>
            </Column>
            <Column>
              <WhiteTitle>Wifi Password</WhiteTitle>
              <GreySubText>{wifiPassword}</GreySubText>
            </Column>
          </Row>
        );
      }}
    </Query>
  </div>
);

export default Wifi;
