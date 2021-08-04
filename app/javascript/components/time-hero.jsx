import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Time from '@components/time';
import { compose } from 'react-recompose';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import renderWhileLoading from '@hocs/render-while-loading';
import withFragment from './hocs/with-fragment';

export const getTimeHero = gql`
  fragment TimeHero on Location {
    timezone
  }
`;

export const TimeHero = ({ error, location }) => {
  if (error) {
    return <ErrorMessage />;
  }

  return <Time location={location} />;
};

TimeHero.propTypes = {
  error: PropTypes.bool,
  location: PropTypes.shape({}).isRequired,
};

TimeHero.defaultProps = {
  error: false,
};

export default compose(
  renderWhileLoading(LoadingMessage),
  withFragment({ location: getTimeHero }),
)(TimeHero);
