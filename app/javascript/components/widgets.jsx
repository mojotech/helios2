import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacing } from '@lib/theme';
import { Tab } from '@components/tabs';

const WidgetContainer = styled.div`
  margin-bottom: ${spacing.l};
`;

export const Widgets = ({ widgets, selectedWidgetId, totalTime, isPaused }) =>
  widgets.map((widget) => (
    <WidgetContainer key={widget.id}>
      <Tab
        widgetId={widget.id}
        selected={widget.id === selectedWidgetId}
        totalTime={totalTime}
        text={widget.sidebarText}
        isPaused={isPaused}
      />
    </WidgetContainer>
  ));

Widgets.propTypes = {
  isPaused: PropTypes.bool.isRequired,
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.integer,
      sidebarText: PropTypes.string,
    }),
  ).isRequired,
  selectedWidgetId: PropTypes.number.isRequired,
  totalTime: PropTypes.number.isRequired,
};

export default Widgets;
