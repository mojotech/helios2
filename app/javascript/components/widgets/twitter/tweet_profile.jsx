import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fontSizes, colors, spacing } from '@lib/theme';

const ProfileWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: flex-start;
  width: 15vw;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: ${(props) => (props.primary ? '48px' : `${spacing.xl}`)};
`;

const ProfileIcon = styled.img`
  border-radius: 50%;
  height: 80px;
  width: 80px;
  margin-right: 24px;
`;

const ProfileInfoWrapper = styled.div`
  display: flex;
  // flex-wrap: no-wrap;
  justify-content: space-between;
  flex-direction: column;
  min-width: 300px;
`;

const ProfileHeader = styled.div`
  color: ${colors.white}
  font-size: ${fontSizes.large}
  margin-bottom: ${spacing.s}
  text-align: left;
`;

const ProfileSub = styled.div`
  color: ${colors.white}
  opacity: 0.5
  font-size: ${fontSizes.small}
  flex-wrap: no-wrap;
`;

const ProfileSeparator = styled(ProfileSub)`
  padding-left: 15px;
  padding-right: 15px;
`;

const SubHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

function TwitterProfile({
  dateCreated,
  user: { name, handle, avatar },
  isPrimary,
}) {
  return (
    <ProfileWrapper primary={isPrimary}>
      <ProfileIcon src={avatar} alt="twitter profile" primary={isPrimary} />
      <ProfileInfoWrapper>
        <ProfileHeader primary={isPrimary}>{name}</ProfileHeader>
        <SubHeader>
          <ProfileSub primary={isPrimary}>{`@${handle}`}</ProfileSub>
          <ProfileSeparator primary={isPrimary}> • </ProfileSeparator>
          <ProfileSub primary={isPrimary}>{dateCreated}</ProfileSub>
        </SubHeader>
      </ProfileInfoWrapper>
    </ProfileWrapper>
  );
}

TwitterProfile.propTypes = {
  dateCreated: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    handle: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  isPrimary: PropTypes.bool.isRequired,
};

export default TwitterProfile;
