import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import pluralize from 'pluralize';
import { getMostRecentDay } from '../../../lib/datetime';
import { colors, weights, fontSizes } from '../../../lib/theme';
import FallingBlocks from './falling-blocks';

const LoadingMessage = () => <p>Loading...</p>;
const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

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

const SubscribedEvents = ({ githubPull, githubCommit, slackMessage }) => {
  const commitText = pluralize('Commit', githubCommit);
  const requestText = pluralize('request', githubPull);
  const messageText = pluralize('message', slackMessage);

  return (
    <div>
      <NumbersTitle>This week at MojoTech</NumbersTitle>
      <NumberWrapper>
        <div>
          <Count>{githubCommit}</Count>
          <CountLabel color={colors.pink}>{commitText}</CountLabel>
        </div>
        <div>
          <Count>{githubPull}</Count>
          <CountLabel color={colors.yellow}>Pull {requestText}</CountLabel>
        </div>
        <div>
          <Count>{slackMessage}</Count>
          <CountLabel color={colors.teal}>Slack {messageText}</CountLabel>
        </div>
      </NumberWrapper>
    </div>
  );
};
SubscribedEvents.propTypes = {
  githubPull: PropTypes.number.isRequired,
  githubCommit: PropTypes.number.isRequired,
  slackMessage: PropTypes.number.isRequired,
};

const Numbers = () => (
  <Query
    query={getEventCounts}
    variables={{ after: getMostRecentDay('Monday') }}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <ErrorMessage message={error.message} />;
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
