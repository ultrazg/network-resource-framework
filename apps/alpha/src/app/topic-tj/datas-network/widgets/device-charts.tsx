// 网络健壮性组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import * as d3 from 'd3';

import TooltipBg from '../images/tool-tip.png';
import IconTooltip from '../images/icon-tooltip.png';
import Donut3D from '../layer/Donut3D'
import { useViewport } from "@alpha/app/context/viewport-context";
/* eslint-disable-next-line */

interface RatioObj {
  count: string,
  per: string,
  label: string
}

interface pieResult {
  rate: string,
  numWan: string,
  num: string,
  type: number | string
}

const NetworkStrongerBox = styled.div`
    width: 450px;
    .legend-box{
      height: 100px;
      position: absolute;
      left: 300px;
      top: 40px;
      display: flex;
      align-items: center;
    }
    .legend-list{
      li{
        display: flex;
        align-items: center;
        margin: 0 0 4px 0;
        width: 100px;
        .icon{
          width: 6px;
          height: 6px;
          display: block;
        }
        .icon1{
          background: #30FFAE;
        }
        .icon2{
          background: #34D1FF;
        }
        .icon3{
          background: #258BFF;
        }
        .icon4{
          background: #FF9F3F;
        }
        .name{
          font-size: 12px;
          color: #fff;
          line-height: 17px;
          margin: 0 0 0 6px;
          width: 47px;
        }
        .num{
          font-size: 12px;
          color: #02E7F8;
          line-height: 17px;
          font-family: PMZD, sans-serif;
        }
      }
    }
    
    .pie-wrap {
      position: relative;
      display: flex;
      align-items: center;
      width: 450px;
      height: 157px;
      padding-left: 20px;
      padding-top: 30px;
      box-sizing: border-box;
      .pie-chart {
        width: 340px;
        height: 240px;
        transform: scale(0.7);
        .pie3D {
          position: relative;
        }
        #quotesDonut{
          cursor: pointer;
        }
      }
    }
    path.slice {
      stroke-width: 2px;
    }

    polyline {
      opacity: .3;
      stroke: black;
      stroke-width: 2px;
      fill: none;
    }

    svg text.percent {
        fill: white;
        text-anchor: middle;
        font-size: 12px;
    }

    .chart-tooltip{
      position: fixed;
      z-index: 999;
      left: 0;
      top: 0;
      pointer-events: none;
      display: none;
      .chart-inner{
        position: absolute; top: 14px;left: 14px;
      }
      .tool-name{
        font-size: 14px;
        color: #01FFFF;
      }
      .item{
        width: 200px;
        nowrap;
        font-size: 12px;
        color: #32C5FF;
        display:flex;
        align-items: center;
        line-height: 17px;
        margin-top: 14px;
        img{
          width: 18px;
          margin: 0 10px 0 0;
        }
        .sec{
          width: 62px;
        }
        .num{
          font-family:PMZD;
          color:#01FFFF;
        }
      }
    }
    .empty{
      width: 300px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      color: #52B9FF;
      margin: 50px 0 0;
      border-radius: 10px;
    }
`;
export function NetworkStronger(props:any) {
  const [widthWidth, heightHeight] = useViewport();
  const [lengList, setLengList] = useState<any>([]);
  const [noData, setNoData] = useState<any>(false);
  let pieData:Array<any> = [];
  let svg:any = null;
  useEffect(() => {
    if (props.deviceList.length) {
      setLengList(props.deviceList);
      if(props.deviceList.length == 1){
        let list = JSON.parse(JSON.stringify(props.deviceList));
        list.push(list[0]);
        pieData = list;
      }
      else{
        pieData = props.deviceList;
      }
      let flag = true;
      props.deviceList.forEach((item:any) => {
        if(item.value && item.value - 0 > 0){
          flag = false;
        }
      });
      setNoData(flag)
      if(svg){
        Donut3D.transition("quotesDonut", pieData, 110, 85, 20, 0);
      }
      else{
        initSvg()
      }
    }
  }, [props.deviceList])

  const initSvg = () => {
    svg = d3
      .select("div.pie3D")
      .append("svg")
      .attr("width", 340)
      .attr("height", 240);
    svg
      .append("g")
      .attr("id", "quotesDonut");
    Donut3D.draw("quotesDonut", pieData, 150, 100, 110, 85, 20, 0);
  }

  return (
    <>
      <NetworkStrongerBox>
        <div className="pie-wrap">
          <div className="pie-chart">
            {noData && <div className="empty">暂无数据</div>}
            <div
              className="pie3D"
              style={{
                height: '100%',
                opacity: !noData ? '1' : '0'
             }}
            >
            </div>
          </div>
          <div className="legend-box">
            <ul className="legend-list">
            {lengList && lengList.map((item: any, index: number) => {
              return (
                <li key={index}>
                  <i className={`icon icon${index + 1}`}></i>
                  <div className="name">{item.label}</div>
                  <div className="num">{item.value}%</div>
                </li>
              );
            })
            }
            </ul>
          </div>
        </div>
        <div style={{position:'relative'}}>
          <div className="chart-tooltip" id="dataContainer">
            <img style={{width: '210px'}} src={TooltipBg}/>
            <div className="chart-inner">
              <div className="tool-name"></div>
              <div className="item">
                <img src={IconTooltip} alt=""/>
                <div className="sec">设备数</div>
                <div className="num"></div>
              </div>
              <div className="item">
                <img src={IconTooltip} alt=""/>
                <div className="sec">占比</div>
                <div className="num"></div>
              </div>
            </div>
          </div>
        </div>
      </NetworkStrongerBox>
    </>
  );
}

export default NetworkStronger;
