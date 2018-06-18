import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { spacing } from '../lib/theme';
import { Widget } from './carousel-elements';
import CurrentTemp from './current-temp';
import MinutelyWeather from './minutely-weather';

const WidgetContainer = styled.div`
  margin-bottom: ${spacing.l};
`;

export const Carousel = ({ currentWidget }) => {
  const weatherChildren = (
    <div>
      <CurrentTemp /> - <MinutelyWeather />
    </div>
  );
  const widgets = [
    {
      name: 'weather',
      text: 'Weather',
      children: weatherChildren,
      key: 1,
    },
    {
      name: 'twitter',
      text: '@MojoTech',
      children: 'Last tweeted 2 days ago.',
      key: 2,
    },
    {
      name: 'numbers',
      text: 'MojoTech by the Numbers',
      children: '112 commits this week.',
      key: 3,
    },
    {
      name: 'boulder',
      text: 'MojoTech Boulder',
      children: 'Live.',
      key: 4,
    },
  ];
  return widgets.map(widget => (
    <WidgetContainer key={widget.key}>
      <Widget selected={currentWidget === widget.name} text={widget.text}>
        {widget.children}
      </Widget>
    </WidgetContainer>
  ));
};

Carousel.propTypes = { currentWidget: PropTypes.string.isRequired };

export default Carousel;
