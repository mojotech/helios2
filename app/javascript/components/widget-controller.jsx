import React from 'react';
import styled from 'styled-components';
import { mathMod } from 'ramda';
import FullPanel from './full-panel';
import SidePanel from './side-panel';
import CurrentWeather from './current-weather';
import Twitter from './twitter';
import Numbers from './widgets/numbers';
import Live from './live-stream';
import GuestsWidget from './guests-widget';
import CurrentTemp from './current-temp';
import MinutelyWeather from './minutely-weather';
import lockedIcon from '../../assets/images/locked.svg';
import unlockedIcon from '../../assets/images/unlocked.svg';
import { colors } from '../lib/theme';

const weatherChildren = (
  <div>
    <CurrentTemp /> - <MinutelyWeather />
  </div>
);

const IconWrapper = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
`;

const Icon = styled.button`
  height: 21px;
  width: 16px;
  border-style: none;
  background-color: ${colors.black};
`;

const iconId = 'lock-icon';

const widgets = [
  {
    panel: <CurrentWeather />,
    text: 'Weather',
    children: weatherChildren,
  },
  {
    panel: <Twitter />,
    text: '@MojoTech',
    children: 'Last tweeted 2 days ago.',
  },
  {
    panel: <Numbers.Panel />,
    text: 'MojoTech by the Numbers',
    children: <Numbers.Carousel />,
  },
  {
    panel: <Live />,
    text: 'MojoTech Boulder',
    children: 'Live.',
  },
  {
    panel: <GuestsWidget />,
  },
];

export class WidgetController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      isLocked: false,
    };
  }

  componentDidMount() {
    this.startCarousel();
  }

  switchLock = () => {
    this.setState(prevState => ({ isLocked: !prevState.isLocked }));
  };

  startCarousel() {
    setInterval(() => {
      if (!this.state.isLocked) {
        this.moveDown();
      }
    }, 30000);
  }

  switchPages = ({ keyCode }) => {
    const upKey = 38;
    const downKey = 40;
    if (keyCode === downKey) {
      this.moveDown();
    }
    if (keyCode === upKey) {
      this.moveUp();
    }
  };

  switchToPage = index => {
    this.setState({ index });
  };

  handleClicks = ({ target }) => {
    const targetId = target.id;
    if (targetId === iconId) {
      this.switchLock();
    } else if (targetId.startsWith('widget_')) {
      const widgetId = parseInt(targetId.replace('widget_', ''), 10);
      this.switchToPage(widgetId);
    }
  };

  moveUp() {
    this.setState({ index: mathMod(this.state.index - 1, widgets.length) });
  }

  moveDown() {
    this.setState({ index: (this.state.index + 1) % widgets.length });
  }

  render() {
    const { index, isLocked } = this.state;
    const currentWidget = widgets[index];
    const icon = isLocked ? lockedIcon : unlockedIcon;

    return (
      // eslint-disable-next-line
      <div onKeyDown={this.switchPages} onClick={this.handleClicks} tabIndex="0">
        <FullPanel currentWidget={currentWidget.panel} />
        <SidePanel widgets={widgets} selectedWidget={index} />
        <IconWrapper>
          <Icon style={{ backgroundImage: `url(${icon})` }} id={iconId} />
        </IconWrapper>
      </div>
    );
  }
}

export default WidgetController;
