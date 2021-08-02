import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { mathMod } from 'ramda';

const prefetchDelay = 1500;

export const selectShouldRequestWidget = state =>
  state.msRemainingSinceLastStart < Date.now() - state.startTimestamp;

export const selectShouldRequestPrefetch = state =>
  !state.prefetchRequestedYet &&
  state.msRemainingSinceLastStart - (Date.now() - state.startTimestamp) <
    prefetchDelay;

export const selectIsPaused = state => state.startTimestamp === null;
export const isStarted = state =>
  state.startTimestamp !== null && state.msRemainingSinceLastStart !== null;

const resolveWidgetId = (enabledWidgets, currentWidgetId, { type }) => {
  const index = enabledWidgets.findIndex(w => w.id === currentWidgetId);
  switch (type) {
    case 'nextWidget':
      return enabledWidgets[mathMod(index + 1, enabledWidgets.length)].id;
    case 'prevWidget':
      return enabledWidgets[mathMod(index - 1, enabledWidgets.length)].id;
    default:
      return null;
  }
};

const reducer = (state, action) => {
  const { startTimestamp, msRemainingSinceLastStart } = state;
  const now = Date.now();

  switch (action.type) {
    case 'togglePause':
      return {
        ...state,
        msRemainingSinceLastStart: selectIsPaused(state)
          ? msRemainingSinceLastStart
          : msRemainingSinceLastStart - (now - startTimestamp),
        startTimestamp: selectIsPaused(state) ? now : null,
      };
    case 'startTimer':
      return {
        msRemainingSinceLastStart: action.msDurationRemaining,
        startTimestamp: now,
        prefetchRequestedYet: false,
      };
    case 'tryPrefetch':
      if (selectShouldRequestPrefetch(state)) {
        action.prefetch();
        return {
          ...state,
          prefetchRequestedYet: true,
        };
      }
      return state;
    default:
      return state;
  }
};

const WidgetTransitionControls = ({
  WrappedComponent,
  requestPrefetch,
  requestWidget,
  cityName,
  location,
  loading,
  error,
}) => {
  const { byIdOrFirst: current, enabled: enabledWidgets } = location.widgets;

  const widgetTransitionTime = current.durationSeconds * 1000;

  const [state, dispatch] = useReducer(reducer, {
    startTimestamp: null,
    msRemainingSinceLastStart: null,
    prefetchRequestedYet: false,
  });

  useEffect(() => {
    dispatch({
      type: 'startTimer',
      msDurationRemaining: widgetTransitionTime,
    });
  }, [current.id]);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (!isStarted(state)) {
        return;
      }
      if (selectIsPaused(state)) {
        return;
      }

      const nextWidgetId = resolveWidgetId(enabledWidgets, current.id, {
        type: 'nextWidget',
      });

      dispatch({
        type: 'tryPrefetch',
        prefetch: () => requestPrefetch(nextWidgetId),
      });

      if (selectShouldRequestWidget(state)) {
        requestWidget(nextWidgetId);
      }
    }, 250);

    return () => {
      clearInterval(timerId);
    };
  }, [state]);

  const keyToWidgetAction = ({ keyCode }) => {
    const upKey = 38;
    const downKey = 40;
    const SPACEBAR = 32;
    if (keyCode === SPACEBAR) {
      dispatch({ type: 'togglePause' });
    }
    if (keyCode === downKey) {
      requestWidget(
        resolveWidgetId(enabledWidgets, current.id, { type: 'nextWidget' }),
      );
    }
    if (keyCode === upKey) {
      requestWidget(
        resolveWidgetId(enabledWidgets, current.id, { type: 'prevWidget' }),
      );
    }
  };

  const clickToWidgetAction = ({ target }) => {
    const targetId = target.id;
    if (targetId.startsWith('widget_')) {
      const widgetId = parseInt(targetId.replace('widget_', ''), 10);
      requestWidget(widgetId);
    }
  };

  return (
    <WrappedComponent
      keyToWidgetAction={keyToWidgetAction}
      clickToWidgetAction={clickToWidgetAction}
      isPaused={selectIsPaused(state)}
      cityName={cityName}
      location={location}
      loading={loading}
      error={error}
    />
  );
};

WidgetTransitionControls.propTypes = {
  WrappedComponent: PropTypes.func.isRequired,
  requestPrefetch: PropTypes.func.isRequired,
  requestWidget: PropTypes.func.isRequired,
  cityName: PropTypes.string.isRequired,
  location: PropTypes.shape({
    widgets: PropTypes.shape({
      enabled: PropTypes.array.isRequired,
      byIdOrFirst: PropTypes.shape({
        durationSeconds: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        showWeather: PropTypes.bool.isRequired,
        sidebarText: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

WidgetTransitionControls.defaultProps = {
  loading: true,
  error: false,
};

export default WidgetTransitionControls;
