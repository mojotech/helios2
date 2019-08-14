import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  overflow: hidden;
`;

const LiveStream = () => {
  return (
    <Wrapper>
      <iframe
        title="livestream"
        width={window.innerWidth}
        height={window.innerHeight}
        src=""
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    </Wrapper>
  );
};

export default LiveStream;
