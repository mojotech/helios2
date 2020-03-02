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
  query getWidgets($id: Int!) {
    primaryLocation {
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
          variables: { id: nextWidgetId },
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
    this.setState(state => {
      const { nextWidgetId } = state;
      if (!nextWidgetId) {
        // eslint-disable-next-line
        console.error(
          `FATAL: nextWidgetId is undefined for nextWidget call. state: ${state}`,
        );
        return {
          currentWidgetId: null,
          nextWidgetId: null,
          prevWidgetId: null,
          transitionTime: null,
        };
      }
      return {
        currentWidgetId: nextWidgetId,
        nextWidgetId: null,
        prevWidgetId: null,
        transitionTime: null,
      };
    });
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
    this.setState(({ currentWidgetId }) =>
      currentWidgetId !== id
        ? {
            currentWidgetId: id,
            nextWidgetId: null,
            prevWidgetId: null,
            transitionTime: null,
          }
        : {},
    );
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

    return (
      <Query
        query={getWidgets}
        variables={{ id: currentWidgetId }}
        fetchPolicy={fetchPolicy}
        onCompleted={({ primaryLocation: { widgets } }) => {
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
                />
              </Wrapper>
            );
          }

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
                />
              </Wrapper>
            );
          }

          const {
            primaryLocation: { widgets },
          } = data;
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
                <WidgetElement />
              </FullPanel>
              <SidePanel
                widgets={enabledWidgets}
                selectedWidgetId={current.id}
                showWeather={current.showWeather}
                totalTime={current.durationSeconds * 1000}
                isPaused={!!pausedTime}
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
};

export default WidgetController;
