import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Time from '@components/time';
import { compose } from 'react-recompose';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import renderWhileError from '@hocs/render-while-error';
import renderWhileLoading from '@hocs/render-while-loading';
import withFragment from './hocs/with-fragment';

export const getTimeHero = gql`
  fragment TimeHero on Location {
    timeZone
  }
`;

export const TimeHero = ({ location }) => {
  return <Time location={location} />;
};

TimeHero.propTypes = {
  location: PropTypes.shape({}).isRequired,
};

TimeHero.defaultProps = {};

export default compose(
  renderWhileError(ErrorMessage),
  renderWhileLoading(LoadingMessage),
  withFragment({ location: getTimeHero }),
)(TimeHero);
