import ActionCable from 'actioncable';
import { getMainDefinition } from 'apollo-utilities';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';

const cable = ActionCable.createConsumer(`${process.env.BACKEND_URL}/cable`);

const webSocketLinkRails = new ActionCableLink({ cable });

const httpLink = new HttpLink({
  uri: `${process.env.BACKEND_URL}/graphql`,
  credentials: 'include',
});

const railsLink = ApolloLink.split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  webSocketLinkRails,
  httpLink,
);

export default railsLink;
