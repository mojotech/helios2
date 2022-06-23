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
import { fetch } from 'isomorphic-fetch';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import GlobalStyle from '../styles';

let link = null;

// eslint-disable-next-line new-cap
export const errorLink = new onError(
  ({ operation, response, graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        // eslint-disable-next-line
        console.log(
          `[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}, Operation: ${operation}, Response: ${response}`,
        ),
      );
    }

    if (networkError) {
      console.log(`[Network Error]: ${networkError}`); //eslint-disable-line
    }
  },
);

if (process.env.BACKEND_LANGUAGE === 'elixir') {
  // eslint-disable-next-line global-require
  link = require('../lib/phoenix-graphql-backend').default;
} else {
  // eslint-disable-next-line global-require
  link = require('../lib/rails-graphql-backend').default;
}

const introspectionQueryResultData = {
  ...helioSchema.data,
  __schema: {
    // eslint-disable-next-line
    ...helioSchema.data.__schema,
    // eslint-disable-next-line
    types: helioSchema.data.__schema.types.filter(
      (type) => type.possibleTypes !== null,
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
  link: from([errorLink, link]),
  cache,
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'none',
    },
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'none',
    },
  },
  fetch,
});

versionCompare(client);

function App() {
  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <Router>
        <Route
          path="/:city_name"
          render={(routeProps) => (
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
}
export default App;
