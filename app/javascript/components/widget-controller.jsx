import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  WidgetDisplay,
  LoadingDisplay,
  DisconnectedDisplay,
} from '@components/widget-display';
import WidgetTransitionControls from '@components/widget-transition-controls';

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

export const WidgetController = ({ client, cityName }) => {
  const [newWidgetId, setNewWidgetId] = useState(0);

  const fetchPolicy = newWidgetId === 0 ? 'network-only' : 'cache-first';

  const queryCallback = nextWidgetId => {
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
      onCompleted={response => {
        const {
          location: {
            widgets: { byIdOrFirst: current },
          },
        } = response;
        setNewWidgetId(current.id);
      }}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingDisplay cityName={cityName} loading={loading} />;
        }

        if (error) {
          // eslint-disable-next-line
          console.error(error);
          return <DisconnectedDisplay cityName={cityName} loading={loading} />;
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
            widgets={data.location.widgets}
          />
        );
      }}
    </Query>
  );
};

WidgetController.propTypes = {
  client: PropTypes.shape({
    query: PropTypes.func.isRequired,
  }).isRequired,
  cityName: PropTypes.string.isRequired,
};

export default WidgetController;
