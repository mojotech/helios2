import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fontSizes, colors, spacing } from '@lib/theme';

const ProfileWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: flex-start;
  width: 18vw;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 48px;
`;

const ProfileInfoWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  flex-direction: column;
`;

const ProfileHeader = styled.div`
  color: ${colors.white}
  font-size: ${fontSizes.large}
  margin-bottom: ${spacing.s}
`;

const ProfileSub = styled.div`
  color: ${colors.white}
  opacity: 0.5
  font-size: ${fontSizes.small}
`;

const ProfileSeparator = styled(ProfileSub)`
  padding-left: 15px;
  padding-right: 15px;
`;

const ProfileIcon = styled.img`
  margin-right: 24px;
  height: 80px;
  width: 80px;
  border-radius: 50%;
`;

const SubHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

const TwitterProfile = ({ dateCreated, user: { name, handle, avatar } }) => {
  return (
    <ProfileWrapper>
      <ProfileIcon src={avatar} alt="twitter profile" />
      <ProfileInfoWrapper>
        <ProfileHeader>{name}</ProfileHeader>
        <SubHeader>
          <ProfileSub>{`@${handle}`}</ProfileSub>
          <ProfileSeparator> • </ProfileSeparator>
          <ProfileSub>{dateCreated}</ProfileSub>
        </SubHeader>
      </ProfileInfoWrapper>
    </ProfileWrapper>
  );
};

TwitterProfile.propTypes = {
  dateCreated: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    handle: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
};

export default TwitterProfile;
