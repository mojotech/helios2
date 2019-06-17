import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { assocPath } from 'ramda';
import styled from 'styled-components';
import CurrentTemp from '@weather/current-temp';
import HourlyTemps from '@weather/hourly-temps';
import MinutelyWeather from '@weather/minutely-weather';
import DailyWeather from '@weather/daily-weather';
import SunriseSunset from '@weather/sunrise-sunset';
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

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const CenteredRow = styled(Row)`
  align-items: center;
  margin-left: 50px;
  margn-top: ${spacing.m};
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
  margin-top: 50px;
  width: ${leftPanelWidth};
  text-align: center;
  font-family: ${fonts.light};
`;

const Notice = styled(GreySubText)`
  font-size: ${fontSizes.tiny};
  margin-top: 80px;
  text-align: center;
  width: ${leftPanelWidth};
`;

const getPrimaryLocationWeather = gql`
  {
    primaryLocation {
      latitude
      longitude
      ...SunriseSunsetLocation
      weather {
        ...CurrentTemp
        ...HourlyWeather
        ...MinutelyWeather
        ...DailyWeather
        ...SunriseSunsetWeather
      }
    }
  }

  ${CurrentTemp.fragments.weather}
  ${HourlyTemps.fragments.weather}
  ${MinutelyWeather.fragments.weather}
  ${SunriseSunset.fragments.location}
  ${DailyWeather.fragments.weather}
  ${SunriseSunset.fragments.weather}
`;

const subscribeWeatherPublished = gql`
  subscription onWeatherPublished($latitude: Float!, $longitude: Float!) {
    weatherPublished(latitude: $latitude, longitude: $longitude) {
      ...CurrentTemp
      ...HourlyWeather
      ...MinutelyWeather
      ...DailyWeather
      ...SunriseSunsetWeather
    }
  }

  ${CurrentTemp.fragments.weather}
  ${HourlyTemps.fragments.weather}
  ${MinutelyWeather.fragments.weather}
  ${DailyWeather.fragments.weather}
  ${SunriseSunset.fragments.weather}
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

export default () => (
  <Query query={getPrimaryLocationWeather} fetchPolicy="cache-and-network">
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <DisconnectedMessage />;
      }

      return (
        <SubscribedWeather
          primaryLocation={data.primaryLocation}
          subscribeToPublishedEvents={() =>
            subscribeToMore({
              document: subscribeWeatherPublished,
              variables: {
                latitude: data.primaryLocation.latitude,
                longitude: data.primaryLocation.longitude,
              },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                const { weatherPublished } = subscriptionData.data;

                return assocPath(
                  ['primaryLocation', 'weather'],
                  weatherPublished,
                  prev,
                );
              },
            })
          }
        />
      );
    }}
  </Query>
);
