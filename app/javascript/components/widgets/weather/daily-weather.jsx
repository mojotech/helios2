import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { take } from 'ramda';
import styled from 'styled-components';
import { colors, fontSizes, weights, spacing } from '@lib/theme';
import { parseDay } from '@lib/datetime';
import { WhiteText } from '@components/typography';
import { Row } from '@components/row';
import { SmallSkyIcon } from '@weather/sky-icons';
import withFragment from '@hocs/with-fragment';

const Wrapper = styled(Row)`
  color: ${colors.grey};
  font-weight: ${weights.light};
  margin-left: ${spacing.xl};
  margin-top: 65px;
`;

const Item = styled.div`
  margin-left: 100px;
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
  fragment DailyWeather on Weather {
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
`;

const formatTempature = temperature => `${parseInt(temperature, 10)}°`;

const formatTempatures = (temperatureLow, temperatureHigh) =>
  `${formatTempature(temperatureLow)}-${formatTempature(temperatureHigh)}`;

const DailyWeather = ({ weather }) => {
  const { data: dailyWeathers } = weather.daily;

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
              <SmallSkyIcon icon={icon} />
            </IconWrapper>
            <Day>{parseDay(time)}</Day>
            <Temp>{formatTempatures(temperatureLow, temperatureHigh)}</Temp>
            <Rain>Rain {parseInt(precipProbability * 100, 10)}%</Rain>
          </Item>
        ),
      )}
    </Wrapper>
  );
};

DailyWeather.propTypes = {
  weather: PropTypes.shape({
    daily: PropTypes.shape({
      data: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
};

DailyWeather.fragments = {
  weather: getDailyWeather,
};

export default withFragment(DailyWeather);
