import styled from 'styled-components';
import system from 'system-components';
import { colors, fontSizes, spacing, fonts } from '../lib/theme';

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

export const Text = system(
  'space',
  'color',
  props => ({
    fontWeight: props.fontWeight,
    fontSize: props.fontSize || fontSizes.small,
  }),
  {
    is: 'p',
    fontFamily: fonts.light,
  },
);

export const ExtendedText = styled(Text)`
  font-family: ${fonts.thin};
`;
