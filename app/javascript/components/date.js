import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { GreyText } from './typography';
import { dateForTimezone } from 'lib/datetime';

const LoadingMessage = () => <p>Loading...</p>;

const ErrorMessage = ({ message }) => <p>Error: {message}</p>;

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
    this.state = { date: dateForTimezone(props.timezone) };
  }

  componentDidMount() {
    setInterval(() => {
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

Date.propTypes = {};

export default Date;
