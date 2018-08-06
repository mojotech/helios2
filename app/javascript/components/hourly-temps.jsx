import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { take } from 'ramda';
import styled from 'styled-components';
import { fontSizes, spacing } from '../lib/theme';
import { parseHour } from '../lib/datetime';
import { Text, ExtendedTxt } from './typography';
import { Box, Flex } from 'grid-styled';
import rainIcon from '../../assets/images/raincloud.png';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const opacities = {
  0: '0.8',
  1: '0.675',
  2: '0.55',
  3: '0.425',
  4: '0.3',
};

const Item = styled(Box)`
  text-align: center;
  opacity: ${props => opacities[props.index]};
`;

const Time = ({ source }) => (
  <Text mb={spacing.m} fontSize={fontSizes.tiny}>
    {parseHour(source)}
  </Text>
);

const Temp = ({ source }) => (
  <ExtendedTxt fontSize={fontSizes.large} mb={spacing.m}>
    {parseInt(source, 10)}°
  </ExtendedTxt>
);

const Precipitation = ({ source, icon }) => {
  const RainIcon = styled.img`
    margin-right: ${spacing.m};
  `;

  return (
    <Flex alignItems={'center'}>
      <RainIcon
        src={rainIcon}
        width="10"
        height="10"
        alt="An icon representing the current percipitation"
      />
      <Text fontSize={fontSizes.small}>
        {parseInt(source * 100, 10)}
        <Text is={'sup'} fontSize={fontSizes.micro}>
          %
        </Text>
      </Text>
    </Flex>
  );
};

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
        <Flex width={'100%'} justifyContent={'space-between'}>
          {take(5, hourlyWeathers).map(
            ({ time, temperature, precipProbability }, idx) => (
              <Item key={time} index={idx} mx={spacing.xl}>
                <Time source={time} />
                <Temp source={temperature} />
                <Precipitation source={precipProbability} />
              </Item>
            ),
          )}
        </Flex>
      );
    }}
  </Query>
);
