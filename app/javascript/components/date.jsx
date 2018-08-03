import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { dateForTimezone } from 'lib/datetime';
import { GreyText } from './typography';

const LoadingMessage = () => <p>Loading...</p>;

const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const getTimezone = gql`
  {
    primaryLocation {
      timezone
    }
  }
`;

export class Date extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({
        message: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  state = { date: null };

  componentDidMount() {
    if (this.timezone(this.props)) {
      this.startDateTimer();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.timezone(this.props) && !this.timezone(prevProps)) {
      this.startDateTimer();
    }
  }

  setDate = () => {
    this.setState({ date: dateForTimezone(this.timezone(this.props)) });
  };

  timezone = props =>
    props.data.primaryLocation ? props.data.primaryLocation.timezone : null;

  startDateTimer = () => {
    this.setDate();
    setInterval(() => this.setDate, 10000);
  };

  render() {
    const { loading, error } = this.props.data;
    if (loading) {
      return <LoadingMessage />;
    }

    if (error) {
      return <ErrorMessage message={error.message} />;
    }

    return <GreyText>{this.state.date}</GreyText>;
  }
}

export default graphql(getTimezone)(Date);
