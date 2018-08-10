import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { take } from 'ramda';
import styled from 'styled-components';
import { colors, fontSizes, spacing, fonts } from '../../../lib/theme';
import { Row } from '../..//row';
import { parseHour } from '../../../lib/datetime';
import rainIcon from '../../../../assets/images/raincloud.png';
import withFragment from '../../hocs/with-fragment';

const opacities = {
  0: '0.8',
  1: '0.675',
  2: '0.55',
  3: '0.425',
  4: '0.3',
};

const Wrapper = styled(Row)`
  color: ${colors.white};
  margin-left: ${spacing.xxxl};
`;

const Item = styled.div`
  margin: 0 ${spacing.xl};
  text-align: center;
  font-family: ${fonts.thin};
  opacity: ${props => opacities[props.index]};
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
  fragment HourlyWeather on Weather {
    hourly {
      data {
        temperature
        time
        precipProbability
      }
    }
  }
`;

const HourlyTemps = ({ weather }) => {
  const { data: hourlyWeathers } = weather.hourly;

  return (
    <Wrapper>
      {take(5, hourlyWeathers).map(
        ({ time, temperature, precipProbability }, idx) => (
          <Item key={time} index={idx}>
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
};

HourlyTemps.propTypes = {
  weather: PropTypes.shape({
    hourly: PropTypes.shape({
      data: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
};

HourlyTemps.fragments = {
  weather: getHourlyWeather,
};

export default withFragment(HourlyTemps);
