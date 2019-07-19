import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CurrentTemp from '@weather/current-temp';
import HourlyTemps from '@weather/hourly-temps';
import MinutelyWeather from '@weather/minutely-weather';
import DailyWeather from '@weather/daily-weather';
import SunriseSunset from '@weather/sunrise-sunset';
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
    ...MinutelyWeather
    ...DailyWeather
    ...SunriseSunsetWeather
  }

  ${CurrentTemp.fragments.weather}
  ${HourlyTemps.fragments.weather}
  ${MinutelyWeather.fragments.weather}
  ${DailyWeather.fragments.weather}
  ${SunriseSunset.fragments.weather}
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

  render() {
    const { primaryLocation } = this.props;
    const { weather } = primaryLocation;
    return (
      <Column>
        <CenteredRow>
          <TempText>
            <CurrentTemp {...{ weather }} />
          </TempText>
          <HourlyTemps {...{ weather }} />
        </CenteredRow>
        <SummaryText>
          <MinutelyWeather {...{ weather }} useLargeIcon />
        </SummaryText>
        <SunriseSunset {...{ location: primaryLocation, weather }} />
        <DailyWeather {...{ weather }} />
        <Notice>Powered by Dark Sky</Notice>
      </Column>
    );
  }
}

SubscribedWeather.propTypes = {
  primaryLocation: PropTypes.shape({
    weather: PropTypes.shape({}).isRequired,
  }).isRequired,
  subscribeToPublishedEvents: PropTypes.func.isRequired,
};

const getWeatherQuery = () => (
  <WeatherQuery
    Subscription={SubscribedWeather}
    LoadingMessage={LoadingMessage}
    DisconnectedMessage={DisconnectedMessage}
    WeatherFrag={PanelWeather}
    queryName="PanelWeather"
  />
);

export default getWeatherQuery;
