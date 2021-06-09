import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { SpacedRow } from '@components/row';
import Time from '@components/time';
import { spacing } from '@lib/theme';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';

const Wrapper = styled(SpacedRow)`
  margin-top: ${spacing.m};
  align-items: flex-end;
  margin-bottom: 44px;
`;

const getLocation = gql`
  query getLocation($loc: String!) {
    location(cityName: $loc) {
      timezone
    }
  }
`;

export const TimeHero = props => {
  return (
    <Wrapper>
      <Query
        query={getLocation}
        variables={{ loc: props.location.pathname.substring(1) }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <LoadingMessage />;
          }

          if (error) {
            return <ErrorMessage />;
          }
          return <Time timezone={data.location[0].timezone} />;
        }}
      </Query>
    </Wrapper>
  );
};

TimeHero.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default TimeHero;
