import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Time from '@components/time';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import withFragment from './hocs/with-fragment';

export const getTimeHero = gql`
  fragment TimeHero on Location {
    timeZone
  }
`;

export const TimeHero = ({ loading, error, location }) => {
  if (loading) {
    return <LoadingMessage />;
  }
  if (error) {
    return <ErrorMessage />;
  }

  return <Time location={location} />;
};

TimeHero.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  location: PropTypes.shape({}).isRequired,
};

TimeHero.defaultProps = {
  loading: true,
  error: false,
};

export default withFragment(TimeHero, { location: getTimeHero });
