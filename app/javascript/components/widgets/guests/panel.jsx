import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { parseDate } from '@lib/datetime';
import { colors, weights, fontSizes, spacing } from '@lib/theme';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';

const getPrimaryLocationAnnouncements = gql`
  {
    primaryLocation {
      dayAnnouncements {
        message
        people
        company
        publishOn
      }
    }
  }
`;

const AnnouncementWrapper = styled.div`
  text-align: center;
  padding-top: 25vh;
  color: ${colors.white}
  font-size: ${fontSizes.large};
`;

const AnnouncementMessage = styled.div`
  width: 50vw;
  opacity: 0.5;
  font-style: italic;
`;

const AnnouncementTitle = styled.div`
  width: 50vw;
  font-weight: ${weights.bold};
  padding-top: ${spacing.xxxl};
  padding-bottom: ${spacing.xxxl};
`;

const AnnouncementDate = styled.div`
  width: 50vw;
  opacity: 0.5;
  font-size: ${fontSizes.medium};
  color: ${colors.white};
`;

const Announcement = ({
  announcement: { message, people, company, publishOn },
}) => (
  <AnnouncementWrapper>
    <AnnouncementMessage>{message}</AnnouncementMessage>
    <AnnouncementTitle>
      {people} from {company}
    </AnnouncementTitle>
    <AnnouncementDate>{parseDate(publishOn)}</AnnouncementDate>
  </AnnouncementWrapper>
);
Announcement.propTypes = {
  announcement: PropTypes.shape({
    message: PropTypes.string.isRequired,
    people: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    publishOn: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const Guests = () => (
  <Query query={getPrimaryLocationAnnouncements}>
    {({ error, data }) => {
      if (error) {
        return <DisconnectedMessage />;
      }

      if (data.primaryLocation.dayAnnouncements.length > 0) {
        return (
          <Announcement
            announcement={data.primaryLocation.dayAnnouncements[0]}
          />
        );
      }
      return <LoadingMessage />;
    }}
  </Query>
);

export default Guests;
