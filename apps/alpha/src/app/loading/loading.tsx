import styled from 'styled-components';
import './loading.module.scss';

/* eslint-disable-next-line */
export interface LoadingProps {}
// const colorList = ['#1bbaff', '#0aff99', '#a1ff0a', '#fae231', '#ff8700'];
const colorList = ['#0091ff', '#52ccff', '#00c2b5', '#a1ff0a', '#fae231'];

const FullScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .music {
    margin-top: calc(30%);
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 300px;
    height: 100px;
    animation: hide_to_show 800ms ease-in;
  }
  @keyframes hide_to_show {
    from {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
  }
  .music .bar {
    width: 12px;
    height: 2px;
    border-radius: 10px;
    background-color: white;
    animation: up_down 1.5s ease-in-out infinite;
  }

  @keyframes up_down {
    0%,
    100% {
      height: 2px;
    }
    50% {
      height: 80px;
    }
  }
  ${() => {
    let str = '';
    for (let i = 0; i < 10; i++) {
      str += `.music .bar:nth-child(${i + 1}) {
    background-color: ${colorList[i < 5 ? i % 5 : 4 - (i % 5)]};
    animation-delay: ${i < 5 ? 1000 - i * 200 : i * 200 - 800}ms;
  }`;
    }
    return str;
  }}
`;

export function Loading(props: LoadingProps) {
  return (
    <FullScreenContainer>
      <div className="music">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </FullScreenContainer>
  );
}

export default Loading;
