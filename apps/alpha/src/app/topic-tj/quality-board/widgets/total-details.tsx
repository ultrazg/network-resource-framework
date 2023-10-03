import { useEffect, useState } from 'react';
import styled from 'styled-components';
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import { getQualityLeftData } from '../../api/quality-board';
import bgImg1 from '../images/quality-icon02.png';
import bgImg2 from '../images/quality-icon03.png';
import bgImg3 from '../images/quality-icon04.png';
import dateRateBg from '../images/date-rate-bg.png';
import arrowUp from '../images/arrow-up.png';
import arrowDown from '../images/arrow-down.png';
import loadingEnd1 from '../images/loading-end01.png';
import loadingEnd2 from '../images/loading-end02.png';

const ListWrapper = styled.div`
  .data-total-top{
    align-items: center;
    display: flex;
    flex-wrap: nowrap;
    .top-cont{
      flex:1;
      text-align: center;
      .icon{
        margin: 0 auto;
        width: 165px;
        height: 152px;
      }
      .icon01{
        background: url(${bgImg1}) no-repeat;
        background-size: cover;
      }
      .icon02{
        background: url(${bgImg2}) no-repeat;
        background-size: cover;
      }
      .icon03{
        background: url(${bgImg3}) no-repeat;
        background-size: cover;
      }
      .num{
        margin: -20px 0 16px;
        font-size: 14px;
        color:#FFF;
        span{
          display: inline-block;
          margin-right: 5px;
          color: #00FFFF;
          font-family: CAI300, sans-serif;
          font-style: italic;
          font-size: 30px;
          font-weight: 400; 
        }
      }
      .text{
        font-size: 16px;
        font-weight: 400;
        color: #fff;
        span{
          padding:6px 10px;
          display: inline-block;
          background: #05426E;
        }
      }
    }
  }
`;
  const ListWrapperDown = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content:center;
  align-items: center;
  position: relative;
  width: 500px;
  .data-qua-box{
    margin: 15px 5px;
    position: relative;
    box-sizing: border-box;
    width: 154px;
    height: 154px;
    background: url(${dateRateBg}) no-repeat center;
    background-size: cover;
    padding:24px 10px;
    &:nth-of-type(4) {
      position: absolute;
      top: 194px;
      left: 20px;
    }
    &:nth-of-type(5) {
      position: absolute;
      top: 194px;
      left: 177px;
    }
    &:nth-of-type(6) {
      position: absolute;
      top: 194px;
      left: 339px;
    }
    &:nth-of-type(7) {
      position: absolute;
      top: 385px;
      left: 40px;
    }
    &:nth-of-type(8) {
      position: absolute;
      top: 385px;
      left: 197px;
    }
    &:nth-of-type(9) {
      position: absolute;
      top: 385px;
      left: 359px;
    }
  }
  .rate-box{
    // margin-bottom: 14px;
    .top{
      line-height: 1;
    }
    .name{
      font-weight: 500;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 16px;
      color: #00E6FF;
    }
    .num {
      color: #fff;
      font-size: 18px;
      margin-left: 7px;
      font-weight: 700;
      font-family: "CAI300", sans-serif;
      font-style: italic;
    }
    .name01 {
      color: #F1C344;
    }
    .num-small{
      color: #00E6FF;
      margin-left: 0;
      font-size: 14px;
      font-weight: 500;
    }
    .bottom{
      display: flex;
      align-items: center;
    }
    .raise {
      display: inline-block;
      width: 8px;
      height: 12px;
      background: url(${arrowUp}) no-repeat center;
      background-size: 100%;
      margin-left: 5px;
      &.down {
        background: url(${arrowDown}) no-repeat center;
        background-size: 100%;
      }
    }
    .rate-loading{
      position: relative;
      display: inline-block;
      width:58%;
      height: 6px;
      background: #0B2258;
      border-radius: 10px;
      .rate-num{
        height: 6px;
        background: linear-gradient(90deg, #6ECFF5 0%, #177AAD 80.72%);
        border-radius: 10px;
      }
      .rate-num01{
        background: linear-gradient(90deg, #F3D891 0%, #E3AF58 80.72%);
      }
      .loading-end{
        top:0;
        bottom:0;
        margin: auto 0;
        position: absolute;
        width: 10px;
        height: 10px;
        background: url(${loadingEnd1}) no-repeat center;
        background-size: 100%;
      }
      .loading-end01{
        background: url(${loadingEnd2}) no-repeat center;
        background-size: 100%;
      }
    }
  }
  .widthAll{
      padding-top:14%;
      .top{
        margin-bottom: 18px;
      }
   }
  .info-name{
    position: absolute;
    left: 0;
    right: 0;
    bottom:8px;
    margin: 0 auto;
    color: #fff;
    text-align: center;
    font-size: 18px;
    margin-left: 7px;
    font-weight: 400;
    font-family: "PangMenZhengDao", sans-serif;
  }
`;
export function OverView() {
  const [topLIstData, setTopLIstData] = useState<any>([]);
  const [qualityList, setQualityList] = useState<any>([]);
  useEffect(() => {
    //请求数据
    getQualityLeftData({}).then((res:any) => {
      setTopLIstData(res.data.zhili);
      setQualityList(res.data.shuju);
    });
  }, []);
  return (
    <>
      <ListWrapper>
        <div className="data-total-top">
          {topLIstData && topLIstData.map((item: any, index: number) => {
            return (
              <div className="top-cont" key={item.name}>
                <div className={`icon icon0${index + 1}`}></div>
                <p className="num"><span>{item.value}</span>个</p>
                <p className="text"><span>{item.name}</span></p>
              </div>
            );
          })
          }
        </div>
      </ListWrapper>
      <SectionTitle
        title="数据质量情况"
        style={{ width: '400px', margin: '50px 0 30px' }}
      ></SectionTitle>
      <ListWrapperDown>
        {qualityList && qualityList.map((item: any, index: number) => {
          return (
            <div key={index} className="data-qua-box">
              <div className={`rate-box cpmplete-rate ${!item.accuracyRate && !item.accuracyIncrease ? 'widthAll' : ''}`}>
                <div className="top">
                  <span className="name">完整率</span>
                  {item.completeRateIncrease && <span className="raise up"></span>}
                  {item.completeRateIncrease && <span className="num num-small">{item.completeRateIncrease}%</span>}
                </div>
                {item.completeRate &&
                  <div className="bottom">
                    <div className="rate-loading">
                      <i className="loading-end" style={{ left: (item.completeRate - 5) + '%' }}></i>
                      <div style={{ width: item.completeRate + '%' }} className="rate-num"></div>
                    </div>
                    <span className="num">{item.completeRate}%</span>
                  </div>
                }
              </div>
              <div className={`rate-box exact-rate ${!item.completeRate && !item.completeRateIncrease ? 'widthAll' : ''}`}>
                <div className="top">
                  <span className="name name01">准确率</span>
                  {item.accuracyIncrease && <span className="raise up"></span>}
                  {item.accuracyIncrease && <span className="num num-small">{item.accuracyIncrease}%</span>}
                </div>
                {item.accuracyRate &&
                  <div className="bottom">
                    <div className="rate-loading">
                      <i className="loading-end loading-end01" style={{ left: (item.accuracyRate - 5) + '%' }}></i>
                      <div className="rate-num rate-num01" style={{ width: item.accuracyRate + '%' }}></div>
                    </div>
                    <span className="num">{item.accuracyRate}%</span>
                  </div>
                }
              </div>
              <div className="info-name">{item.name}</div>
            </div>
          );
        })
        }
      </ListWrapperDown>
    </>
  );
}

export default OverView;
