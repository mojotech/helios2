import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Row } from './row';
import { GreySubText } from './typography';
import guestIcon from '../../assets/images/guest-icon.png';
import { spacing, fontSizes } from '../lib/theme';

const GuestObjectRow = styled(Row)`
  margin-bottom: ${spacing.m};
`;

const MeetingTime = styled(GreySubText)`
  font-size: ${fontSizes.medium};
  padding-left: 15px;
`;

const GuestInfo = styled(GreySubText)`
  font-size: ${fontSizes.medium};
`;

export const GuestElement = ({ summary, time }) => (
  <div>
    <GuestObjectRow>
      <img src={guestIcon} width="18" height="20" alt="guest" />
      <MeetingTime>
        {time}
        <GuestInfo> {summary} </GuestInfo>
      </MeetingTime>
    </GuestObjectRow>
  </div>
);
GuestElement.propTypes = {
  summary: PropTypes.string.isRequired,
  time: PropTypes.string,
};

GuestElement.defaultProps = {
  time: '',
};

export default GuestElement;
