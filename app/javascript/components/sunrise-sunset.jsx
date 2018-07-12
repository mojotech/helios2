import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  colors,
  fontSizes,
  weights,
  spacing,
  leftPanelWidth,
} from '../lib/theme';
import { parseTime, timeDiffInMinutes } from '../lib/datetime';
import { WhiteText } from './typography';
import SemiCircle from './semi-circle';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const containerHeight = '344px';

const SunriseSunsetContainer = styled.div`
  margin-top: ${spacing.xxl};
  width: ${leftPanelWidth};
  height: ${containerHeight};
  position: relative;
  top: 0px;
`;

const Text = styled(WhiteText)`
  font-size: ${fontSizes.small};
`;

const Time = styled.div`
  font-size: ${fontSizes.small};
  margin-top: ${spacing.m};
  color: ${colors.grey};
  font-weight: ${weights.light};
  margin-top: ${spacing.s};
`;

const SunriseLabel = styled.div`
  position: absolute;
  top: 252px;
  left: 14px;
  z-index: 2;
`;

const SunsetLabel = styled.div`
  position: absolute;
  top: 252px;
  left: 739px;
  z-index: 2;
`;

const getSunriseSunset = gql`
  {
    primaryLocation {
      timezone
      weather {
        daily {
          data {
            sunriseTime
            sunsetTime
          }
        }
      }
    }
  }
`;

export default () => (
  <Query query={getSunriseSunset}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage message={error.message} />;
      }

      const {
        sunriseTime,
        sunsetTime,
      } = data.primaryLocation.weather.daily.data[0];
      const officeTimezone = data.primaryLocation.timezone;

      return (
        <SunriseSunsetContainer>
          <SemiCircle
            totalTime={timeDiffInMinutes(
              new Date(sunsetTime),
              new Date(sunriseTime),
            )}
            sunset={new Date(sunsetTime)}
            width={leftPanelWidth}
            height={containerHeight}
            timezone={officeTimezone}
          />
          <SunriseLabel>
            <Text> Sunrise </Text>
            <Time>{parseTime(sunriseTime)}</Time>
          </SunriseLabel>
          <SunsetLabel>
            <Text> Sunset </Text>
            <Time>{parseTime(sunsetTime)}</Time>
          </SunsetLabel>
        </SunriseSunsetContainer>
      );
    }}
  </Query>
);
