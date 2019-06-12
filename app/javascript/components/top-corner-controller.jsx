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

const TopCorner = ({ showTime }) => {
  if (showTime) {
    return <TimeTopCorner />;
  }
  return <WeatherTopCorner />;
};

const TimeTopCorner = () => {
  return (
    <div>
      <DateLogoRow>
        <Date />
      </DateLogoRow>
      <IconWrapper>
        <Logo />
      </IconWrapper>
      <TimeHero />
    </div>
  );
};

const WeatherTopCorner = () => {
  return (
    <div>
      <DateLogoRow>
        <Date />
      </DateLogoRow>
      <IconWrapper>
        <Logo />
      </IconWrapper>
      <WeatherCorner />
    </div>
  );
};

TopCorner.propTypes = {
  showTime: PropTypes.bool.isRequired,
};
export default TopCorner;
