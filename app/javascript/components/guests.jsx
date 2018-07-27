import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { take, path } from 'ramda';
import { WhiteTitle } from './typography';
import { spacing } from '../lib/theme';
import { parseTime } from '../lib/datetime';
import GuestElement from './guest-element';
import { isPresent } from '../lib/util';

const LoadingMessage = () => <p>Loading...</p>;

const ErrorMessage = ({ message }) => <p>Error: {message}</p>;
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

const TodaysGuestsText = styled(WhiteTitle)`
  margin-top: ${spacing.xxl};
  margin-bottom: ${spacing.l};
`;

const getEvents = gql`
  {
    primaryLocation {
      googleCal {
        items {
          summary
          id
          start {
            dateTime
          }
        }
      }
    }
  }
`;

const Guests = ({ data: { loading, error, primaryLocation } }) => {
  const events = path(['googleCal', 'items'], primaryLocation);

  if (loading) {
    return <LoadingMessage />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isPresent(events)) {
    return (
      <div>
        <TodaysGuestsText> Today&apos;s Guests</TodaysGuestsText>
        {take(2, events).map(({ id, summary, start }) => (
          <GuestElement
            key={id}
            summary={summary}
            time={parseTime(start.dateTime).toUpperCase()}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <TodaysGuestsText> Today&apos;s Guests</TodaysGuestsText>
      <GuestElement summary="No guests are scheduled" />
    </div>
  );
};

Guests.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.shape({}),
    primaryLocation: PropTypes.shape({}),
  }).isRequired,
};

export default graphql(getEvents, {
  options: { pollInterval: 60000 },
})(Guests);
