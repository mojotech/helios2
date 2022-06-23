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
import githubPullImage from '@assets/images/displayPR.png';
import githubCommitImage from '@assets/images/displayCommit.png';
import slackMessageImage from '@assets/images/displaySlack.png';

const Overlay = styled.div`
  z-index: 1;
  position: relative;
`;

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
  color: ${(props) => props.color};
  font-family: ${fonts.regular};
`;

const NumberWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  margin-left: 75px;
  width: 50vw;
`;

const IconTextWrapper = styled.div`
  display: flex;
  justify-content: left;
`;

const BlockIcon = styled.img`
  margin-right: ${spacing.m};
  margin-top: 8px;
`;

function CountSummary({ count, image, width, height, color, text }) {
  return (
    <div>
      <Count>{count}</Count>
      <IconTextWrapper>
        <BlockIcon src={image} width={width} height={height} alt="" />
        <CountLabel color={color}>{text}</CountLabel>
      </IconTextWrapper>
    </div>
  );
}

CountSummary.propTypes = {
  count: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

CountSummary.defaultProps = {
  width: '24px',
  height: '24px',
};

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
    const requestText = pluralize('Request', githubPull);
    const messageText = pluralize('Message', slackMessage);
    return (
      <Overlay>
        <NumbersTitle>This week at MojoTech</NumbersTitle>
        <NumberWrapper>
          <CountSummary
            count={githubCommitCount}
            image={githubCommitImage}
            color={colors.pink}
            text={commitText}
          />
          <CountSummary
            count={githubPullCount}
            image={githubPullImage}
            color={colors.yellow}
            text={`Pull ${requestText}`}
          />
          <CountSummary
            count={slackMessageCount}
            image={slackMessageImage}
            color={colors.teal}
            text={`Slack ${messageText}`}
          />
        </NumberWrapper>
      </Overlay>
    );
  }
}
SubscribedEvents.propTypes = {
  githubPull: PropTypes.number.isRequired,
  githubCommit: PropTypes.number.isRequired,
  slackMessage: PropTypes.number.isRequired,
  subscribeToPublishedEvents: PropTypes.func.isRequired,
};

function Numbers({ startTimer }) {
  return (
    <Query
      query={getEventCounts}
      variables={{ createdAfter: getStartOfWeek() }}
      onCompleted={startTimer}
      onError={startTimer}
    >
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) {
          return <LoadingMessage />;
        }

        if (error) {
          // eslint-disable-next-line
        console.error(error);
          return <DisconnectedMessage />;
        }

        const { count } = data.events;

        return (
          <>
            <Count>
              <SubscribedEvents
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...count}
                subscribeToPublishedEvents={() =>
                  subscribeToMore({
                    document: subscribeEventPublished,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) {
                        return prev;
                      }
                      const { source } = subscriptionData.data.eventPublished;
                      return over(
                        lensPath(['events', 'count', source]),
                        inc,
                        prev,
                      );
                    },
                  })
                }
              />
            </Count>
            <FallingBlocks />
          </>
        );
      }}
    </Query>
  );
}

Numbers.propTypes = {
  startTimer: PropTypes.func.isRequired,
};

export default Numbers;
