import PropTypes from 'prop-types';
import {
  branch,
  compose,
  renderComponent,
  setPropTypes,
} from 'react-recompose';

export const renderWhileLoading = loadingComponent =>
  compose(
    setPropTypes({
      loading: PropTypes.bool.isRequired,
    }),
    branch(({ loading }) => !!loading, renderComponent(loadingComponent)),
  );

export default renderWhileLoading;
