import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Time from '@components/time';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import withFragment from './hocs/with-fragment';

export const getTimeZone = gql`
  fragment TimeHero on Location {
    timezone
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
  location: PropTypes.shape({
    timezone: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

TimeHero.defaultProps = {
  loading: true,
  error: false,
};

export default withFragment(TimeHero, { location: getTimeZone });
