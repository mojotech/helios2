import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PanelWrapper = styled.div`
  height: 100vh;
  flex: 8;
`;

export const FullPanel = ({ currentWidget }) => (
  <PanelWrapper>{currentWidget}</PanelWrapper>
);
FullPanel.propTypes = { currentWidget: PropTypes.node.isRequired };

export default FullPanel;
