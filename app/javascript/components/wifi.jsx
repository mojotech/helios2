import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { spacing } from '../lib/theme';
import { WhiteTitle, GreySubText } from './typography';
import { Row } from './row';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${spacing.xxxl};
`;

const LoadingMessage = () => <p>Loading...</p>;

const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = { message: PropTypes.string.isRequired };

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
          return <ErrorMessage message={error.message} />;
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
