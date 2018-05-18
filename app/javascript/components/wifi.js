import React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { spacing } from '../lib/theme';
import { WhiteTitle, GreySubText } from './typography';

const Wrapper = styled.div`
  margin-right: ${spacing.xxxl};
`;

const LoadingMessage = () => <p>Loading...</p>;

const ErrorMessage = ({ message }) => <p>Error: {message}</p>;

const getWifiInfo = gql`
  {
    primaryLocation {
      wifiName
      wifiPassword
    }
  }
`;

export const Wifi = () => (
  <Wrapper>
    <Query query={getWifiInfo}>
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingMessage />;
        }

        if (error) {
          return <ErrorMessage message={error.message} />;
        }

        const { wifiName, wifiPassword } = data.primaryLocation;
        if (!wifiName) {
          return null;
        }

        return (
          <React.Fragment>
            <WhiteTitle>Wifi</WhiteTitle>
            <GreySubText>{wifiName}</GreySubText>
            <GreySubText>{wifiPassword}</GreySubText>
          </React.Fragment>
        );
      }}
    </Query>
  </Wrapper>
);

export default Wifi;
