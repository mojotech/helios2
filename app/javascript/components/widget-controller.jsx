import React from 'react';
import { mathMod } from 'ramda';
import FullPanel from '@components/full-panel';
import SidePanel from '@components/side-panel';
import Twitter from '@widgets/twitter';
import Numbers from '@widgets/numbers';
import Weather from '@widgets/weather';

const SWITCH_INTERVAL = 20000;

const widgets = [
  {
    panel: <Weather.Panel />,
    text: 'Weather',
    showWeather: false,
  },
  {
    panel: <Twitter.Panel />,
    text: '@MojoTech',
    children: 'Last tweeted 2 days ago.',
    showWeather: true,
  },
  {
    panel: <Numbers.Panel />,
    text: 'MojoTech by the Numbers',
    showWeather: true,
  },
];

export class WidgetController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
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
    if (targetId.startsWith('widget_')) {
      const widgetId = parseInt(targetId.replace('widget_', ''), 10);
      this.switchToPage(widgetId);
    }
  };

  moveDown = () => {
    this.setState(({ index }) => ({
      index: (index + 1) % widgets.length,
    }));
  };

  moveUp = () => {
    this.setState(({ index }) => ({
      index: mathMod(index - 1, widgets.length),
    }));
  };

  render() {
    const { index } = this.state;
    const currentWidget = widgets[index];

    return (
      // eslint-disable-next-line
      <div
        onKeyDown={this.switchPages}
        onClick={this.handleClicks}
        // eslint-disable-next-line
        tabIndex="0"
      >
        <FullPanel currentWidget={currentWidget.panel} />
        <SidePanel
          widgets={widgets}
          selectedWidget={index}
          totalTime={SWITCH_INTERVAL}
          tabDown={this.moveDown}
        />
      </div>
    );
  }
}

export default WidgetController;
