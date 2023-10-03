import React from 'react';
import styled from "styled-components";

const AnimateTxt = styled.span<{ index: number }>`
  filter: blur(0px);
  animation: ${(props) =>
    `blur-text 1s ${props.index * 0.2}s infinite linear alternate`};

  @keyframes blur-text {
    0% {
      filter: blur(0px);
    }
    100% {
      filter: blur(4px);
    }
  }
`;

const LoadingTxtWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'PMZD', sans-serif;
`;

export default function LoadingTxt(props: { text: string }) {
  const { text } = props;
  const charList = text.split('');
  return (
    <LoadingTxtWrap>
      {charList.map((char, index) => (
        <AnimateTxt key={`di-${index}`} index={index}>
          {char}
        </AnimateTxt>
      ))}
    </LoadingTxtWrap>
  );
}