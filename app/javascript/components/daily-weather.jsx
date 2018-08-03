import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { take } from 'ramda';
import { Box, Flex } from 'grid-styled';
import { colors, spacing } from '../lib/theme';
import { parseDay } from '../lib/datetime';
import { Text } from './typography';
import SkyIcon from './sky-icons';
import { InnerBound } from './Layout';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const Day = ({ time }) => (
  <Text mb={spacing.xl} color={colors.white}>
    {time && parseDay(time)}
  </Text>
);

const Temp = ({ low, high }) => {
  const formatTempature = temperature => `${parseInt(temperature, 10)}°`;
  const formatTempatures = (temperatureLow, temperatureHigh) =>
    `${formatTempature(temperatureLow)}-${formatTempature(temperatureHigh)}`;

  return (
    <Text mb={spacing.s} color={colors.grey}>
      {formatTempatures(low, high)}
    </Text>
  );
};

const Rain = ({ percip }) => (
  <Text color={colors.grey}>Rain {parseInt(percip * 100, 10)}%</Text>
);

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
        <InnerBound justifyContent={'space-between'} px={'100px'}>
          {take(4, dailyWeathers).map(
            ({
              time,
              precipProbability,
              temperatureLow,
              temperatureHigh,
              icon,
            }) => (
              <Box key={time}>
                <Box width={'60x'}>
                  <SkyIcon icon={icon} />
                </Box>
                <Day time={time} />
                <Temp low={temperatureLow} high={temperatureHigh} />
                <Rain {...{ precipProbability }} />
              </Box>
            ),
          )}
        </InnerBound>
      );
    }}
  </Query>
);
