import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { isEmpty, pathOr } from 'ramda';
import {
  WidgetDisplay,
  LoadingDisplay,
  DisconnectedDisplay,
  WidgetDisabledDisplay,
  getWidgetDisplay,
} from '@components/widget-display';
import WidgetTransitionControls from '@components/widget-transition-controls';

const getWidgets = gql`
  ${getWidgetDisplay}
  query getWidgets($id: Int!, $cityName: String!) {
    location(cityName: $cityName) {
      ...WidgetDisplay
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

export function WidgetController({ client, cityName }) {
  const [newWidgetId, setNewWidgetId] = useState(0);

  const fetchPolicy = newWidgetId === 0 ? 'network-only' : 'cache-first';

  const queryCallback = (nextWidgetId) => {
    client.query({
      query: getWidgets,
      variables: {
        id: nextWidgetId,
        cityName,
      },
    });
  };

  return (
    <Query
      query={getWidgets}
      variables={{ id: newWidgetId, cityName }}
      fetchPolicy={fetchPolicy}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) {
          return <LoadingDisplay cityName={cityName} loading={loading} />;
        }

        if (error) {
          setTimeout(async () => {
            // eslint-disable-next-line react/prop-types
            await client.resetStore();
            await refetch();
          }, 5000);

          // eslint-disable-next-line
          console.error(error);
          return <DisconnectedDisplay cityName={cityName} error={error} />;
        }

        const widget = pathOr([], ['location', 'widgets', 'enabled'], data);
        if (isEmpty(widget)) {
          return <WidgetDisabledDisplay />;
        }

        return (
          <WidgetTransitionControls
            WrappedComponent={WidgetDisplay}
            requestPrefetch={queryCallback}
            requestWidget={setNewWidgetId}
            cityName={cityName}
            location={data.location}
            loading={loading}
            error={error}
          />
        );
      }}
    </Query>
  );
}

WidgetController.propTypes = {
  client: PropTypes.shape({
    query: PropTypes.func.isRequired,
  }).isRequired,
  cityName: PropTypes.string.isRequired,
};

export default WidgetController;
