import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import withFragment from '@hocs/with-fragment';

const getCurrentPercip = gql`
  fragment CurrentPercip on Weather {
    currently {
      precipProbability
    }
  }
`;

const CurrentPercip = ({ weather }) =>
  `${parseInt(weather.currently.precipProbability * 100, 10)}`;

CurrentPercip.propTypes = {
  weather: PropTypes.shape({
    currently: PropTypes.shape({
      precipProbability: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

CurrentPercip.fragments = {
  weather: getCurrentPercip,
};

export default withFragment(CurrentPercip);
