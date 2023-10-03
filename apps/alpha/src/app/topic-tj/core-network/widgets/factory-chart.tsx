import React, { useEffect, useRef,useState } from 'react';
import * as echarts from "echarts";
import "echarts-gl";
import { useViewport } from "@alpha/app/context/viewport-context";
import styled from 'styled-components';
import TooltipBg from '../images/tool-tip.png';
import IconTooltip from '../images/icon-tooltip.png';
import { getPercentageOccupancy } from '../../api/coreNetwork';
import { coreList } from '../static/config';
const ChartBox = styled.div`
  position: relative;
  margin: 20px 0 0;
  .title{
    color: rgba(0,250,249,1);
    font-size: 20px;
    font-weight: 400;
    font-family: "FZZD";
    text-align: center;
    position: absolute;
    width: 100%;
    left: 0;
  }
  .chart-box{
    position: relative;
    margin: 30px 0 0;
    
    .legend-list{
      position: absolute;
      left: 250px;
      top: 35px;
      li{
        display: flex;
        align-items: center;
        margin: 0 0 8px 0;
        width: 100px;
        .icon{
          width: 6px;
          height: 6px;
          display: block;
          border-radius: 50%;
        }
        .icon1{
          background: #A1964D;
        }
        .icon2{
          background: #179783;
        }
        .icon3{
          background: #0AA4C1;
        }
        .icon4{
          background: #496CE5;
        }
        .name{
          font-size: 12px;
          color: #fff;
          line-height: 17px;
          margin: 0 11px 0 6px;
        }
        .num{
          font-size: 12px;
          color: #02E7F8;
          line-height: 17px;
          font-family: PMZD;
        }
      }
    }
  }
`;
export default (props:any) => {
  let selectedIndex = -1;
  const chartRef = useRef(null);
  const [widthWidth, heightHeight] = useViewport();
  const [optionData, setOptionData] = useState<any>([]);
  let listData:Array<any> = [];
  const getPie3D = (pieData:any, internalDiameterRatio:any) => {
    let series:Array<any> = []
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    let k = typeof internalDiameterRatio !== 'undefined'
            ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
            : 1 / 3;
    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i++) {
      sumValue += pieData[i].value;
      let seriesItem = {
        name: typeof pieData[i].name === "undefined" ? `series${i}` : pieData[i].name,
        type: "surface",
        parametric: true,
        wireframe: {
          show: false
        },
        pieData: pieData[i],
        pieStatus: {
          selected: false,
          hovered: false,
          k: k
        },
        center: ['10%', '60%'],
        itemStyle: pieData[i].itemStyle
      };
      series.push(seriesItem);
    }

    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    for (let i = 0; i < series.length; i++) {
      endValue = startValue + series[i].pieData.value;
      series[i].pieData.startRatio = startValue / sumValue;
      series[i].pieData.endRatio = endValue / sumValue;
      // let radio = 1 + series[i].pieData.value/250
      let radio = 1;
      series[i].parametricEquation =  getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio,
        false, false, k, 16,radio)
      startValue = endValue;
    }
    // let boxHeight = getHeight3D(series, 30);//通过传参设定3d饼/环的高度，26代表26px
    // 准备待返回的配置项，把准备好的 series 传入。
    let option = {
      legend: {
        show: false
      },
      labelLine: {
        show: false,
        lineStyle: {
            color: '#7BC0CB'
        }
      },
      label: {
        show: false,
        position: 'outside',
        rich: {
            b: {
                color: '#7BC0CB',
                fontSize: 12,
                lineHeight: 20
            },
            c: {
                fontSize: 16,
            },
        },
        formatter: '{b|{b} \n}{c|{c}}{b|  亩}',
      },
      tooltip: {
        show: true,
        backgroundColor: "transparent",
        borderWidth: 0,
        shadowColor: "transparent",
        formatter: (params:any) => {
          if(listData.length>0 && params.seriesIndex != undefined){
            return `<div style="position: relative;">
              <img style="width: 213px;" src="${TooltipBg}" alt=""/>
              <div style="position: absolute; top: 14px;left: 14px;">
                <div style="font-size: 14px;color: #01FFFF;">${listData[params.seriesIndex].factoryName}</div>
                <div style="font-size: 12px;color: #32C5FF;display:flex;margin: 10px 0 0;"><img style="width:18px;height:14px;margin:5px 10px 0 0" src="${IconTooltip}" alt=""/><div style="width: 60px;">设备数</div><div style="font-family:PMZD;">${listData[params.seriesIndex].equipmentCount}</div></div>
                <div style="font-size: 12px;color: #32C5FF;display:flex;"><img style="width:18px;height:14px;margin:5px 10px 0 0" src="${IconTooltip}" alt=""/><div style="width: 60px;">占比</div><div style="font-family:PMZD;">${listData[params.seriesIndex].proportion}%</div></div>
              </div>
            <div>`
          }
          else{
            return ``
          }
        },
        position: function(point:any, params:any) {
          return [(point[0]-223), ([point[1]-75])]
        }
      },
      xAxis3D: {
        min: -1,
        max: 1
      },
      yAxis3D: {
        min: -1,
        max: 1
      },
      zAxis3D: {
        min: -1,
        max: 1
      },
      grid3D: {
        show: false,
        boxHeight: 16, //圆环的高度
        viewControl: { //3d效果可以放大、旋转等，请自己去查看官方配置
          alpha: 45, //角度
          distance: 180,//调整视角到主体的距离，类似调整zoom
          rotateSensitivity: 0, //设置为0无法旋转
          zoomSensitivity: 0, //设置为0无法缩放
          panSensitivity: 0, //设置为0无法平移
          autoRotate: false //自动旋转
        }
      },
      series: series
    };
    return option;
  };
  //获取3d饼图的最高扇区的高度
  const getHeight3D = (series:any, height:any) => {
    series.sort((a:any, b:any) => {
      return (b.pieData.value - a.pieData.value);
    });
    return series[series.length-1].pieData.value / series[0].pieData.value;
  };
  const fomatFloat = (num:any, n:any) => {
    var f = parseFloat(num);
    if (isNaN(f)) {
      return false;
    }
    f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
    var s = f.toString();
    var rs = s.indexOf(".");
    //判定如果是整数，增加小数点再补0
    if (rs < 0) {
      rs = s.length;
      s += ".";
    }
    while (s.length <= rs + n) {
      s += "0";
    }
    return s;
  }
  const getParametricEquation = (startRatio:any, endRatio:any, isSelected:any, isHovered:any, k:any, h:any,radio:any) => {
    // 计算
    let midRatio = (startRatio + endRatio) / 2;
    let startRadian = startRatio * Math.PI * 2;
    let endRadian = endRatio * Math.PI * 2;
    let midRadian = midRatio * Math.PI * 2;
    // 如果只有一个扇形，则不实现选中效果。
    if (startRatio === 0 && endRatio === 1) {
      isSelected = false;
    }
    // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    k = typeof k !== "undefined" ? k : 1 / 3;
    // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
    // 计算高亮效果的放大比例（未高亮，则比例为 1）
    let hoverRate = isHovered ? 1.05 : 1;
    // 返回曲面参数方程
    return {
      u: {
        min: -Math.PI,
        max: Math.PI * 3,
        step: Math.PI / 32
      },
      v: {
        min: 0,
        max: Math.PI * 2,
        step: Math.PI / 20
      },
      x: function(u:any, v:any) {
        if (u < startRadian) {
            return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * radio;
        }
        if (u > endRadian ){
            return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * radio;
        }
        return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * radio;
        
      },
      y: function(u:any, v:any) {
          if (u < startRadian) {
              return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * radio;
          }
          if (u > endRadian ){
              return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * radio;
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * radio;
      },
      z: function (u:any, v:any) {
        if (u < -Math.PI * 0.5) {
          return Math.sin(u);
        }
        if (u > Math.PI * 2.5) {
            return Math.sin(u);
        }
        return Math.sin(v) > 0 ? 1 : -1;
      }
    };
  }
  const bubbleSort = (arr:any) => {
    for (let i = 0; i < arr.length - 1; i++) {//代表第几轮比较
      for (let j = 0; j < arr.length - 1 - i; j++) {//每一轮的两两相邻元素比较
        if (arr[j].proportion - 0 < arr[j + 1].proportion - 0) {//相邻元素比较
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]//满足条件，交换位置
        }
      }
    }
    return arr
  }
  useEffect(() => {
    if(props.coreType){
      const colorList = ['rgba(161,150,77,0.85)','rgba(23,151,131,0.85)','rgba(10,164,193,0.85)','rgba(73,108,229,0.85)'];
      const colorList2 = ['#F6E258','#2BDDC1','#07CFF4','#6C8DFF'];
      const selectItem:any = coreList.find(item => item.name == props.coreType);
      //请求数据
      getPercentageOccupancy({
        type: selectItem.code
      }).then((res: any) => {
        if (res.code == '200' && res.data.length>0) {
          listData = bubbleSort(res.data);
          if(listData.length<=0)return;
          const list = listData.map((item:any, index:number) => {
            return {
              label: item.factoryName,
              value: item.proportion - 0,
              equipmentCount: item.equipmentCount,
              itemStyle: {
                color: colorList[index],
                opacity: 1
              }
            };
          });
          setOptionData(list);
          if(list.length>0){
            // 传入数据生成 option
            let option = getPie3D(list, 2);
            
            let chartIns:any = echarts.getInstanceByDom(
              chartRef.current as unknown as HTMLElement
            );
            if (chartIns) {
              chartIns.setOption(option, true);
              chartIns.off('click');
              chartIns.on('click', function (params:any) {
                // 准备重新渲染扇形所需的参数
                let isSelected;
                let isHovered;
                let startRatio;
                let endRatio;
                let k;
                let i;
            
                if (selectedIndex >= 0) {
                  option.series[selectedIndex].itemStyle.color=colorList[selectedIndex];
                  startRatio = option.series[selectedIndex].pieData.startRatio;
                  endRatio = option.series[selectedIndex].pieData.endRatio;
                  k = option.series[selectedIndex].pieStatus.k;
                  // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                  option.series[selectedIndex].parametricEquation = getParametricEquation(
                      startRatio,
                      endRatio,
                      false,
                      false,
                      k,
                      16,
                      1
                  );
                }
      
                // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
                if (selectedIndex !== params.seriesIndex) {
                    option.series[params.seriesIndex].itemStyle.color=colorList2[params.seriesIndex];
                    startRatio = option.series[params.seriesIndex].pieData.startRatio;
                    endRatio = option.series[params.seriesIndex].pieData.endRatio;
                    k = option.series[params.seriesIndex].pieStatus.k;
                    
                    // 对当前点击的扇形，执行高亮操作（对 option 更新）
                    option.series[params.seriesIndex].parametricEquation = getParametricEquation(
                        startRatio,
                        endRatio,
                        true,
                        false,
                        k,
                        16,
                        1.05
                    );
                    // 记录上次高亮的扇形对应的系列号 seriesIndex
                    selectedIndex = params.seriesIndex;
                }
                else{
                  selectedIndex = -1;
                }
                // 使用更新后的 option，渲染图表
                chartIns.setOption(option);
              });
            } else {
              chartIns = echarts.init(
                chartRef.current as unknown as HTMLElement,
                {},
                { renderer: 'canvas' }
              );
              chartIns.setOption(option, true);
              chartIns.off('click');
              chartIns.on('click', function (params:any) {
                // 准备重新渲染扇形所需的参数
                let isSelected;
                let isHovered;
                let startRatio;
                let endRatio;
                let k;
                let i;
            
                if (selectedIndex >= 0) {
                  option.series[selectedIndex].itemStyle.color=colorList[selectedIndex];
                  startRatio = option.series[selectedIndex].pieData.startRatio;
                  endRatio = option.series[selectedIndex].pieData.endRatio;
                  k = option.series[selectedIndex].pieStatus.k;
                  // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
                  option.series[selectedIndex].parametricEquation = getParametricEquation(
                      startRatio,
                      endRatio,
                      false,
                      false,
                      k,
                      16,
                      1
                  );
                }
      
                // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
                if (selectedIndex !== params.seriesIndex) {
                    option.series[params.seriesIndex].itemStyle.color=colorList2[params.seriesIndex];
                    startRatio = option.series[params.seriesIndex].pieData.startRatio;
                    endRatio = option.series[params.seriesIndex].pieData.endRatio;
                    k = option.series[params.seriesIndex].pieStatus.k;
                    
                    // 对当前点击的扇形，执行高亮操作（对 option 更新）
                    option.series[params.seriesIndex].parametricEquation = getParametricEquation(
                        startRatio,
                        endRatio,
                        true,
                        false,
                        k,
                        16,
                        1.05
                    );
                    // 记录上次高亮的扇形对应的系列号 seriesIndex
                    selectedIndex = params.seriesIndex;
                }
                else{
                  selectedIndex = -1;
                }
      
                // 使用更新后的 option，渲染图表
                chartIns.setOption(option);
              });
            }
          }
        }
      });
    }
  }, [props.coreType]);
  return (
    <>
      <ChartBox>
        <div className="title">厂家占有率</div>
        <div className="chart-box">
          <div className="ecClass" style={{
            zoom: 1 / (widthWidth / 1920),
            transform: "scale(" + (widthWidth / 1920) + ")",
            transformOrigin: "0% 0%",
            width: (1 / (widthWidth / 1920)) * 100 + "%"
          }}>
            <div style={{width: '300px',height: '180px'}} ref={chartRef}></div>
          </div>
          <ul className="legend-list">
          {optionData && optionData.map((item: any, index: number) => {
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
      </ChartBox>
    </>
  )};
