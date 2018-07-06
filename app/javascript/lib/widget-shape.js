import PropTypes from 'prop-types';

export const widgetShape = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      panel: PropTypes.node.isRequired,
      text: PropTypes.string,
      children: PropTypes.node,
    }),
  ).isRequired,
  selectedWidget: PropTypes.number.isRequired,
};

export default widgetShape;
