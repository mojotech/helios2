import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from '@components/panel-wrapper';

export const FullPanel = ({ children }) => <Wrapper>{children}</Wrapper>;
FullPanel.propTypes = { children: PropTypes.node.isRequired };

export default FullPanel;
