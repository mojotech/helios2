import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import withFragment from '@hocs/with-fragment';

const getCurrentIcon = gql`
  fragment CurrentIcon on Weather {
    currently {
      icon
    }
  }
`;

const CurrentIcon = ({ weather }) => {
  return weather.currently.icon;
};

CurrentIcon.propTypes = {
  weather: PropTypes.shape({
    currently: PropTypes.shape({
      icon: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

CurrentIcon.fragments = {
  weather: getCurrentIcon,
};

export default withFragment(CurrentIcon);
