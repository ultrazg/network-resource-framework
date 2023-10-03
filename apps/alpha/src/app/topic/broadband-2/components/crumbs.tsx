// 面包屑组件
import styled from 'styled-components';
import bgImg from '../images/crumbs.svg';

const Wrapper = styled.div`
  pointer-events: auto;
  position: absolute;
  left: 60px;
  top: 25px;
  width: 266.23px;
  height: 52px;
  background: url(${bgImg}) center no-repeat;
  font-size: 16px;
  z-index: 99;
  .country {
    position: absolute;
    top: 19px;
    left: 20px;
    color: #0091ff;

    &:hover {
      cursor: pointer;
    }
  }

  .province {
    position: absolute;
    top: 19px;
    left: 80px;
    color: #00fcff;
  }
`;

interface CrumbsProps {
  provinceName: string;
  clickFn: Function;
}

export function Crumbs(props: CrumbsProps) {
  return (
    <>
      <Wrapper>
        <div
          className="country"
          onClick={() => {
            props.clickFn();
          }}
        >
          全国
        </div>
        <div className="province">{props.provinceName}</div>
      </Wrapper>
    </>
  );
}

export default Crumbs;
