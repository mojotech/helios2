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
  margin-bottom: ${props => (props.primary ? '48px' : `${spacing.xl}`)};
`;

const ProfileIcon = styled.img`
  border-radius: 50%;
  height: ${props => (props.primary ? '80px' : '56px')};
  width: ${props => (props.primary ? '80px' : '56px')};
  margin-right: 24px;
  opacity: ${props => (props.primary ? '1' : '0.5')};
`;

const ProfileInfoWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  flex-direction: column;
`;

const ProfileHeader = styled.div`
  color: ${colors.white}
  font-size: ${props =>
    props.primary ? `${fontSizes.large}` : `${fontSizes.small}`}
  margin-bottom: ${spacing.s}
  opacity: ${props => (props.primary ? '1' : '0.5')};
`;

const ProfileSub = styled.div`
  color: ${colors.white}
  opacity: 0.5
  font-size: ${props =>
    props.primary ? `${fontSizes.small}` : `${fontSizes.tiny}`}
`;

const ProfileSeparator = styled(ProfileSub)`
  padding-left: 15px;
  padding-right: 15px;
`;

const SubHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

const TwitterProfile = ({
  dateCreated,
  user: { name, handle, avatar },
  isPrimary,
}) => {
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
};

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
