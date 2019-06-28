import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { colors, fontSizes } from '@lib/theme';
import { CurrentTabBar, OtherTabBar } from '@components/tab-bar';

const SPACEBAR = 32;

const CurrentTabText = styled.div`
  margin-top: 19px;
  margin-bottom: 19px;
  font-size: ${fontSizes.small};
  color: ${colors.white};
  cursor: pointer;
`;

const OtherTabText = styled.div`
  margin-top: 19px;
  margin-bottom: 19px;
  font-size: ${fontSizes.small};
  color: ${colors.white};
  opacity: 0.5;
  cursor: pointer;
`;

const TabButton = styled.div`
  outline: none;
`;

export class Tab extends React.Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    widgetId: PropTypes.number.isRequired,
    totalTime: PropTypes.number.isRequired,
    tabDown: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { totalTime } = props;
    this.state = {
      timeBarProgress: totalTime,
      maxTime: totalTime,
    };
    this.timeRemaining = totalTime;
    this.isPaused = false;
  }

  componentDidMount() {
    if (this.props.selected) {
      this.timer();
    }
  }

  componentDidUpdate(prevProps) {
    const isSelected = this.props.selected;
    if (isSelected !== prevProps.selected) {
      if (isSelected && !this.intervalId) {
        this.timer();
      } else if (!isSelected) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.timeRemaining = this.state.maxTime;
        this.setPause(false);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  setPause(isPaused) {
    this.isPaused = isPaused;
  }

  handleKeyPress = ({ keyCode }) => {
    if (keyCode === SPACEBAR) this.togglePause();
  };

  timer() {
    const max = this.state.maxTime;
    this.intervalId = setInterval(() => {
      if (this.props.selected) {
        if (!this.isPaused) {
          this.timeRemaining -= 50;
        } else {
          this.timeRemaining = max;
        }
        if (this.timeRemaining <= 0) {
          this.timeRemaining = max;
          this.props.tabDown();
        }
      } else {
        this.timeRemaining = max;
        this.setPause(false);
      }
      this.setState({ timeBarProgress: this.timeRemaining });
    }, 50);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  render() {
    const isSelected = this.props.selected;
    const widgetBar = isSelected ? (
      <span>
        <CurrentTabText id={`widget_${this.props.widgetId}`}>
          {this.props.text}
        </CurrentTabText>
        <CurrentTabBar
          time={this.state.timeBarProgress}
          max={this.state.maxTime}
        />
      </span>
    ) : (
      <span>
        <OtherTabText id={`widget_${this.props.widgetId}`}>
          {this.props.text}
        </OtherTabText>
        <OtherTabBar />
      </span>
    );
    return (
      <TabButton onKeyDown={this.handleKeyPress} tabIndex="0">
        {widgetBar}
      </TabButton>
    );
  }
}

export default Tab;
