import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import CurrentTemp from '@components/widgets/weather/current-temp';
import SunriseSunset from '@weather/sunrise-sunset';
import Row from '@components/row';
import WeatherQuery from '@components/get-weather-query';
import { MediumSkyIcon } from '@weather/sky-icons';
import CurrentIcon from '@weather/weather-icon';
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

  ${CurrentTemp.fragments.weather}
  ${SunriseSunset.fragments.weather}
  ${CurrentIcon.fragments.weather}
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TempText = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.xlarge};
  font-weight: ${weights.regular};
  font-family: ${fonts.extended};
  margin-top: 15px;
`;

const SkyIconWrapper = styled.div`
  margin-top: 35px;
  margin-right: 24px;
`;

class WeatherCorner extends React.Component {
  componentDidMount() {
    this.props.subscribeToPublishedEvents();
  }

  render() {
    const { primaryLocation } = this.props;
    const { weather } = primaryLocation;
    return (
      <Column>
        <Row>
          <SkyIconWrapper>
            <MediumSkyIcon icon={weather.currently.icon} />
          </SkyIconWrapper>
          <TempText>
            <CurrentTemp {...{ weather }} />
          </TempText>
        </Row>
      </Column>
    );
  }
}

WeatherCorner.propTypes = {
  primaryLocation: PropTypes.shape({
    weather: PropTypes.shape({
      currently: PropTypes.shape({
        temperature: PropTypes.number.isRequired,
        icon: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  subscribeToPublishedEvents: PropTypes.func.isRequired,
};

const getWeatherQuery = () => {
  return (
    <WeatherQuery
      Subscription={WeatherCorner}
      LoadingMessage={WeatherLoadingMessage}
      DisconnectedMessage={WeatherDisconnectedMessage}
      WeatherFrag={CornerWeather}
      queryName="CornerWeather"
    />
  );
};

export default getWeatherQuery;
