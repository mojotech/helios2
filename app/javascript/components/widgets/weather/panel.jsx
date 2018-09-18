import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { path } from 'ramda';
import styled from 'styled-components';
import CurrentTemp from './current-temp';
import HourlyTemps from './hourly-temps';
import MinutelyWeather from './minutely-weather';
import DailyWeather from './daily-weather';
import SunriseSunset from './sunrise-sunset';
import { Row } from '../../row';
import {
  colors,
  weights,
  fontSizes,
  spacing,
  fonts,
  leftPanelWidth,
} from '../../../lib/theme';
import { GreySubText, WhiteText } from '../../typography';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const CenteredRow = styled(Row)`
  align-items: center;
`;

const TempText = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.huge};
  font-weight: ${weights.light};
  margin-right: ${spacing.xxxl};
  font-family: ${fonts.thin};
`;

const SummaryText = styled(WhiteText)`
  font-size: ${fontSizes.large};
  font-weight: ${weights.light};
  margin-top: 50px;
  margin-bottom: 50px;
  width: ${leftPanelWidth};
  text-align: center;
  font-family: ${fonts.light};
`;

const Notice = styled(GreySubText)`
  font-size: ${fontSizes.tiny};
  text-align: center;
  width: ${leftPanelWidth};
`;

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const getPrimaryLocationWeather = gql`
  {
    primaryLocation {
      ...SunriseSunsetLocation
      weather {
        ...CurrentTemp
        ...HourlyWeather
        ...MinutelyWeather
        ...SunriseSunsetWeather
        ...DailyWeather
      }
    }
  }

  ${CurrentTemp.fragments.weather}
  ${HourlyTemps.fragments.weather}
  ${MinutelyWeather.fragments.weather}
  ${SunriseSunset.fragments.weather}
  ${SunriseSunset.fragments.location}
  ${DailyWeather.fragments.weather}
`;

export default () => (
  <Query query={getPrimaryLocationWeather} pollInterval={120000}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage message={error.message} />;
      }

      const location = path(['primaryLocation'], data);
      const weather = path(['primaryLocation', 'weather'], data);
      return (
        <Column>
          <CenteredRow>
            <TempText>
              <CurrentTemp {...{ weather }} />
            </TempText>
            <HourlyTemps {...{ weather }} />
          </CenteredRow>
          <SummaryText>
            <MinutelyWeather {...{ weather }} />
          </SummaryText>
          <SunriseSunset {...{ location, weather }} />
          <DailyWeather {...{ weather }} />
          <Notice>Powered by Dark Sky</Notice>
        </Column>
      );
    }}
  </Query>
);
