// idc资源总览

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import IconIDC from '../images/idc.svg';

import IconRack from '../images/rack.svg';

import IconRate from '../images/rate.svg';
import PON from '../images/PON.svg';
import OBDPort from '../images/OBD-port.svg';
import IconONU from '../images/onu-nums.svg';
import IconOLT from '../images/olt-nums.svg';
import Icon from '../images/percent.svg';

import { AnimateNumber } from '@network-resource-vis/animate-number';

import { getResourceList, getResourcePort } from '@alpha/api/broardband';
import { convertMeasure } from '@alpha/utils/commFunc';
import SectionTitle from '@alpha/app/components/section-title/section-title';
import { ProvinceInfoObj } from '@alpha/app/topic/broadband-2/widgets/gis/gis-map';
import { names } from '../components/resource';

export interface OverViewProps {
  provinceName: string;
  jump: Function;
}

const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 28px;
  margin-top: 10px;
  justify-content: space-between;
  width: 420px;
`;

const Container = styled.div`
  .port-used {
    margin-top: 40px;
  }
  .port-use-percent {
    display: flex;
    /* justify-content: space-between; */
    width: 450px;
    transform: translate(10px, 34px);
    .data-label {
      padding-right: 80px;
      display: flex;
      &:hover {
        cursor: pointer;
      }
      img {
        width: 37px;
        height: 40px;
      }
      .data {
        display: flex;
        flex-direction: column;
        margin-left: 8px;
        .value {
          font-family: 'PMZD', sans-serif;
          font-size: 24px;
          color: #01ffff;
          margin-bottom: 4px;
        }
        .name {
          font-size: 12px;
          color: #40a9ff;
        }
      }
    }
  }
`;

const PortNumberOverview = styled.div`
  display: flex;
  /* justify-content: space-between; */
  width: 320px;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;

    &:hover {
      cursor: pointer;
    }

    &:last-child {
      margin-left: auto;
    }
    img {
      width: 110px;
      height: 128px;
    }
    .value {
      font-family: 'PMZD', sans-serif;
      font-size: 24px;
      color: #ffffff;
      letter-spacing: 1.75px;
      transform: translateY(16px);
    }
    .name {
      margin-top: 10px;
      font-weight: 400;
      font-size: 14px;
      color: #00fcff;
    }
  }
`;

const InfoBlock = styled.div`
  width: 33%;
  display: flex;
  margin-top: 30px;
  .name {
    padding-top: 13px;
    padding-bottom: 15px;
    height: 20px;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
  }
  .value {
    height: 20px;
    font-size: 20px;
    font-family: 'PMZD', sans-serif;
    color: #00fcff;
    text-shadow: 0 0 10px rgba(0, 254, 255, 0.57);
    white-space: nowrap;
    span {
      font-size: 23px;
    }
  }
`;

const IconContainer = styled.div`
  margin-right: 8px;
  text-align: center;
  width: 64.5px;
  height: 80px;
`;

interface infoObj {
  index?: number;
  name: string;
  value: number;
  measure?: string;
  icon: string;
  tooltip?: string;
  backgroundImg?: string;
  style?: any; //
}

interface OrderDataObj {
  onuTotal: infoObj; //2
  oltTotal: infoObj; //4
  standardAddress: infoObj; //1
  obdTotal: infoObj; //3
  [key: string]: any;
}

function DataLabel(props: infoObj) {
  return (
    <InfoBlock key={props.name} style={props?.style}>
      <IconContainer>
        <img
          src={props.icon}
          alt=""
          style={{ verticalAlign: 'middle' }}
          width={64.5}
          height={80}
        ></img>
      </IconContainer>
      <div>
        <div className="name">
          {props.tooltip ? (
            <span data-tooltip={props.tooltip}>{props.name}</span>
          ) : (
            props.name
          )}
        </div>
        <div className="value">
          {props.value !== -1 ? (
            <>
              <AnimateNumber
                fontFamily="PMZD"
                value={Number(Number(props.value).toFixed(2))}
                color="#00fcff"
                size={24}
                duration={1000}
                toFixed={props.value.toString().indexOf('.') ? 2 : 0}
              ></AnimateNumber>
              <span
                style={
                  props.measure === '%' ? undefined : { marginLeft: '4px' }
                }
              >
                {props.value !== -1 && props.measure}
              </span>
            </>
          ) : (
            <>--</>
          )}
        </div>
      </div>
    </InfoBlock>
  );
}

export function OverView(props: OverViewProps) {
  const [resourceOverviewData, setResourceOverviewData] = useState<infoObj[]>(
    []
  );
  const [portUsedData, setPortUsedData] = useState<infoObj[]>([]);
  const [portUsedListData, setPortUsedListData] = useState<infoObj[]>([]);
  const resourceOverviewDataMap: OrderDataObj = {
    standardAddress: {
      name: '标准地址数', //1
      value: -1,
      icon: IconRack,
    },
    onuTotal: {
      name: 'ONU设备数', //2
      value: -1,
      icon: IconONU,
    },
    obdTotal: {
      name: 'OBD 设备数', //3
      value: -1,
      icon: IconIDC,
    },
    oltTotal: {
      name: 'OLT 设备数', //4
      value: -1,
      icon: IconOLT,
    },
  };

  const portUsedListDataMap: { [key: string]: any } = {
    ponPortTotal: {
      name: 'PON 端口数',
      value: -1,
      backgroundImg: PON,
      key: 'PONPortNumber',
      measure: '',
    },
    obdPortTotal: {
      name: 'OBD 端子数',
      value: -1,
      backgroundImg: OBDPort,
      key: ' OBDPortnumber',
      measure: '',
    },
  };
  const portUsedDataMap: { [key: string]: any } = {
    ponPortUsage: {
      name: 'PON 端口利用率',
      value: -1,
    },
    obdPortUsage: {
      name: 'OBD 端子利用率',
      value: -1,
    },
  };

  useEffect(() => {
    setPortUsedData(Object.values(portUsedDataMap));
    setResourceOverviewData(Object.values(resourceOverviewDataMap));
    setPortUsedListData(Object.values(portUsedListDataMap));
    //请求数据
    getResourcePort({
      province: props.provinceName === '' ? '全国' : props.provinceName,
    }).then((res) => {
      dataFormate(portUsedDataMap, setPortUsedData, res.data);
      dataFormate(portUsedListDataMap, setPortUsedListData, res.data);
      dataFormate(resourceOverviewDataMap, setResourceOverviewData, res.data);
    });
  }, [props.provinceName]);

  // 对象处理函数抽离
  function dataFormate(
    dataMap: any,
    setDataList: (data: infoObj[]) => void,
    data: any
  ): void {
    for (const key in data) {
      if (!data[key] && data[key] != 0) {
        data[key] = -1;
      }
      if (dataMap[key]) {
        if (data[key].toString().length > 5) {
          dataMap[key].value = convertMeasure(data[key], 2)[0];
          dataMap[key].measure = convertMeasure(data[key])[1];
        } else {
          dataMap[key].value = data[key];
        }
      }
    }
    setDataList(Object.values(dataMap));
  }

  return (
    <Container>
      <ListWrapper>
        {resourceOverviewData.map((item) => {
          return (
            <DataLabel
              {...item}
              key={item.name}
              tooltip={item.tooltip}
              style={{ width: '50%' }}
            ></DataLabel>
          );
        })}
      </ListWrapper>
      <div className="port-used">
        <SectionTitle
          mainTitle={''}
          subTitle={'端口利用情况'}
          subTitleColor="#00FCFF"
        ></SectionTitle>
        <PortNumberOverview>
          {portUsedListData.map((item, index) => (
            <div
              className="item"
              key={index}
              onClick={() => {
                props.jump(names[0][index]);
              }}
            >
              {/* HACK 全国PON端口数写死 */}
              <div className="value">
                {item.value === -1
                  ? '--'
                  : props.provinceName === '全国' && index === 0
                  ? 1117.1 + '万'
                  : item.value + '' + item.measure}
              </div>
              <img src={item.backgroundImg}></img>
              <div className="name">{item.name}</div>
            </div>
          ))}
        </PortNumberOverview>
      </div>
      <div className="port-use-percent">
        {portUsedData.map((item, index) => {
          return (
            <div
              className="data-label"
              key={index}
              onClick={() => {
                props.jump(names[0][index + 2]);
              }}
            >
              <img src={Icon} />
              <div className="data">
                <div className="value">
                  {item.value === -1 ? '--' : item.value + '%'}
                </div>
                <div className="name">{item.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export default OverView;
