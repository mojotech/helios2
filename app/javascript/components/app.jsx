import 'regenerator-runtime/runtime';
import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import WidgetController from '@components/widget-controller';
import versionCompare from '@components/version-compare';
import helioSchema from '@javascript/schema.json';
import GlobalStyle from '../styles';
import absintheLink from '../lib/phoenix-graphql-backend';
import railsLink from '../lib/rails-graphql-backend';

let link = null;

if (process.env.BACKEND_LANGUAGE === 'elixir') {
  link = absintheLink;
} else {
  link = railsLink;
}

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
