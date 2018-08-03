import styled from 'styled-components';
import { Flex } from 'grid-styled';

export const InnerBound = styled(Flex)`
  border: ${props => (props.debug ? `1px solid tomato` : `none`)};
  width: 100%;
  /* Should only at most 60% of parent container (80vw)*/
  max-width: calc(80vw * 0.6);
  margin-right: auto;
  margin-left: auto;
  height: ${props => props.height};
`;
