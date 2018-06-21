import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import WidgetController from './widget-controller';

const client = new ApolloClient({});

const App = () => (
  <ApolloProvider client={client}>
    <WidgetController />
  </ApolloProvider>
);
export default App;
