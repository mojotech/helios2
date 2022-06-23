import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, fontSizes, weights, fonts } from '@lib/theme';
import { Row } from '@components/row';
import { timeForTimezone } from '@lib/datetime';

const Wrapper = styled.div`
  font-size: ${fontSizes.medium};
`;

const HourMin = styled.div`
  font-size: ${fontSizes.xlarge};
  font-family: ${fonts.extended};
  font-weight: ${weights.regular};
`;

const AMPM = styled.div`
  font-size: ${fontSizes.medium};
  font-family: ${fonts.extended};
  margin-left: 11px;
  line-height: 45px;
`;

const TimeValue = styled(Row)`
  align-items: flex-end;
  color: ${colors.white};
  font-family: ${fonts.extended};
  font-weight: ${weights.regular};
`;

const propTypes = {
  location: PropTypes.shape({
    timeZone: PropTypes.string.isRequired,
  }).isRequired,
};

export class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: timeForTimezone(props.location.timeZone) };
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({ time: timeForTimezone(this.props.location.timeZone) });
    }, 10000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    const [time, ampm] = this.state.time.split(' ');
    return (
      <Wrapper>
        <TimeValue>
          <HourMin>{time}</HourMin>
          <AMPM>{ampm}</AMPM>
        </TimeValue>
      </Wrapper>
    );
  }
}

Time.propTypes = propTypes;

export default Time;
