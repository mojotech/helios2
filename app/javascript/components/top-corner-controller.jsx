import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Date from '@components/date';
import Logo from '@components/logo';
import { SpacedRow } from '@components/row';
import TimeHero from '@components/time-hero';
import WeatherCorner from '@components/weather-corner';

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

const TopCorner = ({ showWeather, cityName }) => {
  return (
    <div>
      <DateLogoRow>
        <Date cityName={cityName} />
      </DateLogoRow>
      <IconWrapper>
        <Logo />
      </IconWrapper>
      <Row>
        <TimeHero cityName={cityName} />
        {showWeather && <WeatherCorner cityName={cityName} />}
      </Row>
    </div>
  );
};

TopCorner.propTypes = {
  showWeather: PropTypes.bool.isRequired,
  cityName: PropTypes.string.isRequired,
};
export default TopCorner;
