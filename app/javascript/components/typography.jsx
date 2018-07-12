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
