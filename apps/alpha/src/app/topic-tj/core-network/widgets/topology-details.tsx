// 设备详情组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';

import SectionTitle from './section-title';

import IconDevice1 from '../images/icon-device01.png'
import BgEdge from '../images/bg-edge.png';

import { getTopologyData } from '../../api/coreNetwork'
import { transformValue } from '../../utils/utils';
const DeviceWrapper = styled.div`
  .top-box{
    margin: 25px 0 50px 30px;
    position: relative;
    width: 390px;
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
  console.log(props.networkElement);
  const [deviceCount, setDeviceCount] = useState<any>([]);
  useEffect(() => {
    //请求数据
    getTopologyData({
      vnfType: props.networkElement
    }).then((res: any) => {
      if (res.code == '200' && res.data) {
        setDeviceCount(res.data.vnfCount)
      }
    });
  }, [props.networkElement]);
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
                <div className="name">设备总量</div>
                <div className="num">{deviceCount}</div>
              </div>
            </div>
          </div>
        </DeviceWrapper>
    </>
  );
}
export default ProvincialResources;
