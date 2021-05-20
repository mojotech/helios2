import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import withFragment from '@hocs/with-fragment';

const getCurrentTemp = gql`
  fragment CurrentTemp on Weather {
    current {
      temp
    }
  }
`;

const CurrentTemp = ({ weather }) => `${parseInt(weather.current.temp, 10)}°`;

CurrentTemp.propTypes = {
  weather: PropTypes.shape({
    current: PropTypes.shape({
      temp: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

CurrentTemp.fragments = {
  weather: getCurrentTemp,
};

export default withFragment(CurrentTemp);
