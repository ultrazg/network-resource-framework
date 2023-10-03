// 宽带运营支撑组件
import styled from 'styled-components';
import IconPON from '../images/icon/PON.svg';
import IconONU from '../images/icon/ONU.svg';
import IconUpload from '../images/icon/upload.svg';
import IconPrognosis from '../images/icon/prognosis.svg';

import IconBase from '../images/icon/stage.svg';
import { useEffect, useState } from 'react';
import { AnimateNumber } from '@network-resource-vis/animate-number';
import { getBussinessSupport } from '@alpha/api/broardband';

/* eslint-disable-next-line */

// export interface OperateSupportDownProps {}
interface ListItemObj {
  value: number;
  measure: string;
  description: string;
  icon: string;
}

interface DataObj {
  beamSplitter: ListItemObj;
  ponPort: ListItemObj;
  onuPort: ListItemObj;

  [key: string]: any;
}

type PropsType = {
  provinceName: string;
};

const ListWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  width: 360px;
  flex-wrap: wrap; //
`;

const DataLabel = styled.div`
  /* padding-right: 10px; */
  padding-bottom: 30px; //
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon-container {
    width: 64px;
    height: 64px;
    $distances: 10, 15, 20, 25, 30, 35, 40;

    .icon {
      position: absolute;
      object-fit: contain;
      width: 64px;
      height: 64px;
    }

    .circle {
      width: 16px;
      height: 16px;
      background-color: #af8fff;
      border-radius: 50%;
      position: absolute;
      margin-top: 17px;
      margin-left: 15px;
      animation: circleSwim 8s infinite;
      @keyframes circleSwim {
        from {
          opacity: 0;
        }
        50% {
          opacity: 0.4;
          transform: scale(1.2);
        }
        to {
          opacity: 0;
        }
      }
    }
  }

  .label {
    height: 14px;
    margin-top: 24px;
    font-family: PMZD, sans-serif;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 1.75px;
  }

  .num {
    margin-top: 8px;
    height: 30px;
    font-family: FZZD, sans-serif;
    font-size: 24px;
    color: #ffffff;
    z-index: 999;
    letter-spacing: 3.75px;
    ${'-webkit-box-reflect: below 0 -webkit-linear-gradient(transparent, transparent 50%, rgba(255, 255, 255, 0.3));'}
  }

  .base {
    width: 160px;
    height: 67px;
    margin-top: -20px;
    background: url(${IconBase}) center/100% 100% no-repeat;
  }

  .measure {
    height: 14px;
    font-weight: 400;
    font-size: 10px;
    color: #00fcff;
    text-align: center;
    white-space: nowrap;
  }
`;
export function OperateSupport(props: PropsType) {
  const [dataList, setDataList] = useState<Array<ListItemObj>>([]);
  const dataMap: DataObj = {
    beamSplitter: {
      description: '',
      icon: IconUpload,
      measure: '末梢OBD端子上图率',
      value: -1,
    },
    ponPort: {
      description: '',
      icon: IconPON,
      measure: 'PON端口上图率',
      value: -1,
    },
    onuPort: {
      description: '',
      icon: IconONU,
      measure: 'ONU和OBD关联率',
      value: -1,
    },
    prognosisRate: {
      //！！
      description: '',
      icon: IconPrognosis,
      measure: '资源预判成功率',
      value: -1,
    },
  };

  useEffect(() => {
    setDataList(Object.values(dataMap));
    getBussinessSupport({
      province: props.provinceName === '' ? '全国' : props.provinceName,
    }).then((res) => {
      let list: Array<ListItemObj> = [];
      for (let key in dataMap) {
        let temp = dataMap[key];
        if (!res.data[key]) {
          temp.value = -1;
        } else {
          temp.value = res.data[key];
        }
        list.push(temp);
      }
      // 设置 资源预判成功率 为静态值 96.7
      list[3].value = 96.7;
      setDataList([...list]);
    });
  }, [props.provinceName]);
  return (
    <>
      <ListWrapper style={{ marginTop: '24px' }}>
        {dataList.map((item, index) => (
          <DataLabel
            key={`idc-op-${index}`}
            className="animate__animated animate__flipInY"
          >
            <div className="icon-container">
              <img src={item.icon} className="icon" alt="icon" />
              <div className="circle"></div>
            </div>

            <div className="num">
              {item.value === -1 ? (
                '--'
              ) : (
                <>
                  <AnimateNumber
                    fontFamily="PMZD"
                    value={item.value}
                    color="#ffffff"
                    size={24}
                    duration={1000}
                    toFixed={2}
                  ></AnimateNumber>
                  %
                </>
              )}
            </div>
            <div className="base"></div>
            <div className="measure">{item.measure}</div>
          </DataLabel>
        ))}
      </ListWrapper>
    </>
  );
}

export default OperateSupport;
