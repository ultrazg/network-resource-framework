import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EmptyImg from './imgs/empty.png';

export interface EmptyProps {
  style: any;
  describe: string;
}

const Empty = (props: EmptyProps) => {
  return (
    <Wrap style={props.style}>
      <div className="describe">{props.describe}</div>
    </Wrap>
  );
};

export default Empty;

const Wrap = styled.div`
  width: 256.73px;
  height: 197.14px;
  background: url(${EmptyImg}) center no-repeat;
  background-size: 100% 100%;

  position: absolute;

  .describe {
    position: absolute;
    bottom: 0px;
    font-size: 13px;
    color: #32c5ff;

    width: 100%;
    text-align: center;
  }
`;
