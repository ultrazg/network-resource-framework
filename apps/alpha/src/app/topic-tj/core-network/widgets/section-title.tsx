import styled from 'styled-components';
import TitleBorder from '../images/bg-line.png';

interface SectionTitleProps {
  mainTitle: string;
  subTitle: string;
  right?: boolean; // 右对齐
  noBorder?: boolean; // 不需要下划线
  mainTitleColor?: string; // 主标题颜色定制
  subTitleColor?: string; // 副标题颜色定制
  style?: object;
}

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  font-family: FZZD,PMZD,douyu,PuHuiTi-Bold,sans-serif;
`;
const MainTitle = styled.div`
  line-height: 24px;
  font-size: 24px;
  color: #ffffff;
  letter-spacing: 2px;
`;

const SubTitle = styled.div`
  line-height: 20px;
  font-size: 20px;
  color: #0091ff;
`;
const TitleBorderLine = styled.div`
  background-image: url(${TitleBorder});
  background-repeat: no-repeat;
  background-size: cover;
  height: 4px;
  width: 100%;
  margin-top: 6px;
`;

export function SectionTitle(props: SectionTitleProps) {
  return (
    <div style={props.style}>
      {props.right ? (
        <>
          <TitleWrapper style={{ flexDirection: 'row-reverse' }}>
            <MainTitle
              style={{ paddingLeft: '8px', color: props.mainTitleColor }}
            >
              {props.mainTitle}
            </MainTitle>
            <SubTitle style={{ color: props.subTitleColor }}>
              {props.subTitle}
            </SubTitle>
          </TitleWrapper>
          {props.noBorder || (
            <TitleBorderLine
              style={{
                transform: 'rotateY(180deg)',
              }}
            />
          )}
        </>
      ) : (
        <>
          <TitleWrapper>
            <MainTitle
              style={{ paddingRight: '8px', color: props.mainTitleColor }}
            >
              {props.mainTitle}
            </MainTitle>
            <SubTitle style={{ color: props.subTitleColor }}>
              {props.subTitle}
            </SubTitle>
          </TitleWrapper>
          {props.noBorder || <TitleBorderLine />}
        </>
      )}
    </div>
  );
}

export default SectionTitle;
