import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { colors, fontSizes } from '@lib/theme';
import { CurrentTabBar, OtherTabBar } from '@components/tab-bar';

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

export class Tab extends React.Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    widgetId: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
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
    return <div>{widgetBar}</div>;
  }
}

export default Tab;
