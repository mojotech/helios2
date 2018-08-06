import React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ActionCable from 'actioncable';
import { getMainDefinition } from 'apollo-utilities';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';
import WidgetController from './widget-controller';
import { injectGlobal } from 'styled-components';
import { colors } from '../lib/theme';

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

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({ addTypename: false }),
});

const App = () => (
  <ApolloProvider client={client}>
    <WidgetController />
  </ApolloProvider>
);

injectGlobal`
html {
  background: ${colors.black};
  color: white;
}
`;

export default App;
