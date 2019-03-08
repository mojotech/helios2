import React from 'react';
import PropTypes from 'prop-types';
import FallingBlocks from './widgets/numbers/fallingblocks';
import { withContext as withUnityContext } from './unity-context';

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
    <FallingBlocks />;
  </div>
);

unity.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default withUnityContext(unity);
