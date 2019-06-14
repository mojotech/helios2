import React from 'react';
import styled from 'styled-components';
import { mathMod } from 'ramda';
import FullPanel from '@components/full-panel';
import SidePanel from '@components/side-panel';
import Numbers from '@widgets/numbers';
import Weather from '@widgets/weather';
import Guests from '@widgets/guests';
import lockedIcon from '@images/locked.svg';
import unlockedIcon from '@images/unlocked.svg';
import { colors } from '@lib/theme';

const IconWrapper = styled.div`
  position: absolute;
  right: 704px;
  top: 95px;
`;

const Icon = styled.button`
  height: 21px;
  width: 16px;
  border-style: none;
  background-color: ${colors.black};
`;

const SWITCH_INTERVAL = 20000;
const iconId = 'lock-icon';

const widgets = [
  {
    panel: <Weather.Panel />,
    text: 'Weather',
  },
  {
    panel: <Numbers.Panel />,
    text: 'MojoTech by the Numbers',
  },
  {
    panel: <Guests.Panel />,
    text: "Today's guests",
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

  switchLock = () => {
    this.setState(prevState => ({ isLocked: !prevState.isLocked }));
  };

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
    const { index, isLocked } = this.state;
    const currentWidget = widgets[index];
    const icon = isLocked ? lockedIcon : unlockedIcon;

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
        <IconWrapper>
          <Icon style={{ backgroundImage: `url(${icon})` }} id={iconId} />
        </IconWrapper>
      </div>
    );
  }
}

export default WidgetController;
