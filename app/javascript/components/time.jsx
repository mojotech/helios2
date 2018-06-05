import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { GreySubText } from './typography';
import { colors, fontSizes, spacing, weights } from '../lib/theme';
import { Row } from './row';
import { timeForTimezone } from '../lib/datetime';

const Wrapper = styled.div`
  font-size: ${fontSizes.medium};
  font-weight: ${weights.light};
`;

const HourMin = styled.div``;

const AMPM = styled.div``;

const TimeValue = styled(Row)`
  align-items: flex-end;
  color: ${({ isPrimary }) => (isPrimary ? colors.white : colors.grey)};

  ${/* sc-sel */ HourMin} {
    ${({ isPrimary }) => isPrimary && `font-size: ${fontSizes.huge}`};
  }

  ${/* sc-sel */ AMPM} {
    ${({ isPrimary }) => isPrimary && `font-size: ${fontSizes.large}`};
  }
`;

const City = styled(GreySubText)`
  margin-bottom: ${spacing.xs};
`;

export class Time extends React.Component {
  static propTypes = {
    isPrimary: PropTypes.bool.isRequired,
    cityName: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { time: timeForTimezone(props.timezone) };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ time: timeForTimezone(this.props.timezone) });
    }, 10000);
  }

  render() {
    const { timezone, cityName, isPrimary } = this.props;
    const [time, ampm] = this.state.time.split(' ');
    return (
      <Wrapper>
        <City>{cityName}</City>
        <TimeValue {...{ isPrimary }}>
          <HourMin>{time}</HourMin>
          <AMPM>{ampm}</AMPM>
        </TimeValue>
      </Wrapper>
    );
  }
}

export default Time;
