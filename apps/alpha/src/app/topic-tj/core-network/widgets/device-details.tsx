// 设备详情组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';

import SectionTitle from './section-title';

import IconDevice1 from '../images/icon-device01.png';
import IconDevice2 from '../images/icon-device02.png';
import IconDevice3 from '../images/icon-device03.png';
import BgEdge from '../images/bg-edge.png';

import { getCoreNetWorkDevice } from '../../api/coreNetwork';
import { coreList } from '../static/config';
import { transformValue } from '../../utils/utils';
const DeviceWrapper = styled.div`
  height: 200px;
  .top-box{
    margin: 25px 0 0 30px;
    position: relative;
    width: 390px;
    &.top-top2{
      margin: 19px 0 0 30px;
    }
    .bg{
      opacity: 0.1;
      width: 390px;
      height: 91px;
      background: linear-gradient(90deg, rgba(0,124,255,0.03) 0%, rgba(0,124,255,0.8) 50%, rgba(0,124,255,0.03) 100%);
    }
    .edge{
      position: absolute;
      top: 17px;
      width: 21px;
      height: 57px;
      background: url(${BgEdge}) no-repeat center;
      background-size: 100%;
      &.edge2{
        transform: rotate(180deg);
        right: 0;
      }
    }
    .device-box{
      position: absolute;
      top: 11px;
      left: 111px;
    }
  }
  .bottom-box{
    margin: 30px 0 0 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    .device-box{
      width: 209px;
    }
  }
  .device-box{
    display: flex;
    align-items: center;
    img{
      width: 84px;
      margin: 0 23px 0 0;
    }
    .name{
      color: #fff;
      font-size: 14px;
      line-hieght: 16px;
    }
    .num{
      margin: 10px 0 0;
      color: #0290E0;
      font-size: 20px;
      font-family: PMZD;
      line-hieght: 23px;
    }
  }
`
export function ProvincialResources(props: any) {
  const [deviceList, setDevicebList] = useState<any>([]);
  const [showFlag, setShowFlag] = useState<any>(false);
  useEffect(() => {
    if(props.coreType){
      let selectItem:any = coreList.find(item => item.name == props.coreType);
      //请求数据
      getCoreNetWorkDevice({
        netWorkType: selectItem.code
      }).then((res: any) => {
        if (res.code == '200' && res.data) {
          setDevicebList(res.data)
        }
      });
      if(props.coreType == '5GC核心网'){
        setShowFlag(true);
      }
      else{
        setShowFlag(false);
      }
    }
    
  }, [props.coreType]);
  return (
    <>
      <SectionTitle
          mainTitle={'设备详情统计'}
          subTitle={''}
          mainTitleColor="#00FAF9"
          style={{
            width: '520px'
          }}
        ></SectionTitle>
        <DeviceWrapper>
          <div className="top-box">
            <div className="bg"></div>
            <div className="edge"></div>
            <div className="edge edge2"></div>
            <div className="device-box">
              <img src={IconDevice1} />
              <div className="right">
                <div className="name">设备类型总量</div>
                <div className="num">{deviceList.length>0 ? transformValue(deviceList[0].deviceCounts) : 0}</div>
              </div>
            </div>
          </div>
          {!showFlag && <div className="top-box top-box2">
            <div className="bg"></div>
            <div className="edge"></div>
            <div className="edge edge2"></div>
            <div className="device-box">
              <img src={IconDevice3} />
              <div className="right">
                <div className="name">物理设备总量</div>
                <div className="num">{deviceList.length>0 ? transformValue(deviceList[2].deviceCounts) : 0}</div>
              </div>
            </div>
          </div>
          }
          {showFlag && <div className="bottom-box">
            <div className="device-box">
              <img src={IconDevice2} />
              <div className="right">
                <div className="name">虚拟设备总量</div>
                <div className="num">{deviceList.length>0 ? transformValue(deviceList[1].deviceCounts) : 0}</div>
              </div>
            </div>
            <div className="device-box">
              <img src={IconDevice3} />
              <div className="right">
                <div className="name">物理设备总量</div>
                <div className="num">{deviceList.length>0 ? transformValue(deviceList[2].deviceCounts) : 0}</div>
              </div>
            </div>
          </div>
          }
        </DeviceWrapper>
    </>
  );
}
export default ProvincialResources;
