import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import CurrentTemp, {
  getCurrentTemp,
} from '@components/widgets/weather/current-temp';
import { getSunriseSunsetWeather } from '@weather/sunrise-sunset';
import Row from '@components/row';
import WeatherQuery from '@components/get-weather-query';
import { MediumSkyIcon } from '@weather/sky-icons';
import { getCurrentIcon } from '@weather/weather-icon';
import { colors, weights, fontSizes, fonts } from '@lib/theme';
import {
  WeatherLoadingMessage,
  WeatherDisconnectedMessage,
} from '@messages/message';

const CornerWeather = gql`
  fragment CornerWeather on Weather {
    ...CurrentTemp
    ...SunriseSunsetWeather
    ...CurrentIcon
  }
  ${getCurrentTemp}
  ${getSunriseSunsetWeather}
  ${getCurrentIcon}
`;

const BottomLineRow = styled(Row)`
  align-items: flex-end;
`;

const TempText = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.xlarge};
  font-weight: ${weights.regular};
  font-family: ${fonts.extended};
`;

const SkyIconWrapper = styled.div`
  margin-bottom: 5px;
`;

// eslint-disable-next-line react/prefer-stateless-function
class WeatherCorner extends React.Component {
  render() {
    const { location } = this.props;
    const { weather } = location;
    return (
      <BottomLineRow>
        <SkyIconWrapper>
          <MediumSkyIcon icon={weather.current.weather.icon} />
        </SkyIconWrapper>
        <TempText>
          <CurrentTemp {...{ weather }} />
        </TempText>
      </BottomLineRow>
    );
  }
}

WeatherCorner.propTypes = {
  location: PropTypes.shape({
    weather: PropTypes.shape({
      current: PropTypes.shape({
        temp: PropTypes.number.isRequired,
        weather: PropTypes.shape({
          icon: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

const getWeatherQuery = ({ cityName }) => (
  <WeatherQuery
    Subscription={WeatherCorner}
    LoadingMessage={WeatherLoadingMessage}
    DisconnectedMessage={WeatherDisconnectedMessage}
    WeatherFrag={CornerWeather}
    queryName="CornerWeather"
    cityName={cityName}
    startTimer={() => {}}
  />
);

getWeatherQuery.propTypes = {
  cityName: PropTypes.string.isRequired,
};

export default getWeatherQuery;
