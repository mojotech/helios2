import React from 'react';
import Logo from './logo';
import FullPanel from './full-panel';
import SidePanel from './side-panel';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({});

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <React.Fragment>
          <FullPanel />
          <SidePanel />
        </React.Fragment>
      </ApolloProvider>
    );
  }
}
