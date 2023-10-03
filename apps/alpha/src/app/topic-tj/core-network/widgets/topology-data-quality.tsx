// 设备详情组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';

import SectionTitle from './section-title';

import IconQuality1 from '../images/icon-quality01.png';
import IconQuality2 from '../images/icon-quality02.png';
import IconQuality3 from '../images/icon-quality03.png';
import IconQuality4 from '../images/icon-quality04.png';
import IconQuality5 from '../images/icon-quality05.png';
import IconQuality6 from '../images/icon-quality06.svg';
import BgEdge from '../images/bg-edge2.png';

import { resourceQualityDetails } from '../../api/coreNetwork';
import { transformValue } from '../../utils/utils';
const ProgressWrapper = styled.div`
    margin: 22px 0 0 37px;
    img{
      width: 72px;
    }
    .bg{
      opacity: 0.5;
      height: 120px;
      border: 1px solid;
      box-sizing: border-box;
      background: linear-gradient(270deg, rgba(2,144,224,0) 0%, rgba(2,144,224,0.2) 100%);
      border-image: linear-gradient(to top left,rgba(2, 144, 224, 0.35), rgba(2, 144, 224, 0),rgba(2, 144, 224, 0.35)) 1;
    }
    .edge{
      position: absolute;
      top: 36px;
      width: 3px;
      height: 51px;
      background: url(${BgEdge}) no-repeat center;
      background-size: 100%;
      &.edge2{
        transform: rotate(180deg);
        right: 0;
      }
    }
    .top-box{
      width: 462px;
      height: 120px;
      position: relative;
      .info-box{
        position: absolute;
        left: 46px;
        top: 23px;
        display: flex;
        align-items: center;
        .left{
          margin: 0 0 0 14px;
          width: 105px;
        }
        .name{
          font-size: 14px;
          color: #fff;
        }
        .num{
          color: rgba(0,254,255,1);
          font-size: 18px;
          font-family: PMZD;
          margin: 10px 0 0;
        }
        .line{
          width: 1px;
          height: 77px;
          background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1),rgba(255, 255, 255, 0));
          opacity: 0.5;
          margin: 0 40px 0 0;
        }
        .right{
          width: 170px;
          margin: 0 0 0 25px;
        }
      }
    }
    .tip-line{
      display: flex;
      width: 319px;
      .sec{
        font-size: 14px;
        color: #fff;
      }
      .percent{
        flex: 1;
        color: rgba(47,196,255,1);
        font-size: 18px;
        font-family: PMZD;
        text-align: right;
        &.percent2{
          color: rgba(51,120,255,1);
          font-size: 14px;
        }
        &.percent3{
          color: rgba(255,180,31,1);
          font-size: 14px;
        }
      }
    }
    .progress{
      width: 100%;
      height: 9px;
      position: relative;
      span{
        display: block;
        height: 9px;
        background: linear-gradient(270deg, rgba(47,196,255,1) 0%, rgba(47,196,255,0) 100%);
      }
      .dot{
        width: 7px;
        height: 7px;
        border: 3px solid #fff;
        background: rgba(47,196,255,1);
        border-radius: 100%;
        position: absolute;
        top: -2px;
        margin: 0 0 0 -6.5px;
      }
    }
    .card-box{
      margin: 20px 0 0;
      position: relative;
      width: 462px;
      height: 70px;
      img{
        width: 60px;
      }
      .percent2{
        color: #F0A612;
      }
      .bg{
        height: 70px;
      }
      .edge{
        height: 34px;
        top: 18px;
      }
      .info-box{
        position: absolute;
        left: 25px;
        top: 6px;
        right: 24px;
        display: flex;
        align-items: center;
      }
      .right{
        flex: 1;
        margin: 0 0 0 25px;
      }
      .progress-box{
        width: 319px;
        height: 22px;
        padding: 6px 0 0;
        margin: 5px 0 0;
        box-sizing: border-box;
        background: linear-gradient(to left, rgba(0,119,255,0.1) 0%, rgba(0,119,255,0) 100%) right;
      }
      .progress2{
        span{
          background: linear-gradient(270deg, rgba(51,120,255,1) 0%, rgba(51,120,255,0) 100%);
        }
        .dot{
          background: rgba(51,120,255,1);
        }
      }
      .progress3{
        span{
          background: linear-gradient(270deg, rgba(255,180,31,1) 0%, rgba(255,180,31,0) 100%);
        }
        .dot{
          background: rgba(255,180,31,1);
        }
      }
    }
  `
export function ProvincialResources(props:any) {
  const [qualityData, setQualityData] = useState<any>(null);
  const [rate, setRate] = useState<number>(0);
  const [dataInfo,setDataInfo] = useState<any>('');
  
  const getRateData = (data:any) => {
    if(data.map){
      for (let key in data.map) {
        if(key == props.networkElement){
          setDataInfo(data.map[key])
        }
      }
    }
  }
  useEffect(() => {
    //请求数据
    if(!qualityData){
      resourceQualityDetails({}).then((res: any) => {
        if (res.code == '200' && res.data) {
          setQualityData(res.data);
          getRateData(res.data);
        }
      });
    }
    else if(props.networkElement && qualityData){
      getRateData(qualityData);
    }
  }, [props.networkElement]);
  return (
    <>
      <SectionTitle
          mainTitle={'核心网数据质量'}
          subTitle={''}
          mainTitleColor="#00FAF9"
          style={{
            width: '560px'
          }}
        ></SectionTitle>
        {dataInfo && 
          <ProgressWrapper>
            <div className="top-box">
              <div className="bg"></div>
              <div className="edge"></div>
              <div className="edge edge2"></div>
              <div className="info-box">
                <img src={IconQuality1} alt=""/>
                <div className="left">
                  <div className="name">稽核总量</div>
                  <div className="num">{ dataInfo.totalNum }</div>
                </div>
                <div className="line"></div>
                <img src={IconQuality6} alt=""/>
                <div className="left">
                  <div className="name">达标数</div>
                  <div className="num">{ dataInfo.successNum }</div>
                </div>
              </div>
            </div>
            <div className="card-box">
              <div className="bg"></div>
              <div className="edge"></div>
              <div className="edge edge2"></div>
              <div className="info-box">
                  <img src={IconQuality2} alt=""/>
                  <div className="right">
                    <div className="tip-line">
                      <div className="sec">达标率</div>
                      {dataInfo.successRate && <div className="percent percent3">{dataInfo.successRate}%</div>}
                    </div>
                    <div className="progress-box">
                      <div className="progress progress3">
                        {dataInfo.successRate && <span style={{width: dataInfo.successRate + '%'}}></span>}
                        <div className="dot" style={{left: dataInfo.successRate + '%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="card-box">
              <div className="bg"></div>
              <div className="edge"></div>
              <div className="edge edge2"></div>
              <div className="info-box">
                  <img src={IconQuality4} alt=""/>
                  <div className="right">
                    <div className="tip-line">
                      <div className="sec">完整率</div>
                      {dataInfo.completeRate && <div className="percent percent2">{dataInfo.completeRate}%</div>}
                    </div>
                    <div className="progress-box">
                      <div className="progress progress2">
                        {dataInfo.completeRate && <span style={{width: dataInfo.completeRate + '%'}}></span>}
                        <div className="dot" style={{left: dataInfo.completeRate + '%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="card-box">
              <div className="bg"></div>
              <div className="edge"></div>
              <div className="edge edge2"></div>
              <div className="info-box">
                  <img src={IconQuality5} alt=""/>
                  <div className="right">
                    <div className="tip-line">
                      <div className="sec">准确率</div>
                      { dataInfo.exactRate && <div className="percent percent2">{ dataInfo.exactRate}%</div>}
                    </div>
                    <div className="progress-box">
                      <div className="progress progress2">
                        { dataInfo.exactRate && <span style={{width:  dataInfo.exactRate + '%'}}></span>}
                        <div className="dot" style={{left:  dataInfo.exactRate + '%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </ProgressWrapper>
        }
    </>
  );
}
export default ProvincialResources;
