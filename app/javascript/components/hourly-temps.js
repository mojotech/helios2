import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { take } from 'ramda';
import styled from 'styled-components';
import { colors, fontSizes, weights, spacing } from '../lib/theme';
import { Row } from './row';
import { parseTime } from '../lib/datetime';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;

const Wrapper = styled(Row)`
  color: ${colors.grey};
  font-weight: ${weights.light};
  margin-left: ${spacing.xl};
`;

const Item = styled.div`
  margin: 0 ${spacing.l};
  text-align: center;
`;

const Time = styled.div`
  font-size: ${fontSizes.medium};
`;

const Temp = styled.div`
  font-size: ${fontSizes.xxlarge};
`;

const getHourlyWeather = gql`
  {
    primaryLocation {
      weather {
        hourly {
          data {
            temperature
            time
          }
        }
      }
    }
  }
`;

export default () => (
  <Query query={getHourlyWeather}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage message={error.message} />;
      }

      const { data: hourlyWeathers } = data.primaryLocation.weather.hourly;

      return (
        <Wrapper>
          {take(5, hourlyWeathers).map(({ time, temperature }) => (
            <Item key={time}>
              <Time>{parseTime(time)}</Time>
              <Temp>{parseInt(temperature, 10)}°</Temp>
            </Item>
          ))}
        </Wrapper>
      );
    }}
  </Query>
);
