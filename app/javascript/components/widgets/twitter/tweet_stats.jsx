import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import likeIcon from '@icons/icon-like.svg';
import retweetIcon from '@icons/icon-retweet.svg';
import { fontSizes, colors } from '../../../lib/theme';

const InteractionWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: flex-start;
  width: 15vw;
  flex-direction: row;
  align-items: flex-end;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 99px;
`;

const IconLabel = styled.div`
  color: ${colors.white};
  font-size: ${fontSizes.small};
  opacity: 0.5;
  margin-left: 8px;
  display: ${props => (props.vis ? 'block' : 'none')};
`;

const StatsIcon = ({ icon, count }) => (
  <IconWrapper>
    <img src={icon} alt="stat_icon" />
    <IconLabel vis={count !== 0}>{count}</IconLabel>
  </IconWrapper>
);

StatsIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

const TweetStats = ({ favorites, retweets }) => (
  <InteractionWrapper>
    <StatsIcon icon={retweetIcon} count={retweets} />
    <StatsIcon icon={likeIcon} count={favorites} />
  </InteractionWrapper>
);

TweetStats.propTypes = {
  favorites: PropTypes.number.isRequired,
  retweets: PropTypes.number.isRequired,
};

export default TweetStats;
