import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { mathMod } from 'ramda';
import { Query } from 'react-apollo';
import {
  WidgetDisplay,
  LoadingDisplay,
  DisconnectedDisplay,
} from '@components/widget-display';

const getWidgets = gql`
  query getWidgets($id: Int!, $cityName: String!) {
    location(cityName: $cityName) {
      widgets {
        enabled {
          id
          name
          sidebarText
        }
        byIdOrFirst(id: $id) {
          id
          name
          durationSeconds
          sidebarText
          showWeather
        }
      }
    }
  }
`;

export class WidgetController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWidgetId: 0,
      transitionTime: null,
    };
  }

  componentDidMount() {
    const prefetchDelay = 1500;

    this.lastPrefetchTime = 0;
    this.timerId = setInterval(() => {
      const { transitionTime, pausedTime } = this.state;

      if (!transitionTime || pausedTime) {
        return;
      }

      const { client } = this.props;
      const prefetchTime = transitionTime - prefetchDelay;
      const now = Date.now();

      if (transitionTime < now) {
        this.nextWidget();
      } else if (
        prefetchTime < now &&
        this.lastPrefetchTime < now - prefetchDelay
      ) {
        const { nextWidgetId } = this.state;
        const { cityName } = this.props;
        this.lastPrefetchTime = now;
        client.query({
          query: getWidgets,
          variables: {
            id: nextWidgetId,
            cityName,
          },
        });
      }
    }, 500);
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  keyToWidgetAction = ({ keyCode }) => {
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
      this.nextWidget();
    }
    if (keyCode === upKey) {
      this.prevWidget();
    }
  };

  nextWidget = () => {
    this.setState(({ nextWidgetId }) =>
      nextWidgetId
        ? {
            currentWidgetId: nextWidgetId,
            nextWidgetId: null,
            prevWidgetId: null,
            transitionTime: null,
          }
        : {},
    );
  };

  prevWidget = () => {
    this.setState(({ prevWidgetId }) =>
      prevWidgetId
        ? {
            currentWidgetId: prevWidgetId,
            nextWidgetId: null,
            prevWidgetId: null,
            transitionTime: null,
          }
        : {},
    );
  };

  switchToPage = id => {
    this.setState({
      currentWidgetId: id,
      nextWidgetId: null,
      prevWidgetId: null,
      transitionTime: null,
    });
  };

  clickToWidgetAction = ({ target }) => {
    const targetId = target.id;
    if (targetId.startsWith('widget_')) {
      const widgetId = parseInt(targetId.replace('widget_', ''), 10);
      this.switchToPage(widgetId);
    }
  };

  render() {
    const { currentWidgetId, pausedTime } = this.state;

    const fetchPolicy = currentWidgetId === 0 ? 'network-only' : 'cache-first';

    const { cityName } = this.props;

    return (
      <Query
        query={getWidgets}
        variables={{ id: currentWidgetId, cityName }}
        fetchPolicy={fetchPolicy}
        onCompleted={response => {
          const { location } = response;
          const { widgets } = location;
          const { enabled: enabledWidgets, byIdOrFirst: current } = widgets;

          const index = enabledWidgets.findIndex(w => w.id === current.id);

          const prevWidgetId =
            enabledWidgets[mathMod(index - 1, enabledWidgets.length)].id;
          const nextWidgetId =
            enabledWidgets[mathMod(index + 1, enabledWidgets.length)].id;

          this.setState({
            currentWidgetId: current.id,
            nextWidgetId,
            prevWidgetId,
            transitionTime: Date.now() + current.durationSeconds * 1000,
          });
        }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <LoadingDisplay cityName={cityName} />;
          }

          if (error) {
            // eslint-disable-next-line
            console.error(error);
            return <DisconnectedDisplay cityName={cityName} />;
          }

          return (
            <WidgetDisplay
              keyToWidgetAction={this.keyToWidgetAction}
              clickToWidgetAction={this.clickToWidgetAction}
              isPaused={!!pausedTime}
              cityName={cityName}
              widgets={data.location.widgets}
            />
          );
        }}
      </Query>
    );
  }
}

WidgetController.propTypes = {
  client: PropTypes.shape({
    query: PropTypes.func.isRequired,
  }).isRequired,
  cityName: PropTypes.string.isRequired,
};

export default WidgetController;
