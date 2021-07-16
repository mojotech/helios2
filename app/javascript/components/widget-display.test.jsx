import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  WidgetDisplay,
  LoadingDisplay,
  DisconnectedDisplay,
} from '@components/widget-display';

const location = {
  widgets: {
    enabled: [
      {
        id: 2,
        name: 'Weather',
        sidebarText: 'Weather',
      },
      {
        id: 3,
        name: 'Twitter',
        sidebarText: '@MojoTech',
      },
      {
        id: 4,
        name: 'Numbers',
        sidebarText: 'MojoTech by the Numbers',
      },
    ],
    byIdOrFirst: {
      durationSeconds: 20,
      id: 2,
      name: 'Weather',
      showWeather: false,
      sidebarText: 'Weather',
    },
  },
};

const renderer = new ShallowRenderer();

const renderWidgetDisplay = () =>
  renderer.render(
    <WidgetDisplay
      keyToWidgetAction={() => {}}
      clickToWidgetAction={() => {}}
      isPaused={false}
      cityName="Providence"
      location={location}
      loading
      error={false}
      startTimer={() => {}}
    />,
  );

const renderLoadingDisplay = () =>
  renderer.render(<LoadingDisplay cityName="Providence" loading />);

const renderDisconnectedDisplay = () =>
  renderer.render(<DisconnectedDisplay cityName="Providence" error />);

describe('WidgetDisplay component', () => {
  it('renders correctly', () => {
    expect(renderWidgetDisplay()).toMatchSnapshot();
  });
});

describe('LoadingDisplay component', () => {
  it('renders correctly', () => {
    expect(renderLoadingDisplay()).toMatchSnapshot();
  });
});

describe('DisconnectedDisplay component', () => {
  it('renders correctly', () => {
    expect(renderDisconnectedDisplay()).toMatchSnapshot();
  });
});
