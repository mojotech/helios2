import 'regenerator-runtime/runtime';
import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import * as AbsintheSocket from '@absinthe/socket';
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link';
import { Socket as PhoenixSocket } from 'phoenix';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { hasSubscription } from '@jumpn/utils-graphql';
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
import Cookies from 'js-cookie';
import GlobalStyle from '../styles';

const cable = ActionCable.createConsumer(
  `${process.env.RAILS_BACKEND_URI}/cable`,
);

const phoenixSocket = new PhoenixSocket(`${process.env.WEBSOCKET_URI}/socket`);

const absintheSocket = AbsintheSocket.create(phoenixSocket);

const webSocketLinkAbsinthe = createAbsintheSocketLink(absintheSocket);

const webSocketLinkRails = new ActionCableLink({ cable });

const httpLink = new HttpLink({
  uri: `${
    process.env.BACKEND_LANGUAGE === 'ruby'
      ? process.env.RAILS_BACKEND_URI
      : process.env.PHOENIX_BACKEND_URI
  }/graphql`,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from the cookie if it exists.
  const token = Cookies.get('token');

  // Add the new Authorization header.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const authedHttpLink = authLink.concat(httpLink);

const railsLink = ApolloLink.split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  webSocketLinkRails,
  httpLink,
);

const absintheLink = split(
  operation => hasSubscription(operation.query),
  webSocketLinkAbsinthe,
  authedHttpLink,
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
  link: process.env.BACKEND_LANGUAGE === 'ruby' ? railsLink : absintheLink,
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
      <Route
        path="/:city_name"
        render={routeProps => (
          <WidgetController
            client={client}
            cityName={routeProps.match.params.city_name}
          />
        )}
      />
      <Route
        exact
        path="/"
        render={() => <Redirect to={`/${process.env.PRIMARY_CITY_NAME}`} />}
      />
    </Router>
  </ApolloProvider>
);
export default App;
