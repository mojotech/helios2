import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { dateForTimezone } from '@lib/datetime';
import { colors, fontSizes, spacing, fonts } from '@lib/theme';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';

const getTimezone = gql`
  query getTimezone($cityName: String!) {
    location(cityName: $cityName) {
      timezone
    }
  }
`;
export const DateText = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.medium};
  font-family: ${fonts.light};
  margin-bottom: ${spacing.xxxl};
  margin-top: ${spacing.xxxl};
`;

export class Date extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.shape({}),
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

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  setDate = () => {
    this.setState({ date: dateForTimezone(this.timezone(this.props)) });
  };

  timezone = props =>
    props.data.location ? props.data.location.timezone : null;

  startDateTimer = () => {
    this.setDate();
    this.intervalId = setInterval(this.setDate, 10000);
  };

  render() {
    const { loading, error } = this.props.data;
    if (loading) {
      return <LoadingMessage />;
    }

    if (error) {
      return <ErrorMessage />;
    }

    return <DateText>{this.state.date}</DateText>;
  }
}

export default graphql(getTimezone, {
  options: ownProps => ({
    variables: {
      cityName: ownProps.cityName,
    },
  }),
})(Date);
