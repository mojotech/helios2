import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CurrentTemp, { getCurrentTemp } from '@weather/current-temp';
import HourlyTemps, { getHourlyWeather } from '@weather/hourly-temps';
import CurrentWeather, { getCurrentWeather } from '@weather/current-weather';
import DailyWeather, { getDailyWeather } from '@weather/daily-weather';
import SunriseSunset, {
  getSunriseSunsetWeather,
} from '@weather/sunrise-sunset';
import WeatherQuery from '@components/get-weather-query';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';
import { Row } from '@components/row';
import {
  colors,
  weights,
  fontSizes,
  spacing,
  fonts,
  leftPanelWidth,
} from '@lib/theme';
import { GreySubText, WhiteText } from '@components/typography';
import gql from 'graphql-tag';

const PanelWeather = gql`
  fragment PanelWeather on Weather {
    ...CurrentTemp
    ...HourlyWeather
    ...CurrentWeather
    ...DailyWeather
    ...SunriseSunsetWeather
  }
  ${getCurrentTemp}
  ${getHourlyWeather}
  ${getCurrentWeather}
  ${getDailyWeather}
  ${getSunriseSunsetWeather}
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const CenteredRow = styled(Row)`
  align-items: center;
  margin-left: 50px;
`;

const TempText = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.huge};
  font-weight: ${weights.regular};
  margin-right: ${spacing.xxxl};
  font-family: ${fonts.extended};
`;

const SummaryText = styled(WhiteText)`
  font-size: ${fontSizes.large};
  font-weight: ${weights.regular};
  width: ${leftPanelWidth};
  text-align: center;
  font-family: ${fonts.light};
`;

const Notice = styled(GreySubText)`
  font-size: ${fontSizes.tiny};
  text-align: center;
  width: ${leftPanelWidth};
`;

class SubscribedWeather extends React.Component {
  componentDidMount() {
    this.props.subscribeToPublishedEvents();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.location !== nextProps.location;
  }

  render() {
    const { location } = this.props;
    const { weather } = location;
    return (
      <Column>
        <CenteredRow>
          <TempText>
            <CurrentTemp {...{ weather }} />
          </TempText>
          <HourlyTemps {...{ weather }} />
        </CenteredRow>
        <SummaryText>
          <CurrentWeather {...{ weather }} useLargeIcon />
        </SummaryText>
        <SunriseSunset {...{ location, weather }} />
        <DailyWeather {...{ weather }} />
        <Notice>Powered by OpenWeather</Notice>
      </Column>
    );
  }
}

SubscribedWeather.propTypes = {
  location: PropTypes.shape({
    weather: PropTypes.shape({}).isRequired,
  }).isRequired,
  subscribeToPublishedEvents: PropTypes.func.isRequired,
};

const getWeatherQuery = ({ startTimer, cityName }) => (
  <WeatherQuery
    Subscription={SubscribedWeather}
    LoadingMessage={LoadingMessage}
    DisconnectedMessage={DisconnectedMessage}
    WeatherFrag={PanelWeather}
    queryName="PanelWeather"
    cityName={cityName}
    startTimer={startTimer}
  />
);

getWeatherQuery.propTypes = {
  cityName: PropTypes.string.isRequired,
  startTimer: PropTypes.func.isRequired,
};

export default getWeatherQuery;
