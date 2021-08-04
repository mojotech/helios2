import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { compose } from 'react-recompose';
import { WhiteSubTitle, WhiteTitleLarge } from '@components/typography';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import renderWhileError from '@hocs/render-while-error';
import renderWhileLoading from '@hocs/render-while-loading';
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

export const Bathroom = ({ location }) => {
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
};

Bathroom.propTypes = {
  location: PropTypes.shape({
    bathroomCode: PropTypes.string,
  }),
};

Bathroom.defaultProps = {
  location: {},
};

export default compose(
  renderWhileError(ErrorMessage),
  renderWhileLoading(LoadingMessage),
  withFragment({ location: getBathroomCode }),
)(Bathroom);
