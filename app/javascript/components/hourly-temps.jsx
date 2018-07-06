import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { take } from 'ramda';
import styled from 'styled-components';
import { colors, fontSizes, weights, spacing, fonts } from '../lib/theme';
import { Row } from './row';
import { parseHour } from '../lib/datetime';
import rainIcon from '../../assets/images/raincloud.png';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const Wrapper = styled(Row)`
  color: ${colors.grey};
  font-weight: ${weights.light};
  margin-left: ${spacing.xxxl};
`;

const Item = styled.div`
  margin: 0 ${spacing.xl};
  text-align: center;
  font-family: ${fonts.thin};
`;

const Time = styled.div`
  font-size: ${fontSizes.tiny};
`;

const Temp = styled.div`
  font-size: ${fontSizes.large};
  margin: ${spacing.xs} 0;
`;

const Precip = styled.div`
  font-size: ${fontSizes.tiny};
`;

const Percent = styled.span`
  font-size: ${fontSizes.micro};
`;

const RainIcon = styled.img`
  margin-right: ${spacing.s};
`;

const getHourlyWeather = gql`
  {
    primaryLocation {
      weather {
        hourly {
          data {
            temperature
            time
            precipProbability
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
          {take(5, hourlyWeathers).map(
            ({ time, temperature, precipProbability }) => (
              <Item key={time}>
                <Time>{parseHour(time)}</Time>
                <Temp>{parseInt(temperature, 10)}°</Temp>
                <Precip>
                  <RainIcon src={rainIcon} width="10" height="10" alt="" />
                  {parseInt(precipProbability * 100, 10)}
                  <Percent>%</Percent>
                </Precip>
              </Item>
            ),
          )}
        </Wrapper>
      );
    }}
  </Query>
);
