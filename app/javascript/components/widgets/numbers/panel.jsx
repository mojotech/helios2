import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import numeral from 'numeral';
import styled from 'styled-components';
import pluralize from 'pluralize';
import { getStartOfWeek } from '@lib/datetime';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';
import { colors, weights, fontSizes } from '@lib/theme';
import FallingBlocks from '@numbers/falling-blocks';
import { getEventCounts } from '@numbers/queries';

const NumbersTitle = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.medium};
`;

const Count = styled.div`
  color: ${colors.white};
  weight: ${weights.bold};
  font-size: ${fontSizes.xlarge};
`;

const CountLabel = styled.div`
  font-size: ${fontSizes.medium};
  color: ${props => props.color};
`;

const NumberWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  width: 33vw;
`;

const STAT_FORMAT = '0,0';

class SubscribedEvents extends React.Component {
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
};

const Numbers = () => (
  <Query query={getEventCounts} variables={{ after: getStartOfWeek() }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <DisconnectedMessage />;
      }

      const { count } = data.events;
      return (
        <Count>
          <SubscribedEvents {...count} />
          <FallingBlocks />
        </Count>
      );
    }}
  </Query>
);

export default Numbers;
