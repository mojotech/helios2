import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { take } from 'ramda';
import styled from 'styled-components';
import Skycons from 'react-skycons';
import { colors, fontSizes, weights, spacing } from '../lib/theme';
import { Row } from './row';
import { parseDay } from '../lib/datetime';
import { WhiteText } from './typography';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const Wrapper = styled(Row)`
  color: ${colors.grey};
  font-weight: ${weights.light};
  margin-left: ${spacing.xl};
  margin-top: ${spacing.xxl};
`;

const Item = styled.div`
  margin: 0 ${spacing.l};
`;

const Day = styled(WhiteText)`
  font-size: ${fontSizes.small};
  margin-top: ${spacing.m};
`;

const Temp = styled.div`
  font-size: ${fontSizes.small};
  margin-top: ${spacing.m};
`;

const Rain = styled.div`
  font-size: ${fontSizes.small};
  margin-top: ${spacing.s};
`;

const IconWrapper = styled.div`
  width: 60px;
`;

const getDailyWeather = gql`
  {
    primaryLocation {
      weather {
        daily {
          data {
            temperatureLow
            temperatureHigh
            time
            precipProbability
            icon
          }
        }
      }
    }
  }
`;

const formatTempature = temperature => `${parseInt(temperature, 10)}°`;

const formatTempatures = (temperatureLow, temperatureHigh) =>
  `${formatTempature(temperatureLow)}-${formatTempature(temperatureHigh)}`;

export default () => (
  <Query query={getDailyWeather}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage message={error.message} />;
      }

      const { data: dailyWeathers } = data.primaryLocation.weather.daily;

      return (
        <Wrapper>
          {take(4, dailyWeathers).map(
            ({
              time,
              temperatureLow,
              temperatureHigh,
              precipProbability,
              icon,
            }) => (
              <Item key={time}>
                <IconWrapper>
                  <Skycons
                    color="white"
                    autoplay={false}
                    icon={icon.toUpperCase().replace(/-/g, '_')}
                  />
                </IconWrapper>
                <Day>{parseDay(time)}</Day>
                <Temp>{formatTempatures(temperatureLow, temperatureHigh)}</Temp>
                <Rain>Rain {parseInt(precipProbability * 100, 10)}%</Rain>
              </Item>
            ),
          )}
        </Wrapper>
      );
    }}
  </Query>
);
