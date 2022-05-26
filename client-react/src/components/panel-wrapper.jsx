import styled from 'styled-components';
import { colors } from '@lib/theme';

export const Wrapper = styled.div`
  background: ${colors.black};
  height: calc(100vh - 100px);
  padding-top: 100px;
  padding-left: 100px;
  width: calc(100vw - 100px);
  overflow: hidden;
`;

export default Wrapper;
