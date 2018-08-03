import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { parseTime, timeDiffInMinutes } from '../lib/datetime';
import { Box } from 'grid-styled';
import { Text } from './typography';
import { InnerBound } from './Layout';
import { SemiCircle } from './semi-circle';
import { colors, spacing, leftPanelWidth } from '../lib/theme';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const containerHeight = '350px';

const SunriseSunsetContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
`;

const LabelRow = styled(Box)`
  align-content: center;
  bottom: 0;
  display: flex;
  height: 100px;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  z-index: 2;
`;

const SunTime = ({ time }) => (
  <Text color={colors.grey}>{parseTime(time)}</Text>
);

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
        <InnerBound mb={spacing.xl}>
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
            <LabelRow>
              <Box mx={spacing.xxl}>
                <Text mb={spacing.m}>Sunrise</Text>
                <SunTime time={sunriseTime} />
              </Box>
              <Box mx={spacing.xxl}>
                <Text mb={spacing.m}>Sunset</Text>
                <SunTime time={sunsetTime} />
              </Box>
            </LabelRow>
          </SunriseSunsetContainer>
        </InnerBound>
      );
    }}
  </Query>
);
