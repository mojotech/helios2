import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { dateForTimezone } from '@lib/datetime';
import { colors, fontSizes, spacing, fonts } from '@lib/theme';
import { LoadingMessage, ErrorMessage } from '@messages/default-messages';
import withFragment from './hocs/with-fragment';

export const getTimeZone = gql`
  fragment Date on Location {
    timeZone
  }
`;
export const DateText = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.medium};
  font-family: ${fonts.light};
  margin-bottom: ${spacing.xxxl};
  margin-top: ${spacing.xxxl};
`;

const propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  location: PropTypes.shape({
    timeZone: PropTypes.string,
  }).isRequired,
};

const defaultProps = {
  loading: true,
  error: false,
};

const timeZone = (props) => (props.location ? props.location.timeZone : null);

export class Date extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
    };
  }

  componentDidMount() {
    if (timeZone(this.props)) {
      this.startDateTimer();
    }
  }

  componentDidUpdate(prevProps) {
    if (timeZone(this.props) && !timeZone(prevProps)) {
      this.startDateTimer();
    }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  setDate = () => {
    this.setState({ date: dateForTimezone(timeZone(this.props)) });
  };

  startDateTimer = () => {
    this.setDate();
    this.intervalId = setInterval(this.setDate, 10000);
  };

  render() {
    const { loading, error } = this.props;
    if (loading) {
      return <LoadingMessage />;
    }

    if (error) {
      // eslint-disable-next-line
      console.error(error);
      return <ErrorMessage />;
    }

    const { date } = this.state;

    if (!date) {
      return null;
    }
    return <DateText>{date}</DateText>;
  }
}

Date.defaultProps = defaultProps;
Date.propTypes = propTypes;

export default withFragment(Date, { location: getTimeZone });
