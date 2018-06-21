import styled from 'styled-components';
import { colors } from '../lib/theme';

export const Wrapper = styled.div`
  background: ${colors.black};
  height: calc(100vh - 200px);
  padding: 100px;
  width: calc(100vw - 200px);
`;

export default Wrapper;
