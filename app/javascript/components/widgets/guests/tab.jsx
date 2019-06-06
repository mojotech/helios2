import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { sortBy, prop, append, lensPath, set } from 'ramda';
import styled from 'styled-components';
import icon from '../../../../assets/images/icons/icon-calendar.svg';
import { parseTime, isInFutureToday } from '../../../lib/datetime';
import { LoadingMessage, DisconnectedMessage } from '../messages/message';

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
        id
      }
    }
  }
`;

const AnnouncementTime = styled.div``;

const AnnouncementTitle = styled.div``;

const AnnouncementWrapper = styled.div`
  display: flex;
  height: 5vh;
  padding: 1vh;
`;

const AnnouncementIcon = styled.div`
  background: url(${icon});
  width: 3vw;
  background-repeat: no-repeat;
`;

class SubscribedAnnouncements extends React.Component {
  componentDidMount() {
    this.props.subscribeToPublishedAnnouncements();
  }

  render() {
    const { dayAnnouncements } = this.props;

    return (
      <div>
        {sortBy(prop('publishOn'), dayAnnouncements).map(item => (
          <AnnouncementWrapper key={item.id}>
            <AnnouncementIcon />
            <div>
              <AnnouncementTime>{parseTime(item.publishOn)}</AnnouncementTime>
              <AnnouncementTitle>{item.people}</AnnouncementTitle>
            </div>
          </AnnouncementWrapper>
        ))}
      </div>
    );
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
  <Query query={getPrimaryLocationAnnouncements} pollInterval={3.6e6}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) {
        return <LoadingMessage />;
      }

      if (error) {
        return <DisconnectedMessage />;
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
                return prev;
              },
            })
          }
        />
      );
    }}
  </Query>
);

export default Guests;
