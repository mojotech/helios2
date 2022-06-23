import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from '@components/panel-wrapper';

export function FullPanel({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
FullPanel.propTypes = { children: PropTypes.node.isRequired };

export default FullPanel;
