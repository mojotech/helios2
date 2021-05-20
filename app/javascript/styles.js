import styledNormalize from 'styled-normalize';
import { createGlobalStyle } from 'styled-components';
import { fonts } from '@lib/theme';

const GlobalStyle = createGlobalStyle`
  ${styledNormalize}

  body {
    font-family: ${fonts.regular};
  }
`;

export default GlobalStyle;
