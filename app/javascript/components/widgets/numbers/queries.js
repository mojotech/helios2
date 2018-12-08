import gql from 'graphql-tag';

export const subscribeEventPublished = gql`
  subscription onEventPublished {
    eventPublished {
      source
    }
  }
`;

export const getEventCounts = gql`
  query getEvents($after: String!) {
    events(after: $after) {
      count {
        githubPull
        githubCommit
        slackMessage
      }
    }
  }
`;
