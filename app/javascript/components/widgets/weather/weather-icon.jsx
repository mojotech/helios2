import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import withFragment from '@hocs/with-fragment';

export const getCurrentIcon = gql`
  fragment CurrentIcon on Weather {
    current {
      weather {
        icon
      }
    }
  }
`;

const CurrentIcon = ({ weather }) => {
  return weather.current.weather.icon;
};

CurrentIcon.propTypes = {
  weather: PropTypes.shape({
    current: PropTypes.shape({
      weather: PropTypes.shape({
        icon: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default withFragment(CurrentIcon, { weather: getCurrentIcon });
