import React from 'react';
import FullPanel from './full-panel';
import SidePanel from './side-panel';
import CurrentWeather from './current-weather';
import Twitter from './twitter';
import Numbers from './numbers';
import Live from './live-stream';
import GuestsWidget from './guests-widget';
import CurrentTemp from './current-temp';
import MinutelyWeather from './minutely-weather';

const weatherChildren = (
  <div>
    <CurrentTemp /> - <MinutelyWeather />
  </div>
);

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
    panel: <Numbers />,
    text: 'MojoTech by the Numbers',
    children: '112 commits this week.',
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
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        index: (this.state.index + 1) % widgets.length,
      });
    }, 10000);
  }

  render() {
    const { index } = this.state;
    const currentWidget = widgets[index];
    return (
      <div>
        <FullPanel currentWidget={currentWidget.panel} />
        <SidePanel widgets={widgets} selectedWidget={index} />
      </div>
    );
  }
}

export default WidgetController;
