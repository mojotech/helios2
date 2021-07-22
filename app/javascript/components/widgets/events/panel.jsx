import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, fontSizes, fonts, spacing } from '@lib/theme';
import StarIcon from '@assets/images/icons/icon-star.svg';
import GiftIcon from '@assets/images/icons/icon-gift.svg';
import UsersIcon from '@assets/images/icons/icon-users.svg';
import UserPlusIcon from '@assets/images/icons/icon-user-plus.svg';
import { Row } from '@components/row';
import { WhiteSubTitle, WhiteTitleLarge } from '@components/typography';

const Title = styled.div`
  margin-bottom: 72px;
  margin-left: 150px;
  width: 45vw;
`;

const Heading = styled.div`
  font-size: ${fontSizes.large};
  font-family: ${fonts.regular};
  margin-bottom: ${spacing.m};
  color: ${p => p.textColor};
`;

const Number = styled.div`
  color: #ffffff;
  font-size: 136px;
  font-weight: 500;
  font-family: GT America-Extended;
`;

const Icon = styled.div`
  margin-right: ${spacing.l};
  margin-top: ${spacing.s};
`;

const Grid = styled.div`
  width: 45vw;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  margin-left: 150px;
`;

const GridItem = styled.div`
  display: flex;
  width: 435px;
  height: 375px;
`;

const Anniversaries = () => {
  return (
    <div>
      <Number>0</Number>
      <Row>
        <Icon>
          <img src={StarIcon} alt="star" width={24} height={32} />
        </Icon>
        <Heading textColor={colors.yellow}>Anniversaries this week</Heading>
      </Row>
      <WhiteSubTitle>No Mojo Anniversaries</WhiteSubTitle>
    </div>
  );
};

const Birthdays = () => {
  return (
    <div>
      <Number>0</Number>
      <Row>
        <Icon>
          <img src={GiftIcon} alt="gift" width={24} height={32} />
        </Icon>
        <Heading textColor={colors.pink}>Birthdays this week</Heading>
      </Row>
      <WhiteSubTitle>No Mojo Birthdays</WhiteSubTitle>
    </div>
  );
};

const PTO = () => {
  return (
    <div>
      <Number>0</Number>
      <Row>
        <Icon>
          <img src={UsersIcon} alt="users" width={24} height={32} />
        </Icon>
        <Heading textColor={colors.lightBlue}>Out of office today</Heading>
      </Row>
      <WhiteSubTitle>No Mojos Out of Office</WhiteSubTitle>
    </div>
  );
};

const NewHires = () => {
  return (
    <div>
      <Number>0</Number>
      <Row>
        <Icon>
          <img src={UserPlusIcon} alt="new_users" width={24} height={32} />
        </Icon>
        <Heading textColor={colors.teal}>New hires this quarter</Heading>
      </Row>
      <WhiteSubTitle>No New Mojos</WhiteSubTitle>
    </div>
  );
};

const Events = ({ startTimer }) => {
  useEffect(() => {
    startTimer();
  }, []);

  return (
    <div>
      <Title>
        <WhiteTitleLarge>Events at MojoTech</WhiteTitleLarge>
      </Title>
      <Grid>
        <GridItem>
          <Anniversaries />
        </GridItem>
        <GridItem>
          <Birthdays />
        </GridItem>
        <GridItem>
          <PTO />
        </GridItem>
        <GridItem>
          <NewHires />
        </GridItem>
      </Grid>
    </div>
  );
};

Events.propTypes = {
  startTimer: PropTypes.func.isRequired,
};

export default Events;
