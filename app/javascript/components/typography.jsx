import styled from 'styled-components';
import { colors, fontSizes, spacing } from '../lib/theme';

export const GreyText = styled.div`
  color: ${colors.grey};
`;

export const WhiteText = styled.div`
  color: ${colors.white};
`;

export const WhiteTitle = styled(WhiteText)`
  font-size: ${fontSizes.medium};
  margin-bottom: ${spacing.xs};
`;

export const GreySubText = styled(GreyText)`
  font-size: ${fontSizes.medium};
  margin-bottom: ${spacing.xs};
`;
