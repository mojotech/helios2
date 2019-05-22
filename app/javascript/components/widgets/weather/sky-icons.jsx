import React from 'react';
import PropTypes from 'prop-types';
import ClearDayIcon from '../../../../assets/images/icons/icon-29-sun.svg';
import ClearNightIcon from '../../../../assets/images/icons/icon-28-moon.svg';
import RainIcon from '../../../../assets/images/icons/icon-4-cloud-rain.svg';
import SnowIcon from '../../../../assets/images/icons/icon-17-cloud-snowflakes.svg';
import SleetIcon from '../../../../assets/images/icons/icon-7-cloud-snow.svg';
import WindIcon from '../../../../assets/images/icons/icon-43-wind.svg';
import FogIcon from '../../../../assets/images/icons/icon-24-cloud-fog.svg';
import CloudyIcon from '../../../../assets/images/icons/icon-1-cloud.svg';
import PartlyCloudyDayIcon from '../../../../assets/images/icons/icon-2-cloud-sun.svg';
import PartlyCloudyNightIcon from '../../../../assets/images/icons/icon-3-cloud-moon.svg';

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
