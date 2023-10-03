import styled from 'styled-components';
import IconImage from '../images/main-title-icon.png';

interface SectionTitleProps {
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
    #d8d8d800 1%,
    #d8d8d830 50%,
    #03064bcc 99%
  );
  border-left: 1px solid;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-image: linear-gradient(to right, #fdff00ff, #fffd0000) 1;

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

export function SectionTitle(props: SectionTitleProps) {
  return (
    <TitleWrapper style={props.style}>
      <img src={IconImage} alt=""></img>
      <Text
        className={`${props.selecting ? 'selecting' : props.fn ? 'link' : ''}`}
        onClick={() => {
          props.fn ? props.fn() : void 0;
        }}
      >
        <span> {props.title}</span>
        {props?.children}
      </Text>
    </TitleWrapper>
  );
}

export default SectionTitle;
