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
import { names } from '../components/resource';

export interface BusinessCoverNewProps {
  province: string;
  setCurrentType: (type: string) => void;
  setTarget: (name: string) => void;
}

interface ListItemObj {
  value: number;
  measure: string;
  description: string;
  icon: string;
}
interface DataObj {
  openServiceCommunityNums: ListItemObj;
  openServiceHundredCommunityNums: ListItemObj;
  [key: string]: any;
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 0px;
  margin-left: 20px; //
`;
const CardNumContainer = styled.div`
  margin-top: 40px;
  margin-left: 5px;
  margin-right: auto;

  .row {
    margin-left: 10px; //
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
  flex-direction: column;
  width: 100%;
  flex-wrap: wrap;
  margin-top: 40px;
  margin-left: 30px;

  .item-container {
    display: flex;
    margin-bottom: 34px;

    .icon {
      width: 60px;
      height: 60px;
      margin-right: 5px;
    }

    .info-container {
      display: flex;
      flex-direction: column;
      .name {
        font-weight: 400;
        font-size: 14px;
        color: #00fcff;
        letter-spacing: 0;
        padding-top: 5px;
      }

      .value {
        padding-top: 5px;
        font-family: PMZD, sans-serif;
        font-size: 24px;
        color: #ffffff;
        letter-spacing: 2px;
      }
    }
  }
`;

function Card({ title = '', nums = 0, measure = '', onClick = () => {} }) {
  return (
    <CardNumContainer onClick={onClick}>
      <SectionTitle
        mainTitle={''}
        subTitle={title}
        subTitleColor="#00FCFF"
        noBorder={true}
        style={{ paddingLeft: '0px', paddingBottom: '15px' }}
      ></SectionTitle>

      <div className="row">
        {nums === -1 && <div className="num-container">--</div>}
        {nums !== -1 &&
          nums
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

function BusinessCoverNew(props: BusinessCoverNewProps) {
  const [communitySum, setCommunitySum] = useState<any>(0);
  const [communitySumMeasure, setCommunitySumMeasure] = useState<string>();

  const [ponNums, setPonNums] = useState<any>(0);
  const [ponMeasure, setPonMeasure] = useState<string>();
  useState<string>();

  const [dataList, setDataList] = useState<ListItemObj[]>();
  const [dataListDown, setDataListDown] = useState<ListItemObj[]>();
  const dataMap: DataObj = {
    openServiceCommunityNums: {
      description: '开通业务小区/村数量',
      icon: IconCoverHundred, //1
      measure: '',
      value: -1,
    },

    openServiceHundredCommunityNums: {
      description: '开通业务百户小区/村数量',
      icon: IconCoverThousand, //2
      measure: '',
      value: -1,
    },
  };

  useEffect(() => {
    setCommunitySum(-1);
    setPonNums(-1);

    setDataList(Object.values(dataMap));
    // 注释下列代码，不从接口取数据，显示为--
    getBusinessCover({
      province: props.province === '' ? '全国' : props.province,
    }).then((res: any) => {
      const data = res.data;

      const numAll = convertMeasure(data?.coverCommunityNums, 0)[0] || 0;
      const numAllMeasure = convertMeasure(data?.coverCommunityNums)[1];

      const ponNum = convertMeasure(data?.ponCommunityNums, 0)[0] || 0;
      const ponMeasure = convertMeasure(data?.ponCommunityNums)[1];

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

      setCommunitySum(numAll);
      setCommunitySumMeasure(numAllMeasure);

      setPonNums(ponNum);
      setPonMeasure(ponMeasure);

      setDataList(Object.values(dataMap));
    });
  }, [props.province]);

  return (
    <>
      <CardContainer>
        <Card
          title="资源覆盖小区/村数量"
          nums={communitySum}
          measure={communitySumMeasure}
        ></Card>
        <div>
          <Card
            title="10G PON覆盖小区/村数量"
            nums={ponNums}
            measure={ponMeasure}
          ></Card>
        </div>
      </CardContainer>

      <ListWrapper>
        {dataList &&
          dataList.map((item, index) => (
            <div
              className="item-container"
              style={{ cursor: index === 0 ? 'pointer' : 'auto' }}
              key={item.description}
              onClick={() => {
                if (index === 0) {
                  props.setCurrentType('千/百户小区资源预警');
                  props.setTarget(names[2][1]);
                }
              }}
            >
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
export default BusinessCoverNew;
