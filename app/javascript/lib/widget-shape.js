import PropTypes from 'prop-types';

export const widgetShape = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      panel: PropTypes.elementType.isRequired,
      text: PropTypes.string,
    }),
  ).isRequired,
  selectedWidget: PropTypes.number.isRequired,
};

export default widgetShape;
