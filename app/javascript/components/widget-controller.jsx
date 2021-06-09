import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { mathMod } from 'ramda';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import FullPanel from '@components/full-panel';
import SidePanel from '@components/side-panel';
import { DisconnectedMessage, LoadingMessage } from '@messages/message';
import Twitter from '@widgets/twitter';
import Numbers from '@widgets/numbers';
import Weather from '@widgets/weather';
import Traffic from '@widgets/traffic';

const getWidgets = gql`
  query getWidgets($id: Int!, $loc: String!) {
    location(cityName: $loc) {
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

const Wrapper = styled.div`
  outline: none;
`;

const widgetElements = {
  Weather,
  Twitter,
  Numbers,
  Traffic,
};

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
        this.lastPrefetchTime = now;
        client.query({
          query: getWidgets,
          variables: {
            id: nextWidgetId,
            loc: this.props.location.pathname.substring(1),
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

  handleClicks = ({ target }) => {
    const targetId = target.id;
    if (targetId.startsWith('widget_')) {
      const widgetId = parseInt(targetId.replace('widget_', ''), 10);
      this.switchToPage(widgetId);
    }
  };

  render() {
    const { currentWidgetId, pausedTime } = this.state;

    const fetchPolicy = currentWidgetId === 0 ? 'network-only' : 'cache-first';

    const cityName = this.props.location.pathname.substring(1);

    return (
      <Query
        query={getWidgets}
        variables={{ id: currentWidgetId, loc: cityName }}
        fetchPolicy={fetchPolicy}
        onCompleted={response => {
          const { location } = response;
          const { widgets } = location[0];
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
          if (error) {
            // eslint-disable-next-line
            console.error(error);
            return (
              <Wrapper>
                <FullPanel>
                  <DisconnectedMessage />
                </FullPanel>
                <SidePanel
                  widgets={[]}
                  selectedWidgetId={0}
                  showWeather={false}
                  totalTime={0}
                  isPaused={false}
                  props={this.props}
                />
              </Wrapper>
            );
          }

          if (loading) {
            return (
              <Wrapper>
                <FullPanel>
                  <LoadingMessage />
                </FullPanel>
                <SidePanel
                  widgets={[]}
                  selectedWidgetId={0}
                  showWeather={false}
                  totalTime={0}
                  isPaused={false}
                  props={this.props}
                />
              </Wrapper>
            );
          }

          const { location } = data;
          const { widgets } = location[0];
          const { enabled: enabledWidgets, byIdOrFirst: current } = widgets;

          const WidgetElement = widgetElements[current.name].Panel;

          return (
            <Wrapper
              onKeyDown={this.switchPages}
              onClick={this.handleClicks}
              // eslint-disable-next-line
              tabIndex="0"
            >
              <FullPanel>
                <WidgetElement {...this.props} />
              </FullPanel>
              <SidePanel
                widgets={enabledWidgets}
                selectedWidgetId={current.id}
                showWeather={current.showWeather}
                totalTime={current.durationSeconds * 1000}
                isPaused={!!pausedTime}
                props={this.props}
              />
            </Wrapper>
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
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default WidgetController;
