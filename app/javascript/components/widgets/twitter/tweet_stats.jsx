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
  margin-bottom: ${props => (props.primary ? '0px' : '57px')};
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 99px;
`;

const IconLabel = styled.div`
  color: ${colors.white};
  font-size: ${props =>
    props.primary ? `${fontSizes.small}` : `${fontSizes.tiny}`};
  opacity: 0.5;
  margin-left: 8px;
  display: ${props => (props.vis ? 'block' : 'none')};
`;

const IconImg = styled.img`
  height: ${props => (props.primary ? '18px' : '16px')};
  width: auto;
`;

const StatsIcon = ({ icon, count, isPrimary }) => (
  <IconWrapper>
    <IconImg src={icon} alt="stat_icon" primary={isPrimary} />
    <IconLabel vis={count !== 0} primary={isPrimary}>
      {count}
    </IconLabel>
  </IconWrapper>
);

StatsIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  isPrimary: PropTypes.bool.isRequired,
};

const TweetStats = ({
  interactions: { favoriteCount, retweetCount },
  isPrimary,
}) => {
  return (
    <InteractionWrapper primary={isPrimary}>
      <StatsIcon
        icon={retweetIcon}
        count={retweetCount}
        isPrimary={isPrimary}
      />
      <StatsIcon icon={likeIcon} count={favoriteCount} isPrimary={isPrimary} />
    </InteractionWrapper>
  );
};

TweetStats.propTypes = {
  interactions: PropTypes.shape({
    favoriteCount: PropTypes.number.isRequired,
    retweetCount: PropTypes.number.isRequired,
  }).isRequired,
  isPrimary: PropTypes.bool.isRequired,
};

export default TweetStats;
