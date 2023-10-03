// 业务覆盖组件
import { DEVICE_TYPE_CODE } from '@alpha/utils/constants';
import { AnimateNumber } from '@network-resource-vis/animate-number';
import styled from 'styled-components';
import NumBg from '../images/card.svg';
import { useEffect, useState } from 'react';
import IconBlockHundred from '../images/icon/block-hundred.svg';
import IconBlockThousand from '../images/icon/block-thousand.svg';
import IconCoverageBlock from '../images/icon/coverage-block.svg';
import IconCoverageHundred from '../images/icon/coverage-hundred.svg';
import IconCoverageThousand from '../images/icon/coverage-thousand.svg';
import IconDoubleCoverage from '../images/icon/double-coverage.svg';
import IconDoubleHundred from '../images/icon/double-hundred.svg';
import IconDoubleThousand from '../images/icon/double-thousand.svg';
import { convertMeasure } from '@alpha/utils/commFunc';
import { getBusinessCoverage } from '@alpha/api/broardband';

export interface BusinessCoverageProps {
  province: string;
}

interface ListItemObj {
  value: number;
  measure: string;
  description: string;
  icon: string;
}
interface DataObj {
  hundredCommunityNums: ListItemObj;
  thousandCommunityNums: ListItemObj;
  coverCommunityNums: ListItemObj;
  coverHundredCommunityNums: ListItemObj;
  coverThousandCommunityNums: ListItemObj;
  doubleUplinkConverCommunityNums: ListItemObj;
  doubleUplinkConverHundredCommunityNums: ListItemObj;
  doubleUplinkConverThousandCommunityNums: ListItemObj;

  [key: string]: any;
}

const CardNumContainer = styled.div`
  margin-top: 24px;
  margin-left: 30px;

  .sub-title {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 10px;
    color: #ffffff;
    letter-spacing: 1px;
  }

  .num-container {
    background: url(${NumBg}) center center no-repeat;
    background-size: 100% 100%;
    width: 32px;
    height: 43px;
    margin-right: 4px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    span {
      text-align: center;
      vertical-align: center;
      line-height: 43px;
    }
  }
`;
const ListWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 40px;
  margin-left: 30px;

  .item-container {
    width: 50%;
    display: flex;
    margin-bottom: 34px;

    .icon {
      width: 40px;
      height: 40px;
    }

    .info-container {
      .name {
        font-size: 14px;
        color: #00fcff;
      }

      .value {
        font-family: PMZD, sans-serif;
        font-size: 20px;
        color: #ffffff;
        letter-spacing: 1.67px;
      }
    }
  }
`;

function BusinessCoverage(props: BusinessCoverageProps) {
  const [buildingSum, setBuildingSum] = useState(0);
  const [dataList, setDataList] = useState<ListItemObj[]>();
  const dataMap: DataObj = {
    hundredCommunityNums: {
      description: '百户小区总数',
      icon: IconBlockHundred,
      measure: '',
      value: -1,
    },
    thousandCommunityNums: {
      description: '千户小区总数',
      icon: IconBlockThousand,
      measure: '',
      value: -1,
    },
    coverCommunityNums: {
      description: '覆盖小区总数',
      icon: IconCoverageBlock,
      measure: '',
      value: -1,
    },
    coverHundredCommunityNums: {
      description: '覆盖百户小区总数',
      icon: IconCoverageHundred,
      measure: '',
      value: -1,
    },
    coverThousandCommunityNums: {
      description: '覆盖千户小区总数',
      icon: IconCoverageThousand,
      measure: '',
      value: -1,
    },
    doubleUplinkConverCommunityNums: {
      description: '双上联覆盖小区总数',
      icon: IconDoubleCoverage,
      measure: '',
      value: -1,
    },
    doubleUplinkConverHundredCommunityNums: {
      description: '双上联覆盖百户小区总数',
      icon: IconCoverageHundred,
      measure: '',
      value: -1,
    },
    doubleUplinkConverThousandCommunityNums: {
      description: '双上联覆盖千户小区总数',
      icon: IconCoverageThousand,
      measure: '',
      value: -1,
    },
  };
  useEffect(() => {
    setBuildingSum(2517676);

    setDataList(Object.values(dataMap));
    getBusinessCoverage({
      province: props.province === '' ? '全国' : props.province,
    }).then((res: any) => {
      const data = res.data;
      const numAll = data?.communitySumNums || 0;
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
      setBuildingSum(numAll);
      setDataList(Object.values(dataMap));
    });
  }, [props.province]);
  return (
    <>
      <CardNumContainer>
        <div className="sub-title">小区总数</div>
        <div className="row">
          {buildingSum
            .toString()
            .split('')
            .map((item, index) => (
              <div className="num-container" key={index}>
                <AnimateNumber
                  value={Number(item)}
                  color="#fff"
                  size={32}
                  duration={1000}
                  fontFamily="CAI300"
                  toFixed={0}
                ></AnimateNumber>
              </div>
            ))}
        </div>
      </CardNumContainer>
      <ListWrapper>
        {dataList &&
          dataList.map((item) => (
            <div className="item-container" key={item.description}>
              <img className="icon" src={item.icon} alt="icon"></img>
              <div className="info-container">
                <div className="name">{item.description}</div>
                <div className="value">
                  {item.value === -1 ? (
                    '--'
                  ) : (
                    <>
                      <AnimateNumber
                        toFixed={2}
                        value={convertMeasure(item.value)[0]}
                        color={'#ffffff'}
                        size={20}
                        duration={1000}
                      />
                      {convertMeasure(item.value)[1] + item.measure}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
      </ListWrapper>
    </>
  );
}
export default BusinessCoverage;
