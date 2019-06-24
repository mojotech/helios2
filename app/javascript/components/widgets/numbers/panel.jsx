import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import numeral from 'numeral';
import { over, lensPath, inc } from 'ramda';
import styled from 'styled-components';
import pluralize from 'pluralize';
import { getStartOfWeek } from '@lib/datetime';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';
import { colors, weights, fontSizes, fonts, spacing } from '@lib/theme';
import FallingBlocks from '@numbers/falling-blocks';
import { getEventCounts, subscribeEventPublished } from '@numbers/queries';

const NumbersTitle = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.medium};
  font-family: ${fonts.regular};
  margin-bottom: ${spacing.xxl};
  margin-left: 75px;
`;

const Count = styled.div`
  color: ${colors.white};
  weight: ${weights.regular};
  font-size: 96px;
  font-family: ${fonts.extended};
`;

const CountLabel = styled.div`
  font-size: ${fontSizes.large};
  color: ${props => props.color};
  font-family: ${fonts.regular};
`;

const NumberWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  margin-left: 75px;
  width: 50vw;
`;

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

    const commitText = pluralize('Commit', githubCommit);
    const requestText = pluralize('request', githubPull);
    const messageText = pluralize('message', slackMessage);

    return (
      <div>
        <NumbersTitle>This week at MojoTech</NumbersTitle>
        <NumberWrapper>
          <div>
            <Count>{githubCommitCount}</Count>
            <CountLabel color={colors.pink}>{commitText}</CountLabel>
          </div>
          <div>
            <Count>{githubPullCount}</Count>
            <CountLabel color={colors.yellow}>Pull {requestText}</CountLabel>
          </div>
          <div>
            <Count>{slackMessageCount}</Count>
            <CountLabel color={colors.teal}>Slack {messageText}</CountLabel>
          </div>
        </NumberWrapper>
      </div>
    );
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
        return <DisconnectedMessage />;
      }

      const { count } = data.events;
      return (
        <Count>
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
          <FallingBlocks />
        </Count>
      );
    }}
  </Query>
);

export default Numbers;
