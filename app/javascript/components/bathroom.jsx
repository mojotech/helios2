import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { WhiteSubTitle, WhiteTitleLarge } from '@components/typography';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';

const getBathroomCode = gql`
  query getBathroomCode($cityName: String!) {
    location(cityName: $cityName) {
      bathroomCode
    }
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
`;

export const Bathroom = ({ cityName }) => (
  <Query query={getBathroomCode} variables={{ cityName }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage />;
      }

      const { bathroomCode } = data.location;
      if (!bathroomCode) {
        return null;
      }

      return (
        <Column>
          <WhiteSubTitle>BATHROOM CODE</WhiteSubTitle>
          <WhiteTitleLarge>{bathroomCode}</WhiteTitleLarge>
        </Column>
      );
    }}
  </Query>
);

Bathroom.propTypes = {
  cityName: PropTypes.string.isRequired,
};

export default Bathroom;
