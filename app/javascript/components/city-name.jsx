import React from 'react';
import PropTypes from 'prop-types';
import { WhiteTitleLarge } from '@components/typography';

export const City = ({ cityName }) => (
  <WhiteTitleLarge>{cityName}</WhiteTitleLarge>
);

City.propTypes = {
  cityName: PropTypes.string.isRequired,
};

export default City;
