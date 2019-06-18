import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { sortBy, prop, append, lensPath, set, filter } from 'ramda';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { parseDate, isInFutureToday } from '@lib/datetime';
import { colors, weights, fontSizes, spacing } from '@lib/theme';
import { LoadingMessage, DisconnectedMessage } from '@messages/message';

const subscribeAnnouncementPublished = gql`
  subscription onAnnouncementPublished {
    announcementPublished {
      message
      people
      company
      publishOn
      id
    }
  }
`;

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

class SubscribedAnnouncements extends React.Component {
  componentDidMount() {
    this.props.subscribeToPublishedAnnouncements();
  }

  render() {
    const { dayAnnouncements } = this.props;
    const announcement = sortBy(prop('publishOn'), dayAnnouncements)[0];

    return <Announcement anouncement={announcement} />;
  }
}
SubscribedAnnouncements.propTypes = {
  dayAnnouncements: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      people: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      publishOn: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  subscribeToPublishedAnnouncements: PropTypes.func.isRequired,
};

const Guests = () => (
  <Query query={getPrimaryLocationAnnouncements}>
    {({ loading, error, data, subscribeToMore }) => {
      if (error) {
        return <DisconnectedMessage />;
      }

      if (loading || data.primaryLocation.dayAnnouncements.length === 0) {
        return <LoadingMessage />;
      }

      return (
        <SubscribedAnnouncements
          dayAnnouncements={data.primaryLocation.dayAnnouncements}
          subscribeToPublishedAnnouncements={() =>
            subscribeToMore({
              document: subscribeAnnouncementPublished,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }
                const { announcementPublished } = subscriptionData.data;

                if (isInFutureToday(announcementPublished.publishOn)) {
                  return set(
                    lensPath(['primaryLocation', 'dayAnnouncements']),

                    append(
                      announcementPublished,
                      prev.primaryLocation.dayAnnouncements,
                    ),

                    prev,
                  );
                }

                const isFutureToday = item => isInFutureToday(item.publishOn);
                return set(
                  lensPath(['primaryLocation', 'dayAnnouncements']),
                  filter(isFutureToday, prev.primaryLocation.dayAnnouncements),
                  prev,
                );
              },
            })
          }
        />
      );
    }}
  </Query>
);

export default Guests;
