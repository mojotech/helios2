import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import CurrentTemp from '@components/widgets/weather/current-temp';
import HourlyTemps from '@components/widgets/weather/hourly-temps';
import CurrentPercip from '@components/widgets/weather/current-percip';
import MinutelyWeather from '@weather/minutely-weather';
import DailyWeather from '@weather/daily-weather';
import SunriseSunset from '@weather/sunrise-sunset';
import Row from '@components/row';
import WeatherQuery from '@components/get-weather-query';
import rainIcon from '@assets/images/raincloud.png';
import { colors, weights, fontSizes, spacing, fonts } from '@lib/theme';
import {
  WeatherLoadingMessage,
  WeatherDisconnectedMessage,
} from '@messages/message';

const CornerWeather = gql`
  fragment CornerWeather on Weather {
    ...CurrentTemp
    ...CurrentPercip
    ...HourlyWeather
    ...MinutelyWeather
    ...DailyWeather
    ...SunriseSunsetWeather
  }

  ${CurrentTemp.fragments.weather}
  ${CurrentPercip.fragments.weather}
  ${HourlyTemps.fragments.weather}
  ${MinutelyWeather.fragments.weather}
  ${DailyWeather.fragments.weather}
  ${SunriseSunset.fragments.weather}
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

const Precip = styled.div`
  font-size: ${fontSizes.medium};
  font-family: ${fonts.regular};
  margin-left: ${spacing.l};
`;

const RainIcon = styled.img`
  margin-right: ${spacing.s};
`;

const Percent = styled.span`
  font-size: 14px;
`;
const HourlyText = styled.span`
  margin-top: ${spacing.l};
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
          <TempText>
            <CurrentTemp {...{ weather }} />
            <Precip>
              <RainIcon src={rainIcon} width="32" height="32" alt="" />
              <CurrentPercip {...{ weather }} />
              <Percent>%</Percent>
            </Precip>
          </TempText>
          <HourlyText>
            <HourlyTemps {...{ weather }} hours={4} />
          </HourlyText>
        </Row>
      </Column>
    );
  }
}

WeatherCorner.propTypes = {
  primaryLocation: PropTypes.shape({
    weather: PropTypes.shape({
      hourly: PropTypes.shape({
        data: PropTypes.array.isRequired,
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
