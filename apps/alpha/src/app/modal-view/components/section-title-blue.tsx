import { useEffect } from 'react';
import styled from 'styled-components';
import BlueImg from '../images/blue-title.svg';

interface SectionTitleBlueProps {
  title: string;
  style?: object;
  fn?: Function;
  selecting?: boolean;
  children?: any;
}

const TitleWrapper = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
`;
const Text = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 15px;
  margin-left: 8px;
  line-height: 2;
  text-align: left;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 2px;
  font-family: 'FZZD', 'PMZD', 'douyu', 'PuHuiTi-Bold', sans-serif;
  span {
    /* FZZD 字体衬线偏下2px */
    margin-top: 2px;
  }
  background-image: linear-gradient(
    270deg,
    rgba(79, 86, 92, 0) 3%,
    rgba(3, 6, 75, 0.8) 99%
  );
  border-left: 1px solid;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-image: linear-gradient(to right, #1f9bf3, #498dbb00) 1;
  &.link {
    cursor: pointer;
    &:hover {
      color: #00fcff;
    }
  }
  &.selecting {
    color: #0091ff;
  }
`;

let lastClick = 0;

export function SectionTitleBlue(props: SectionTitleBlueProps) {
  const rate = 2000;

  useEffect(() => {
    lastClick = Date.now() - rate;
  }, []);

  const click = () => {
    if (Date.now() - lastClick >= rate) {
      props.fn && props.fn();
      lastClick = Date.now();
    }
  };

  return (
    <TitleWrapper style={props.style}>
      <img src={BlueImg} alt=""></img>
      <Text
        className={`${props.selecting ? 'selecting' : props.fn ? 'link' : ''}`}
        onClick={() => {
          props.fn ? click() : void 0;
        }}
      >
        <span> {props.title}</span>
        {props?.children}
      </Text>
    </TitleWrapper>
  );
}

export default SectionTitleBlue;
