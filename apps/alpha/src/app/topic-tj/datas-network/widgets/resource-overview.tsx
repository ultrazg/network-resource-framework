// 资源总揽组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';

import SectionTitle from '@alpha/app/modal-view/components/section-title';
import DeviceChart from './device-charts'
import AllWebFlow from './all-webFlow'  //全国左下角数据质量

import IconResource1 from '../images/resource/icon-resource1.png';
import IconResource2 from '../images/resource/icon-resource2.png';
import IconResource3 from '../images/resource/icon-resource3.png';
import IconResource4 from '../images/resource/icon-resource4.png';
import BgCover from '../images/resource/bg-cover.png';
import BgCoverOn from '../images/resource/bg-cover-on.png';
import BgTable from '../images/resource/bg-table.png';
import IconArrow from '../images/resource/icon-arrow.png';
import IconShebei1 from '../images/icon-shebei1.png';
import IconShebei2 from '../images/icon-shebei2.png';
import IconShebei3 from '../images/icon-shebei3.png';
import IconShebei4 from '../images/icon-shebei4.png';

import { getDataNetWorkLeft } from '../../api/datasNetwork';
import Item from 'antd/lib/list/Item';
import {transformValue} from '../../utils/utils';

type PropsType = {
  setResourceData: Function;
  setMapType: Function;
  tabIndex: number;
  changeTab: Function;
  showFlag: number;
  dataIndex: number;
};

const TabMenu = styled.div`
  .menu-box{
    padding: 55px 0 0;
    position: relative;
  }
  .tab-list{
    display: flex;
    position: absolute;
    top: 0;
    left: 35px;
    li{
      width: 82px;
      margin 0 8.5px;
      position: relative;
      padding: 11px 0 0;
      background: url(${BgCover}) no-repeat top center;
      background-size: 100%;
      cursor: pointer;
      .icon{
        display: block;
        margin: 0 auto;
        width: 35px;
        height: 41px;
        &.icon1{
          background: url(${IconResource1}) no-repeat center;
          background-size: 100%;
        }
        &.icon2{
          background: url(${IconResource2}) no-repeat center;
          background-size: 100%;
        }
        &.icon3{
          background: url(${IconResource3}) no-repeat center;
          background-size: 27px;
        }
        &.icon4{
          background: url(${IconResource4}) no-repeat center;
          background-size: 100%;
        }
      }
      .num{
        line-height: 22px;
        font-family: PMZD, sans-serif;
        font-size: 22px;
        color: #FFFFFF;
        text-align: center;
        margin: 19px 0 0;
        white-space: nowrap;
      }
      .name{
        line-height: 20px;
        font-size: 14px;
        color: #52B9FF;
        text-align: center;
        margin: 14px 0 0;
      }
      &.on{
        &:before{
          content: '';
          display: block;
          width: 11px;
          height: 10px;
          background: url(${IconArrow}) no-repeat top center;
          background-size: 100%;
          position: absolute;
          top: 29px;
          left: -11px;
        }
        &:after{
          content: '';
          display: block;
          width: 11px;
          height: 10px;
          background: url(${IconArrow}) no-repeat top center;
          background-size: 100%;
          position: absolute;
          top: 29px;
          right: -11px;
          transform: rotate(180deg);
        }
        background: url(${BgCoverOn}) no-repeat top center;
        background-size: 100%;
        .name{
          color: #00FCFF;
        }
      }
    }
  }
`;
const TitleWrapper = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  margin: 24px 0 0;
  img{
    width: 21px;
    height: 28px;
  }
`;
const Text = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
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
  .device-box{
    // margin: 20px 0 0;
    position: relative;
    padding: 16px 0 0;
    .info{
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      .name{
        line-height: 20px;
        font-size: 14px;
        color: #52B9FF;
        margin: 3px 0 0;
      }
      .num{
        line-height: 18px;
        font-weight: 400;
        font-size: 16px;
        color: #fff;
        font-family: PMZD, sans-serif;
      }
    }
    .table-info{
      position: absolute;
      left: 335px;
      font-size: 12px;
      color: #00B6FD;
      bottom: -5px;
    }
  }
  .duankou-list{
    padding: 0;
    height: 182px;
    li{
      display: flex;
      margin: 0 0 10px 0;
      .icon{
        display: block;
        width: 31px;
        height: 26px;
        margin: 4px 14px 0 0;
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
        width: 67px;
        .num{
          font-family: PangMenZhengDao, sans-serif;
          font-size: 14px;
          color: #00FCFF;
          line-height: 14px;
          margin: 0;
          font-family: PMZD, sans-serif;
        }
        .name{
          margin: 2px 0 0;
          font-weight: 600;
          font-size: 12px;
          color: #FFFFFF;
          line-height: 17px;
        }
      }
      .progress-box{
        width: 224px;
        margin: 20px 0 0;
      }
      .progress{
        height: 10px;
        background: #16306F;
        span{
          height: 10px;
          display: block;
          background: #00FFC7;
        }
      }
      .percent{
        width: 58px;
        text-align: center;
        line-height: 17px;
        margin: 16px 0 0;
        font-size: 12px;
      }
    }
  }
`;
export function ProvincialResources(props: PropsType) {
  // const [tabIndex, setTabIndex] = useState<number>(0);
  const [tabList, setTabList] = useState<any>([]);
  const [sbList, setSbList] = useState<any>([]);
  const [deviceList, setDevicebList] = useState<any>([]);
  const getDeviceList = (list:any) => {
    let newList:any = [];
    if(list && list.length>0){
      let colorList = ['#30FFAE','#34D1FF','#258BFF','#FF9F3F','rgb(73,108,229)']
      list.map((item:any,index:any) => {
        let newItem:any = {};
        newItem.label = item.resType;
        newItem.value = (item.deviceRate || 0)-0;
        newItem.counts = item.counts;
        newItem.color = colorList[index];
        newList.push(newItem);
      });
    }
    return newList;
  }
  const changeTab = (index:number) => {
    // if((props.showFlag == 0 && props.dataIndex == 1) || (props.showFlag == 1 && props.dataIndex == 1 && index == 0))return;
    if(props.dataIndex == 1)return;
    props.changeTab(index);
    // props.setResourceData(tabList[index]);
    // setSbList(tabList[index].protList);
    // setDevicebList(getDeviceList(tabList[index].deviceList));
  }
  useEffect(() => {
    //请求数据
    if(tabList.length <= 0){
      getDataNetWorkLeft({
        province: ''
      }).then((res: any) => {
        if (res.code == '200' && res.data) {
          let lists = [];
          for (const key in res.data) {
            if (res.data[key]) {
              let item = res.data[key];
              item.name = key=='1'?'169骨干网':key=='2'?'城域网':key=='3'?'IPRAN':'智能城域网';
              lists.push(item);
            }
          }
          //初始化
          props.setResourceData(lists[0]);
          setSbList(lists[0].protList);
          setDevicebList(getDeviceList(lists[0].deviceList));
          setTabList(lists);
        }
      });
    }
    else{
      props.setResourceData(tabList[props.tabIndex]);
      setSbList(tabList[props.tabIndex].protList);
      setDevicebList(getDeviceList(tabList[props.tabIndex].deviceList));
    }
  }, [props.tabIndex]);
  return (
    <>
      <SectionTitle
        title="资源总览"
        style={{ width: '400px', margin: '0 0 30px 30px' }}
        fn={() => props.setMapType(0)}
      ></SectionTitle>
      <TabMenu>
        <div className="menu-box">
          <img style={{ width: '464px' }} src={BgTable} alt="" />
          <ul className="tab-list">
            {tabList && tabList.map((item: any, index: number) => {
              return (
                <li key={index} className={`${props.tabIndex == index ? 'on' : ''}`} onClick={()=>changeTab(index)}>
                  <i className={`icon icon${index + 1}`}></i>
                  <div className="num">{transformValue(item.deviceCounts)}</div>
                  <div className="name">{item.name}</div>
                  <div className="cover"></div>
                </li>
              );
            })
            }
          </ul>
        </div>
      </TabMenu>
      <DeviceChart deviceList={deviceList}></DeviceChart>
      <ListWrapper>
        {sbList && <div className="device-box">
          <div className="table-info">端口利用率</div>
        </div>}
        <ul className="duankou-list">
          {sbList.length>0 && sbList.map((item: any, index: number) => {
            return (
              <li key={index}>
                <i className={`icon icon${index + 1}`}></i>
                <div className="title">
                  <p className="num">{transformValue(item.total)}</p>
                  <p className="name">{item.portRate}端口</p>
                </div>
                <div className="progress-box">
                  <div className="progress"><span style={{ width: item.usedRate + '%' }}></span></div>
                </div>
                <div className="percent">{item.usedRate}%</div>
              </li>
            );
          })
          }
        </ul>
      </ListWrapper>
      <AllWebFlow tabIndex={props.tabIndex}></AllWebFlow>
    </>
  );
}
export default ProvincialResources;
