import PropTypes from 'prop-types';
import {
  branch,
  compose,
  renderComponent,
  setPropTypes,
} from 'react-recompose';

export const renderWhileError = errorComponent =>
  compose(
    setPropTypes({
      error: PropTypes.bool.isRequired,
    }),
    branch(({ error }) => !!error, renderComponent(errorComponent)),
  );

export default renderWhileError;
