import React from 'react';
import PropTypes from 'prop-types';
import ClearDayIcon from '@icons/icon-29-sun.svg';
import ClearNightIcon from '@icons/icon-28-moon.svg';
import RainIcon from '@icons/icon-4-cloud-rain.svg';
import SnowIcon from '@icons/icon-17-cloud-snowflakes.svg';
import SleetIcon from '@icons/icon-7-cloud-snow.svg';
import WindIcon from '@icons/icon-43-wind.svg';
import FogIcon from '@icons/icon-24-cloud-fog.svg';
import CloudyIcon from '@icons/icon-1-cloud.svg';
import PartlyCloudyDayIcon from '@icons/icon-2-cloud-sun.svg';
import PartlyCloudyNightIcon from '@icons/icon-3-cloud-moon.svg';

const iconMapping = {
  'clear-day': ClearDayIcon,
  'clear-night': ClearNightIcon,
  rain: RainIcon,
  snow: SnowIcon,
  sleet: SleetIcon,
  wind: WindIcon,
  fog: FogIcon,
  cloudy: CloudyIcon,
  'partly-cloudy-day': PartlyCloudyDayIcon,
  'partly-cloudy-night': PartlyCloudyNightIcon,
};

const SkyIcon = ({ width, height, icon }) => (
  <img src={iconMapping[icon]} alt={icon} width={width} height={height} />
);

export const SmallSkyIcon = props => (
  <SkyIcon width="32px" height="32px" {...props} />
);
export const MediumSkyIcon = props => (
  <SkyIcon width="55px" height="55px" {...props} />
);
export const LargeSkyIcon = props => (
  <SkyIcon width="72px" height="72px" {...props} />
);

SkyIcon.propTypes = {
  icon: PropTypes.oneOf([
    'clear-day',
    'clear-night',
    'rain',
    'snow',
    'sleet',
    'wind',
    'fog',
    'cloudy',
    'partly-cloudy-day',
    'partly-cloudy-night',
  ]).isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
};

export default SkyIcon;
