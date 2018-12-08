import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import FallingBlocks from './widgets/numbers/fallingblocks';
import { withContext as withUnityContext } from './unity-context';
import { getEventCounts } from './widgets/numbers/queries';

const unity = ({ isVisible }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: isVisible ? 'block' : 'none',
    }}
  >
    <Query query={getEventCounts}>
      {({ loading, error, data }) => {
        if (loading || error) {
          return null;
        }
        const props = {
          commit: data.events.count.githubCommit,
          slack: data.events.count.slackMessage,
          pr: data.events.count.githubPull,
        };
        return <FallingBlocks {...props} />;
      }}
    </Query>
  </div>
);

unity.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default withUnityContext(unity);
