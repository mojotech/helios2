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
  'clear-day': <img src={ClearDayIcon} alt="clear-day" />,
  'clear-night': <img src={ClearNightIcon} alt="clear-night" />,
  rain: <img src={RainIcon} alt="rain" />,
  snow: <img src={SnowIcon} alt="snow" />,
  sleet: <img src={SleetIcon} alt="sleet" />,
  wind: <img src={WindIcon} alt="wind" />,
  fog: <img src={FogIcon} alt="fog" />,
  cloudy: <img src={CloudyIcon} alt="cloudy" />,
  'partly-cloudy-day': (
    <img src={PartlyCloudyDayIcon} alt="partly-cloudy-day" />
  ),
  'partly-cloudy-night': (
    <img src={PartlyCloudyNightIcon} alt="partly-cloudy-night" />
  ),
};

export const SkyIcon = ({ icon }) => iconMapping[icon];

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
};

export default SkyIcon;
