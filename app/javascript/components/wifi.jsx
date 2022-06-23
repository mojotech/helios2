import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { WhiteSubTitle, WhiteTitleLarge } from '@components/typography';
import { Row } from '@components/row';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import WifiIcon from '@assets/images/icons/icon-wifi.svg';
import LockIcon from '@assets/images/icons/icon-key.svg';
import withFragment from './hocs/with-fragment';

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

export const getWifi = gql`
  fragment Wifi on Location {
    wifiName
    wifiPassword
  }
`;

export function Wifi({ loading, error, location }) {
  if (loading) {
    return <LoadingMessage />;
  }
  if (error) {
    // eslint-disable-next-line
    console.error(error);
    return <ErrorMessage />;
  }

  const { wifiName, wifiPassword } = location;
  if (!wifiName || !wifiPassword) {
    return null;
  }
  return (
    <div>
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
    </div>
  );
}

Wifi.propTypes = {
  location: PropTypes.shape({
    wifiName: PropTypes.string,
    wifiPassword: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

Wifi.defaultProps = {
  loading: true,
  error: false,
};

export default withFragment(Wifi, { location: getWifi });
