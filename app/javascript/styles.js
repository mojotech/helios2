import styledNormalize from 'styled-normalize';
import { injectGlobal } from 'styled-components';

const injectBaseStyles = () => injectGlobal`
  ${styledNormalize}

  body {
    font-family: 'GT America';
  }
`;

export default injectBaseStyles;
