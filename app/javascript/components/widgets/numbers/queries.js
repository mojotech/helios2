import gql from 'graphql-tag';

export const subscribeEventPublished = gql`
  subscription onEventPublished {
    eventPublished {
      source
    }
  }
`;

export const getEventCounts = gql`
  {
    events {
      count {
        githubPull
        githubCommit
        slackMessage
      }
    }
  }
`;
