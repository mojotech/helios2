import 'regenerator-runtime/runtime';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import ActionCable from 'actioncable';
import { getMainDefinition } from 'apollo-utilities';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';
import { persistCache } from 'apollo-cache-persist';
import WidgetController from '@components/widget-controller';
import versionCompare from '@components/version-compare';
import helioSchema from '@javascript/schema.json';
import GlobalStyle from '../styles';

const cable = ActionCable.createConsumer('/cable');

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'include',
});

const webSocketLink = new ActionCableLink({ cable });

const link = ApolloLink.split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  webSocketLink,
  httpLink,
);

const introspectionQueryResultData = {
  ...helioSchema.data,
  __schema: {
    // eslint-disable-next-line
    ...helioSchema.data.__schema,
    // eslint-disable-next-line
    types: helioSchema.data.__schema.types.filter(
      type => type.possibleTypes !== null,
    ),
  },
};

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const cache = new InMemoryCache({ addTypename: true, fragmentMatcher });

persistCache({
  cache,
  storage: window.localStorage,
});

const client = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

versionCompare(client);

const App = () => (
  <ApolloProvider client={client}>
    <GlobalStyle />
    <Router>
      <Switch>
        <Route
          path="/:city_name"
          component={routeProps => (
            <WidgetController
              client={client}
              cityName={routeProps.match.params.city_name}
            />
          )}
        />
      </Switch>
    </Router>
  </ApolloProvider>
);
export default App;
