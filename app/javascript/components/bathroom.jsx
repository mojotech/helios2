import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { WhiteSubTitle, WhiteTitleLarge } from '@components/typography';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import withFragment from './hocs/with-fragment';

export const getBathroomCode = gql`
  fragment Bathroom on Location {
    bathroomCode
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
`;

export function Bathroom({ loading, error, location }) {
  if (loading) {
    return <LoadingMessage />;
  }
  if (error) {
    // eslint-disable-next-line
    console.error(error);
    return <ErrorMessage />;
  }

  const { bathroomCode } = location;
  if (!bathroomCode) {
    return null;
  }
  return (
    <Column>
      <WhiteSubTitle>BATHROOM CODE</WhiteSubTitle>
      <WhiteTitleLarge>{bathroomCode}</WhiteTitleLarge>
    </Column>
  );
}

Bathroom.propTypes = {
  location: PropTypes.shape({
    bathroomCode: PropTypes.string,
  }),
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

Bathroom.defaultProps = {
  location: {},
  loading: true,
  error: false,
};

export default withFragment(Bathroom, { location: getBathroomCode });
