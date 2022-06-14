/* eslint-disable graphql/template-strings */
import { execute, from } from 'apollo-link';
import gql from 'graphql-tag';
import { createHttpLink } from 'apollo-link-http';
import waitFor from 'wait-for-observables';
import { errorLink } from './app';

const { log } = console;

// Save original console.log function
beforeEach(() => {
  // eslint-disable-next-line no-console
  console.log = jest.fn();
});

// Restore original console.log after all tests
afterAll(() => {
  // eslint-disable-next-line no-console
  console.log = log;
});

const MockQuery = gql`
  query {
    foo
  }
`;

describe('sends an invalid query to GQL and sees if the Apollo errorLink is able to handle it', () => {
  test('console.log should have a message from errorLink after the resolver blows up', async () => {
    expect.assertions(1);
    const mockLink = createHttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include',
    });

    await waitFor(execute(from([errorLink, mockLink]), { query: MockQuery }));
    const errors = [
      '[GraphQL Error]: Message: Cannot query field "foo" on type "RootQueryType"., Location: [object Object], Path: undefined, Operation: [object Object], Response: [object Object]',
      '[Network Error]: FetchError: request to http://localhost:4000/graphql failed, reason: connect ECONNREFUSED 127.0.0.1:4000',
    ];
    expect(errors).toContain(
      // eslint-disable-next-line no-console
      console.log.mock.calls[0][0],
    );
  });
});
