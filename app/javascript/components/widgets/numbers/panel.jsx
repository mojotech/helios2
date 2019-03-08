import React from 'react';
import PropTypes from 'prop-types';
import { withContext as withUhityContext } from '../../unity-context';

class Numbers extends React.Component {
  static propTypes = {
    setVisible: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.setVisible(true);
  }

  componentWillUnmount() {
    this.props.setVisible(false);
  }

  render() {
    return null;
  }
}

export default withUhityContext(Numbers);
