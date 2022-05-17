import { Socket as PhoenixSocket } from 'phoenix';
import { setContext } from 'apollo-link-context';
import { hasSubscription } from '@jumpn/utils-graphql';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import Cookies from 'js-cookie';
import * as AbsintheSocket from '@absinthe/socket';
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link';

const webSocketURL = new URL(process.env.BACKEND_URL);

if (webSocketURL.protocol === 'https:') {
  webSocketURL.protocol = 'wss:';
} else {
  webSocketURL.protocol = 'ws:';
}

const phoenixSocket = new PhoenixSocket(`${webSocketURL}/socket`);

const absintheSocket = AbsintheSocket.create(phoenixSocket);

const webSocketLinkAbsinthe = createAbsintheSocketLink(absintheSocket);

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

const httpLink = new HttpLink({
  uri: `${process.env.BACKEND_URL}/graphql`,
  credentials: 'include',
});

const authedHttpLink = authLink.concat(httpLink);

const absintheLink = split(
  operation => hasSubscription(operation.query),
  webSocketLinkAbsinthe,
  authedHttpLink,
);

export default absintheLink;
