import styledNormalize from 'styled-normalize';
import { injectGlobal } from 'styled-components';
import { fonts } from 'lib/theme';

const injectBaseStyles = () => injectGlobal`
  ${styledNormalize}

  body {
    font-family: ${fonts.regular};
  }
`;

export default injectBaseStyles;
