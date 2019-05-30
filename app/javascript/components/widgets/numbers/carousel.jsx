import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import numeral from 'numeral';
import { over, lensPath, inc } from 'ramda';
import pluralize from 'pluralize';
import { getStartOfWeek } from '../../../lib/datetime';
import { getEventCounts, subscribeEventPublished } from './queries';
import { LoadingMessage, ErrorMessage } from '../messages/default-messages';

const STAT_FORMAT = '0,0';

class SubscribedEvents extends React.Component {
  componentDidMount() {
    this.props.subscribeToPublishedEvents();
  }

  render() {
    const { githubPull, githubCommit, slackMessage } = this.props;
    const githubPullCount = numeral(githubPull).format(STAT_FORMAT);
    const githubCommitCount = numeral(githubCommit).format(STAT_FORMAT);
    const slackMessageCount = numeral(slackMessage).format(STAT_FORMAT);

    const commitText = pluralize('commit', githubCommit);
    const requestText = pluralize('pull request', githubPull);
    const messageText = pluralize('Slack message', slackMessage);

    return `${githubCommitCount} ${commitText}, ${githubPullCount} ${requestText}, and ${slackMessageCount} ${messageText} this week.`;
  }
}
SubscribedEvents.propTypes = {
  githubPull: PropTypes.number.isRequired,
  githubCommit: PropTypes.number.isRequired,
  slackMessage: PropTypes.number.isRequired,
  subscribeToPublishedEvents: PropTypes.func.isRequired,
};

const Numbers = () => (
  <Query query={getEventCounts} variables={{ after: getStartOfWeek() }}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage />;
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
