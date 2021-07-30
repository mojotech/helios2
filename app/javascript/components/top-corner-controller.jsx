import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Date, { getTimeZone } from '@components/date';
import Logo from '@components/logo';
import { SpacedRow } from '@components/row';
import TimeHero, { getTimeHero } from '@components/time-hero';
import gql from 'graphql-tag';
import WeatherCorner from '@components/weather-corner';
import withFragment from '@hocs/with-fragment';

export const getTopCorner = gql`
  fragment TopCorner on Location {
    ...TimeHero
    ...Date
  }
  ${getTimeHero}
  ${getTimeZone}
`;

const DateLogoRow = styled(SpacedRow)`
  margin-top: 13px;
  align-items: left;
  justify-content: left;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 75px;
  top: 80px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 100px;
`;

export const TopCorner = ({
  showWeather,
  cityName,
  loading,
  error,
  location,
}) => {
  return (
    <div>
      <DateLogoRow>
        <Date loading={loading} error={error} location={location} />
      </DateLogoRow>
      <IconWrapper>
        <Logo />
      </IconWrapper>
      <Row>
        <TimeHero loading={loading} error={error} location={location} />
        {showWeather && <WeatherCorner cityName={cityName} />}
      </Row>
    </div>
  );
};

TopCorner.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  location: PropTypes.shape({
    timezone: PropTypes.string,
  }).isRequired,
  showWeather: PropTypes.bool.isRequired,
  cityName: PropTypes.string.isRequired,
};

TopCorner.defaultProps = {
  loading: true,
  error: false,
};

export default withFragment(TopCorner, { location: getTopCorner });
