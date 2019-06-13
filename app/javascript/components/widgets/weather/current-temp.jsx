import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import withFragment from '@hocs/with-fragment';

const getCurrentTemp = gql`
  fragment CurrentTemp on Weather {
    currently {
      temperature
    }
  }
`;

const CurrentTemp = ({ weather }) =>
  `${parseInt(weather.currently.temperature, 10)}°`;

CurrentTemp.propTypes = {
  weather: PropTypes.shape({
    currently: PropTypes.shape({
      temperature: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

CurrentTemp.fragments = {
  weather: getCurrentTemp,
};

export default withFragment(CurrentTemp);
