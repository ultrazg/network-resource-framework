// 资源总揽组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';

import SectionTitle from '@alpha/app/components/section-title/section-title';

import IconImage from '../images/main-title-icon.png';
import IconShebei1 from '../images/icon-shebei1.png';
import IconShebei2 from '../images/icon-shebei2.png';
import IconShebei3 from '../images/icon-shebei3.png';
import IconShebei4 from '../images/icon-shebei4.png';
import Rate0 from '../images/rate0.png';
import Rate1 from '../images/rate1.png';
import Rate2 from '../images/rate2.png';
import Rate3 from '../images/rate3.png';
import Rate4 from '../images/rate4.png';
import Rate5 from '../images/rate5.png';
import Rate6 from '../images/rate6.png';
import Rate7 from '../images/rate7.png';
import Rate8 from '../images/rate8.png';
import Rate9 from '../images/rate9.png';
import Rate10 from '../images/rate10.png';

import {transformValue} from '../../utils/utils';

const TitleWrapper = styled.div`
  width: 500px;
  height: 36px;
  display: flex;
  align-items: center;
  position: relative;
  img{
    width: 21px;
    height: 28px;
  }
  .mark-list{
    position: absolute;
    align-items: center;
    right: 0;
    color: #fff;
    display: flex;
    font-size: 12px;
    padding: 0;
    li{
      display: flex;
      align-items: center;
      margin: 0 0 0 14px;
      white-space: nowrap;
    }
    i{
      display: block;
      width: 10px;
      height: 10px;
      margin: 0 8px 0 0;
      &.icon1{
        background: #1EDEE4;
      }
      &.icon2{
        background: #1960EB;
      }
    }
  }
`;
const Text = styled.div`
  display: flex;
  align-items: center;
  width: 380px;
  box-sizing: border-box;
  padding-left: 15px;
  margin-left: 8px;
  line-height: 2;
  text-align: left;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 2px;
  font-family: 'FZZD', 'PMZD', 'douyu', 'PuHuiTi-Bold', sans-serif;
  span {
    margin-top: 2px;
  }
  background-image: linear-gradient(
    270deg,
    #d8d8d800 1%,
    #d8d8d830 50%,
    #03064bcc 99%
  );
  border-left: 1px solid;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-image: linear-gradient(to right, rgba(31, 155, 243, 1), rgba(73, 141, 187, 0)) 1;
`;
const ListWrapper = styled.div`
  width: 500px;
  .duankou-list{
    margin: 0 0 0 29px;
    padding: 0;
    li{
      display: flex;
      margin: 16px 0 16px 0;
      .icon{
        display: block;
        width: 40px;
        height: 34px;
        margin: 4px 12px 0 0;
        &.icon1{
          background: url(${IconShebei1}) no-repeat center;
          background-size: 100%;
        }
        &.icon2{
          background: url(${IconShebei2}) no-repeat center;
          background-size: 100%;
        }
        &.icon3{
          background: url(${IconShebei3}) no-repeat center;
          background-size: 100%;
        }
        &.icon4{
          background: url(${IconShebei4}) no-repeat center;
          background-size: 100%;
        }
      }
      .title{
        width: 82px;
        .num{
          font-size: 16px;
          color: #00FCFF;
          line-height: 16px;
          margin: 0;
          font-family: PMZD, sans-serif;
        }
        .name{
          margin: 6px 0 0;
          font-weight: 600;
          font-size: 14px;
          color: #FFFFFF;
          line-height: 20px;
        }
      }
      .progress-box{
        width: 337px;
      }
      .num-line{
        display: flex;
        font-size: 14px;
        line-height: 14px;
        margin: 0 0 7px 0;
        font-family: PMZD, sans-serif;
        div:first-child{
          flex: 1;
        }
      }
      .progress{
        width: 337px;
        height: 10px;
        background: #1960EB;
        span{
          height: 10px;
          display: block;
          background: #00FFC7;
        }
      }
    }
  }
`;
const PortWrapper = styled.div`
  .port-list{
    display: flex;
    margin: 20px 0 0 36px;
    li{
      padding: 0;
      list-style: none;
      margin: 0 11px 0 0;
      .icon{
        width: 119px;
        height: 58px;
        margin-top: -5px;
      }
      .num{
        font-family: PMZD, sans-serif;
        font-size: 24px;
        color: #00FCFF;
        text-align: center;
      }
      .name{
        line-height: 20px;
        font-size: 14px;
        color: #FFFFFF;
        text-align: center;
        margin: 9px 0 0;
      }
    }
  }
`
export function ProvincialResources(props:any) {
  const [sbList, setSbList] = useState<any>([]);
  const [catagery, setCatagery] = useState<any>([]);
  const [name, setName] = useState<any>([]);

  const rateTypes: any = {
    0: <img src={Rate0} className="icon"/>,
    1: <img src={Rate1} className="icon"/>,
    2: <img src={Rate2} className="icon"/>,
    3: <img src={Rate3} className="icon"/>,
    4: <img src={Rate4} className="icon"/>,
    5: <img src={Rate5} className="icon"/>,
    6: <img src={Rate6} className="icon"/>,
    7: <img src={Rate7} className="icon"/>,
    8: <img src={Rate8} className="icon"/>,
    9: <img src={Rate9} className="icon"/>,
    10: <img src={Rate10} className="icon"/>,
  }
  const getImgBg = (list:any) => {
    list.map((item:any) => {
      item.rateTimes = Math.round(item.usedRate/10);
      item.rateHtml = (<img src={Rate0} className="icon"/>)
      item.rateHtml = rateTypes[Number(item.rateTimes)]
    });
    return list
  }
  useEffect(() => {
    if(props.proResourceType && props.proResourceType.length>0){
      setSbList(getImgBg(props.proResourceType))
    }
    else{
      setSbList(getImgBg([{
        total: 0,
        used: 0,
        usedRate: 0,
        portRate: '100G'
      },{
        total: 0,
        used: 0,
        usedRate: 0,
        portRate: '10G'
      },{
        total: 0,
        used: 0,
        usedRate: 0,
        portRate: 'GE'
      },{
        total: 0,
        used: 0,
        usedRate: 0,
        portRate: '其他'
      }]))
    }
    if(props.catagery){
      setCatagery(props.catagery)
    }
    if(props.name){
      setName(props.name)
    }
  }, [props.name]);
  return (
    <>
      <TitleWrapper>
        <img src={IconImage} alt=""></img>
        <Text><span>{catagery}-{name}设备</span></Text>
        <ul className="mark-list">
          <li><i className="icon1"></i><span>已使用端口</span></li>
          <li><i className="icon2"></i><span>未使用端口</span></li>
        </ul>
      </TitleWrapper>
      <ListWrapper>
        <ul className="duankou-list">
        {sbList && sbList.map((item: any, index: number) => {
            return (
              <li key={index}>
                <i className={`icon icon${index + 1}`}></i>
                <div className="title">
                  <p className="num">{transformValue(item.total)}</p>
                  <p className="name">{item.portRate}{item.portRate == '其他' ? '' : '端口'}</p>
                </div>
                <div className="progress-box">
                  <div className="num-line">
                    <div>{item.used}</div>
                    <div>{item.total - item.used}</div>
                  </div>
                  <div className="progress"><span style={{width: item.usedRate + '%'}}></span></div>
                </div>
              </li>
            );
          })
          }
        </ul>
      </ListWrapper>
      <PortWrapper>
        <SectionTitle
            mainTitle={''}
            subTitle={'端口利用率'}
            subTitleColor="#fff"
            style={{
              margin: '25px 0 0 48px',
            }}
          ></SectionTitle>
          <ul className="port-list">
            {sbList && sbList.map((item: any, index: number) => {
              return (
                <li key={index}>
                  <div className="num">{item.usedRate}%</div>
                  {item.rateHtml}
                  <div className="name">{item.portRate}{item.portRate == '其他' ? '' : '端口'}</div>
                </li>
              );
            })
            }
          </ul>
      </PortWrapper>
    </>
  );
}
export default ProvincialResources;
