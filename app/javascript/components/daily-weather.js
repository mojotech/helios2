import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { take } from 'ramda';
import styled from 'styled-components';
import { colors, fontSizes, weights, spacing } from '../lib/theme';
import { Row } from './row';
import { parseDay } from '../lib/datetime';
import { WhiteText } from './typography';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;

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
  font-size: ${fontSizes.medium};
`;

const Temp = styled.div`
  font-size: ${fontSizes.medium};
  margin-top: ${spacing.m};
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
          }
        }
      }
    }
  }
`;

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
          {take(
            4,
            dailyWeathers,
          ).map(({ time, temperatureLow, temperatureHigh }) => (
            <Item key={time}>
              <Day>{parseDay(time)}</Day>
              <Temp>
                {parseInt(temperatureLow, 10)}°-{parseInt(temperatureHigh, 10)}°
              </Temp>
            </Item>
          ))}
        </Wrapper>
      );
    }}
  </Query>
);
