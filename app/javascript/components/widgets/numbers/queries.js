import gql from 'graphql-tag';

export const subscribeEventPublished = gql`
  subscription onEventPublished {
    eventPublished {
      source
    }
  }
`;

export const getEventCounts = gql`
  query getEvents($createdAfter: String!) {
    events(createdAfter: $createdAfter) {
      count {
        githubPull
        githubCommit
        slackMessage
      }
    }
  }
`;
