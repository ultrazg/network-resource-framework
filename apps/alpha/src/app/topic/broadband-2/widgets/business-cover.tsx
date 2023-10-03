// 业务覆盖组件
import { DEVICE_TYPE_CODE } from '@alpha/utils/constants';
import { AnimateNumber } from '@network-resource-vis/animate-number';
import styled from 'styled-components';
import NumBg from '../images/card.svg';
import { Key, useEffect, useState } from 'react';
import IconBlockHundred from '../images/icon/block-hundred.svg';
import IconBlockThousand from '../images/icon/block-thousand.svg';
import IconCoverageBlock from '../images/icon/coverage-block.svg';
import IconCoverageHundred from '../images/icon/coverage-hundred.svg';
import IconCoverageThousand from '../images/icon/coverage-thousand.svg';
import IconCoverThousand from '../images/icon/cover-thousand.svg';
import IconDoubleCoverage from '../images/icon/double-coverage.svg';
import IconCoverHundred from '../images/icon/cover-hundred.svg';
import IconDoubleHundred from '../images/icon/double-hundred.svg';
import IconDoubleThousand from '../images/icon/double-thousand.svg';
import { convertMeasure } from '@alpha/utils/commFunc';
import { getBusinessCover } from '@alpha/api/broardband';
import SectionTitle from '@alpha/app/components/section-title/section-title';

export interface BusinessCoverProps {
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
  //   coverCommunityNums: ListItemObj;
  coverHundredCommunityNums: ListItemObj;
  coverThousandCommunityNums: ListItemObj;
  //   doubleUplinkConverCommunityNums: ListItemObj;
  //   doubleUplinkConverHundredCommunityNums: ListItemObj;
  //   doubleUplinkConverThousandCommunityNums: ListItemObj;

  [key: string]: any;
}
interface DataDownObj {
  doubleUplinkConverCommunityNums: ListItemObj;
  doubleUplinkConverHundredCommunityNums: ListItemObj;
  doubleUplinkConverThousandCommunityNums: ListItemObj;

  [key: string]: any;
}
const CardContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 0px;
  margin-left: 30px;
`;
const CardNumContainer = styled.div`
  margin-top: 24px;
  margin-left: 5px;
  margin-right: auto;

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
    .num-measure {
      font-family: FZZDHJW--GB1-0;
      font-weight: 0;
      font-size: 16px;
      color: #ffffff;
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
      margin-right: 5px;
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
const ListWrapperDown = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 25px;
  margin-left: 30px;

  .item-container {
    width: 30%;
    display: flex;
    margin-bottom: 34px;

    .icon {
      width: 40px;
      height: 40px;
      margin-right: 5px;
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

function Card({ title = '', nums = 0, measure = '' }) {
  return (
    <CardNumContainer>
      <div className="sub-title">{title}</div>
      <div className="row">
        {nums
          .toString()
          .split('')
          .map((item: any, index: Key | null | undefined) => (
            <div className="num-container" key={index}>
              <AnimateNumber
                value={Number(item)}
                color="#fff"
                size={32}
                duration={2000}
                fontFamily="CAI300"
                toFixed={0}
              ></AnimateNumber>
            </div>
          ))}
        {measure && (
          <div className="num-container">
            <div className="num-measure">{measure}</div>
          </div>
        )}
      </div>
    </CardNumContainer>
  );
}

function BusinessCover(props: BusinessCoverProps) {
  const [buildingSum, setBuildingSum] = useState<any>(0);
  const [buildSumMeasure, setBuildSumMeasure] = useState<string>();

  const [coverNums, setCoverNums] = useState<any>(0);
  const [coverMeasure, setCoverMeasure] = useState<string>();
  useState<string>();

  const [dataList, setDataList] = useState<ListItemObj[]>();
  const [dataListDown, setDataListDown] = useState<ListItemObj[]>();
  const dataMap: DataObj = {
    hundredCommunityNums: {
      description: '百户小区总数',
      icon: IconBlockHundred,
      measure: '',
      value: -1,
    },
    coverHundredCommunityNums: {
      description: '覆盖百户小区总数',
      icon: IconCoverHundred,
      measure: '',
      value: -1,
    },
    thousandCommunityNums: {
      description: '千户小区总数',
      icon: IconBlockThousand,
      measure: '',
      value: -1,
    },

    coverThousandCommunityNums: {
      description: '覆盖千户小区总数',
      icon: IconCoverThousand,
      measure: '',
      value: -1,
    },
  };
  const dataMapDown: DataDownObj = {
    doubleUplinkConverCommunityNums: {
      description: '小区总数',
      icon: IconDoubleCoverage,
      measure: '',
      value: -1,
    },
    doubleUplinkConverHundredCommunityNums: {
      description: '百户小区总数',
      icon: IconCoverageHundred,
      measure: '',
      value: -1,
    },
    doubleUplinkConverThousandCommunityNums: {
      description: '千户小区总数',
      icon: IconCoverageThousand,
      measure: '',
      value: -1,
    },
  };

  useEffect(() => {
    setBuildingSum(23456);
    setCoverNums(12345);

    setDataList(Object.values(dataMap));
    setDataListDown(Object.values(dataMapDown));
    getBusinessCover({
      province: props.province === '' ? '全国' : props.province,
    }).then((res: any) => {
      const data = res.data;

      const numAll = convertMeasure(data?.communitySumNums, 0)[0] || 0;
      const buildSumMeasure = convertMeasure(data?.communitySumNums)[1];

      const coverNum = convertMeasure(data?.coverCommunityNums, 0)[0] || 0;
      const coverMeasure = convertMeasure(data?.coverCommunityNums)[1];

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

      for (const key in data) {
        if (!data[key] && data[key] != 0) {
          data[key] = -1;
        }
        if (dataMapDown[key]) {
          if (data[key].toString().length > 5) {
            dataMapDown[key].value = convertMeasure(data[key], 2)[0];
            dataMapDown[key].measure = convertMeasure(data[key])[1];
          } else {
            dataMapDown[key].value = data[key];
          }
        }
      }

      setBuildingSum(numAll);
      setBuildSumMeasure(buildSumMeasure);

      setCoverNums(coverNum);
      setCoverMeasure(coverMeasure);

      setDataList(Object.values(dataMap));
      setDataListDown(Object.values(dataMapDown));
    });
  }, [props.province]);

  return (
    <>
      <CardContainer>
        <Card
          title="小区总数"
          nums={buildingSum}
          measure={buildSumMeasure}
        ></Card>
        <Card
          title="覆盖小区总数"
          nums={coverNums}
          measure={coverMeasure}
        ></Card>
      </CardContainer>

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

      <SectionTitle
        mainTitle={''}
        subTitleColor="#00FCFF"
        subTitle={''}
        style={{ paddingLeft: '30px' }}
      ></SectionTitle>

      <ListWrapperDown>
        {dataListDown &&
          dataListDown.map((item) => (
            <div className="item-container" key={item.description}>
              <img className="icon" src={item.icon} alt="icon"></img>
              <div className="info-container">
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
                <div className="name">双上联覆盖</div>
                <div className="name">{item.description}</div>
              </div>
            </div>
          ))}
      </ListWrapperDown>
    </>
  );
}
export default BusinessCover;
