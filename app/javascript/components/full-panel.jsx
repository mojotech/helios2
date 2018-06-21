import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from './panel-wrapper';

export const FullPanel = ({ currentWidget }) => (
  <Wrapper>{currentWidget}</Wrapper>
);
FullPanel.propTypes = { currentWidget: PropTypes.node.isRequired };

export default FullPanel;
