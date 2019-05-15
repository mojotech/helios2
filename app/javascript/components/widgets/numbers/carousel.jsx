import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { over, lensPath, inc } from 'ramda';
import pluralize from 'pluralize';
import { getMostRecentDay } from '../../../lib/datetime';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const subscribeEventPublished = gql`
  subscription onEventPublished {
    eventPublished {
      source
    }
  }
`;

const getEventCounts = gql`
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

class SubscribedEvents extends React.Component {
  componentDidMount() {
    this.props.subscribeToPublishedEvents();
  }

  render() {
    const { githubPull, githubCommit, slackMessage } = this.props;

    const commitText = pluralize('commit', githubCommit);
    const requestText = pluralize('request', githubPull);
    const messageText = pluralize('message', slackMessage);

    return `${githubCommit} ${commitText}, ${githubPull} pull ${requestText}, and ${slackMessage} Slack ${messageText} this week.`;
  }
}
SubscribedEvents.propTypes = {
  githubPull: PropTypes.number.isRequired,
  githubCommit: PropTypes.number.isRequired,
  slackMessage: PropTypes.number.isRequired,
  subscribeToPublishedEvents: PropTypes.func.isRequired,
};

const Numbers = () => (
  <Query
    query={getEventCounts}
    variables={{ after: getMostRecentDay('Monday') }}
  >
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage message={error.message} />;
      }

      const { count } = data.events;
      return (
        <SubscribedEvents
          {...count}
          subscribeToPublishedEvents={() =>
            subscribeToMore({
              document: subscribeEventPublished,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                const { source } = subscriptionData.data.eventPublished;

                return over(lensPath(['events', 'count', source]), inc, prev);
              },
            })
          }
        />
      );
    }}
  </Query>
);

export default Numbers;
