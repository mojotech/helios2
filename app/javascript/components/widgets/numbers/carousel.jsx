import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { over, lensPath, inc } from 'ramda';
import pluralize from 'pluralize';
import { getEventCounts, subscribeEventPublished } from './queries';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

class SubscribedEvents extends React.Component {
  componentDidMount() {
    this.props.subscribeToPublishedEvents();
  }

  render() {
    const { githubPull, githubCommit } = this.props;

    const commitText = pluralize('commit', githubCommit);
    const requestText = pluralize('request', githubPull);

    return `${githubCommit} ${commitText} and ${githubPull} pull ${requestText} this week.`;
  }
}
SubscribedEvents.propTypes = {
  githubPull: PropTypes.number.isRequired,
  githubCommit: PropTypes.number.isRequired,
  subscribeToPublishedEvents: PropTypes.func.isRequired,
};

const Numbers = () => (
  <Query query={getEventCounts}>
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
