import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import withFragment from '@hocs/with-fragment';

const getCurrentIcon = gql`
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

CurrentIcon.fragments = {
  weather: getCurrentIcon,
};

export default withFragment(CurrentIcon);
