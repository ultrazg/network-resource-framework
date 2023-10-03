// 该组件为设计5.0版业务支撑和关键指标模块使用，已废弃
import styled from 'styled-components';
interface DataLabelProps {
  // 如果svg为真，渲染为svg，否则渲染为img
  svg?: boolean;
  // 如果是svg，传入svg编号，如果是image，传入图片的路径
  icon?: string;
  // 主标题/数字
  num: string;
  // 数字单位
  measure?: string;
  // 副标题/描述
  description: string;
  // 主标题字体大小
  numSize?: string;
  // 副标题字体大小
  descriptionSize?: string;
  iconWidth?: string;
  iconHeight?: string;
  // 组件容器样式
  style?: object;
  // svg图标容器样式
  svgStyle?: object;
  // svg图标渐变颜色
  svgGradientColor?: {
    start: string;
    end: string;
  };
}

const ListItemWrapper = styled.div`
  display: flex;
  white-space: nowrap;
`;
const NumContent = styled.div`
  line-height: 14px;
  font-size: 14px;
  color: #ffffff;
  font-family: 'PMZD', sans-serif;
  margin-bottom: 4px;
`;
const DescriptionContent = styled.div`
  line-height: 17px;
  font-size: 12px;
  color: #00fcff;
`;
const IconContainer = styled.div`
  margin-right: 8px;
  text-align: center;
  width: 40px;
  height: 40px;
`;
const IconAlt = styled.div`
  color: #ffffff;
  background-color: #3d8df9;
  border-radius: 5px;
  width: 52px;
  height: 45px;
`;

export function DataLabel(props: DataLabelProps) {
  return (
    <ListItemWrapper style={props.style}>
      <IconContainer>
        {props.svg ? (
          <svg
            className="icon svg-icon"
            aria-hidden="true"
            style={{
              width: props.iconWidth || '40px',
              height: props.iconHeight || '40px',
              ...props.svgStyle,
            }}
          >
            <defs>
              <linearGradient
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
                id="linearGradient-7flowrzegi-1"
              >
                <stop
                  stopColor={props.svgGradientColor?.start || '#1CDCE4'}
                  offset="0%"
                ></stop>
                <stop
                  stopColor={props.svgGradientColor?.end || '#0C83FF'}
                  offset="100%"
                ></stop>
              </linearGradient>
            </defs>
            <use
              xlinkHref={props.icon}
              fill="url(#linearGradient-7flowrzegi-1)"
            ></use>
          </svg>
        ) : props.icon ? (
          <img
            src={props.icon}
            alt=""
            style={{ verticalAlign: 'middle' }}
            width={props.iconWidth}
            height={props.iconHeight}
          ></img>
        ) : (
          <IconAlt></IconAlt>
        )}
      </IconContainer>
      <div>
        <NumContent style={{ fontSize: props.numSize }}>
          <span>{props.num}</span>
          <span> {props.measure}</span>
        </NumContent>
        <DescriptionContent style={{ fontSize: props.descriptionSize }}>
          {props.description}
        </DescriptionContent>
      </div>
    </ListItemWrapper>
  );
}

export default DataLabel;
