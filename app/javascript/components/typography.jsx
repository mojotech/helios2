import styled from 'styled-components';
import { colors, fontSizes, spacing } from '../lib/theme';

export const GreyText = styled.div`
  color: ${colors.grey};
  font-size: ${fontSizes.medium};
`;

export const WhiteText = styled.div`
  color: ${colors.white};
`;

export const WhiteTitle = styled(WhiteText)`
  font-size: ${fontSizes.small};
  margin-bottom: ${spacing.xs};
`;

export const GreySubText = styled(GreyText)`
  font-size: ${fontSizes.small};
  margin-bottom: ${spacing.xs};
`;

export const WhiteSubTitle = styled(WhiteText)`
  font-size: ${fontSizes.small};
  letter-spacing: 1px;
  opacity: 0.8;
  margin-bottom: ${spacing.l};
`;

export const WhiteTitleLarge = styled(WhiteText)`
  font-size: ${fontSizes.large};
  margin-bottom: ${spacing.m};
`;
