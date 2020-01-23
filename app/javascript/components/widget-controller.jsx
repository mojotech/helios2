import React from 'react';
import { mathMod } from 'ramda';
import styled from 'styled-components';
import FullPanel from '@components/full-panel';
import SidePanel from '@components/side-panel';
import Twitter from '@widgets/twitter';
import Numbers from '@widgets/numbers';
import Weather from '@widgets/weather';
import Traffic from '@widgets/traffic';

const SWITCH_INTERVAL = 20000;

const Wrapper = styled.div`
  outline: none;
`;

const widgets = [
  {
    panel: Weather.Panel,
    text: 'Weather',
    showWeather: false,
  },
  {
    panel: Twitter.Panel,
    text: '@MojoTech',
    showWeather: true,
  },
  {
    panel: Numbers.Panel,
    text: 'MojoTech by the Numbers',
    showWeather: true,
  },
  {
    panel: Traffic.Panel,
    text: 'Traffic',
    showWeather: true,
    hourStart: 16,
    hourStop: 23,
    isVisible: false,
  },
];

export class WidgetController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      transitionTime: Date.now() + SWITCH_INTERVAL,
    };
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      const { transitionTime, pausedTime } = this.state;

      if (!transitionTime || pausedTime) {
        return;
      }

      const now = Date.now();

      if (transitionTime < now) {
        this.moveDown();
      }
    }, 500);
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  switchPages = ({ keyCode }) => {
    const upKey = 38;
    const downKey = 40;
    const SPACEBAR = 32;
    if (keyCode === SPACEBAR) {
      this.setState(({ pausedTime, transitionTime }) =>
        pausedTime
          ? {
              pausedTime: null,
              transitionTime: transitionTime - pausedTime + Date.now(),
            }
          : { pausedTime: Date.now() },
      );
    }
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
    if (targetId.startsWith('widget_')) {
      const widgetId = parseInt(targetId.replace('widget_', ''), 10);
      this.switchToPage(widgetId);
    }
  };

  moveDown = () => {
    this.setState(({ index }) => ({
      index: (index + 1) % this.getVisibleWidgets().length,
      transitionTime: Date.now() + SWITCH_INTERVAL,
    }));
  };

  moveUp = () => {
    this.setState(({ index }) => ({
      index: mathMod(index - 1, this.getVisibleWidgets().length),
      transitionTime: Date.now() + SWITCH_INTERVAL,
    }));
  };

  getVisibleWidgets = () => {
    const date = new Date();
    const currentHour = date.getHours();

    return widgets.filter(widget => {
      if (widget.hourStart !== undefined) {
        if (currentHour >= widget.hourStart && currentHour < widget.hourStop) {
          return true;
        }
        return false;
      }
      return true;
    });
  };

  render() {
    const { index, pausedTime } = this.state;
    const visibleWidgets = this.getVisibleWidgets();
    const currentWidget = visibleWidgets[index];

    return (
      // eslint-disable-next-line
      <Wrapper
        onKeyDown={this.switchPages}
        onClick={this.handleClicks}
        // eslint-disable-next-line
        tabIndex="0"
      >
        <FullPanel>
          <currentWidget.panel />
        </FullPanel>
        <SidePanel
          widgets={visibleWidgets}
          selectedWidget={index}
          totalTime={SWITCH_INTERVAL}
          isPaused={!!pausedTime}
        />
      </Wrapper>
    );
  }
}

export default WidgetController;
