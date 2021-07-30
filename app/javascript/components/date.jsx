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
    timezone
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
    loading: PropTypes.bool,
    error: PropTypes.bool,
    location: PropTypes.shape({
      timezone: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    loading: true,
    error: false,
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

  timezone = props => (props.location ? props.location.timezone : null);

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
      return <ErrorMessage />;
    }

    const { date } = this.state;
    if (!date) {
      return null;
    }
    return <DateText>{date}</DateText>;
  }
}

export default withFragment(Date, { location: getTimeZone });
