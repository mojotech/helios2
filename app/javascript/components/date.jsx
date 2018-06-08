import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
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
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/no-unused-state
    this.state = { date: dateForTimezone(props.timezone) };
  }

  componentDidMount() {
    setInterval(() => {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ date: dateForTimezone(this.props.timezone) });
    }, 10000);
  }

  render() {
    return (
      <Query query={getTimezone}>
        {({ loading, error, data }) => {
          if (loading) {
            return <LoadingMessage />;
          }

          if (error) {
            return <ErrorMessage message={error.message} />;
          }

          return <GreyText>{dateForTimezone(data.timezone)}</GreyText>;
        }}
      </Query>
    );
  }
}

Date.propTypes = {
  timezone: PropTypes.string.isRequired,
};

export default Date;
