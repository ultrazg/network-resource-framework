import styled from 'styled-components';
import IconIdle from '../images/icon/idle.png';

import { useEffect, useState } from 'react';
import SectionTitle from '@alpha/app/components/section-title/section-title';
import { getIdleDevice } from '@alpha/api/broardband';
import { convertMeasure } from '@alpha/utils/commFunc';

/* eslint-disable-next-line */

// export interface ResourceDeviceProps {}
interface ListItemObj {
  value: number;
  measure: string;
  icon: string;
  // name: string;
  description: string;
}

interface DataObj {
  doubleOltRatio: ListItemObj; //OLT
  tenGbPonRatio: ListItemObj; //OBD

  [key: string]: any;
}

type PropsType = {
  provinceName: string;
  jump: Function;
};

const Container = styled.div`
  padding-top: 82px; //
  width: 380px;
  height: 271.5px;
  display: flex;
  flex-direction: column;
  margin-left: 35px;
  /* align-items: center; */
`;

const Title = styled.div`
  padding: 12px 0 0 22px;
  .title {
    width: 108px;
    height: 19px;
    font-family: FZZDHJW--GB1-0;
    font-weight: 0;
    font-size: 16px;
    color: #00fcff;
    letter-spacing: 2px;
  }
  .line {
    /* width: 107.59px; */
    height: 4px;
    width: 397.09px;
    transform: scaleX(-1);
    background-image: linear-gradient(
      270deg,
      #65fdff 1%,
      rgba(93, 241, 255, 0) 100%
    );
  }
`;

const ListWrapper = styled.div`
  width: 400px;
  height: 140px;
  display: flex;
  /* justify-content: space-between; */
  div:first-child {
    &:hover {
      cursor: pointer;
    }
  }
`;

const DataLabel = styled.div`
  box-sizing: border-box;
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:last-child {
    margin-left: auto;
  }

  .imgAll {
    display: flex;
    flex-direction: column;
    align-items: center;
    .value {
      position: absolute;
      padding-top: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 28px;
      font-family: PMZD, sans-serif;
      font-size: 24px;
      color: #f3fafd;
      white-space: nowrap;
    }
    .img {
      width: 140px;
      height: 169.43px;
    }
  }
  .description {
    position: absolute; //
    padding-top: 140px; //
    display: flex; //
    flex-direction: column; //
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    color: #29cad6;
    text-align: center;
    width: 140px;
  }
`;

export function ResourceDevice(props: PropsType) {
  const [dataList, setDataList] = useState<Array<ListItemObj>>([]);
  const dataMap: DataObj = {
    doubleOltRatio: {
      icon: IconIdle,
      description: '双上联 OLT 占比',
      value: -1,
      measure: '',
    },
    tenGbPonRatio: {
      icon: IconIdle,

      description: '10G PON端口占比',
      value: -1,
      measure: '',
    },
  };

  useEffect(() => {
    setDataList(Object.values(dataMap));

    // 注释下列代码，不从接口取数据，显示为--
    getIdleDevice({
      province: props.provinceName === '' ? '全国' : props.provinceName,
    }).then((res) => {
      const data = res.data;

      for (const key in data) {
        if (!data[key] && data[key] != 0) {
          data[key] = -1;
        }
        if (dataMap[key]) {
          if (data[key].toString().length >= 5) {
            dataMap[key].value = convertMeasure(data[key], 2)[0].toFixed(2);
            dataMap[key].measure = convertMeasure(data[key])[1];
          } else {
            dataMap[key].value = data[key];
          }
        }
      }
      setDataList(Object.values(dataMap));
    });
  }, [props.provinceName]);

  return (
    <>
      <Container>
        <SectionTitle
          mainTitle={''}
          subTitle={'高价值资源情况'}
          subTitleColor="#00FCFF"
        ></SectionTitle>
        <ListWrapper>
          {dataList.map((item, index) => (
            <DataLabel
              key={`${index}`}
              onClick={() => {
                // 点击跳转地图图层
                if (index === 0) props.jump();
              }}
            >
              <div className="imgAll">
                <div className="value">
                  {item.value === -1 ? (
                    '--'
                  ) : (
                    <div className="value">{item.value + '%'}</div>
                  )}
                </div>
                <img src={item.icon} className="img" alt="icon" />
              </div>
              <div className="description">
                {/* <div>{item.name}</div> */}
                <div>{item.description}</div>
              </div>
            </DataLabel>
          ))}
        </ListWrapper>
      </Container>
    </>
  );
}

export default ResourceDevice;
