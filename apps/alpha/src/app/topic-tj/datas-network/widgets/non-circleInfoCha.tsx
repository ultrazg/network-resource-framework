import styled from 'styled-components';
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useViewport } from "@alpha/app/context/viewport-context";
import styles from '@alpha/app/topic-tj/components/map-view/map-view.module.scss';
import tooltipBg from '../images/tooltipBg.png'

const EcClass = styled.div`
  .ecClass{
    width: 521.37px;
    height: 304px;
`;

function NoncircleInfo(props:any) {
  const chartRef = useRef<any>('null');
  const [widthWidth, heightHeight] = useViewport();
  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current);
    let cityList2 = props.cityList2.slice(0,10)
    let twoData = props.twoData.slice(0,10)
    const option = {
        color:'#FFCC3B',
        legend: {
          show:true,
          top:9.8,
          right:20,
          itemGap:15,
          itemWidth:10,
          itemHeight:10,
          textStyle:{
            color: '#FFFFFF',
          },
          data: [
            "CR上联169骨干",
          ],
        },
        grid:{
            show:false,
            top:'26%',
            right:'5%',
            bottom:'12%',
            left:'7%'
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLabel: {
              color: '#FFFFFF',
              interval:0
            },
            // 网格样式
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#262732'],
                width: 1,
                type: 'solid',
              },
            },
            //横轴样式
            axisLine: {
              lineStyle: {
                fontFamily: " PingFangSC-Regular",
                fontWeight: 400,
                fontSize: 12,
                textAlign: "center",
              },
            },
            data: cityList2,
          }
        ],
        yAxis: [
          {
            name: "设备数(台)",
            nameTextStyle: {
              color: '#00B6FD',
              fontSize: 12,
              fontWeight: '400',
              fontFamily: "PingFangSC-Regular",
              padding: 0,
              lineHeight: 20,
            },
            type: 'value',
            // 网格样式
            splitLine: {
              show: true,
              lineStyle: {
                color: ['rgba(255,255,255,0.18)'],
                width: 1,
                type: 'solid',
              },
            },
            //纵轴样式
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.54)',
                fontFamily: " PingFangSC-Regular",
                fontWeight: 400,
                fontSize: 12,
                textAlign: "center",
              },
            },
          },
        ],
        tooltip: {
          show:true,
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          // textStyle: {
          //   color: "#fff",
          //   align: "left",
          //   fontSize: 14,
          // },
          // backgroundColor: "rgba(0,0,0,0.8)",
          backgroundColor: "transparent",
        borderWidth: 0,
        formatter: (params:any) => {
          if(cityList2.length > 0){
            return `<div style="position: relative;width: 206px;">
              <img style="width: 206px;" src="${tooltipBg}" alt=""/>
              <div style="position: absolute; top: 14px;left: 14px;">
                <div style="font-size: 14px;color: #01FFFF;">${params[0].name}</div>
                <div style="font-size: 12px;color: #32C5FF;width:171px;display:flex;justify-content:space-between;margin:8px 0 0;">
                  <div style="display:flex;align-items:center;">    
                    <span style="display:inline-block;width:6px;height:6px;background:#FFCC3B;margin:0 5px 0 0"></span>
                    <div>CR上联169骨干</div>
                  </div>
                  <div style="font-family:PMZD;color: #01FFFF;">${params[0].value}</div>
                </div>
              </div>
            <div>`
          }else{
            return ``
          }
        },
        position: function(point:any, params:any) {
          if(point[0]<295){
            return [(point[0]-0), ([point[1]-75])]
          }else{
            return [(point[0]-226), ([point[1]-75])]
          }
        }
        },
        series: [
          {
            name: "CR上联169骨干",
            data: twoData,
            type: "bar",
            stack:'总量',
            barWidth: 6,
          },
        ],
    };
    chartInstance.setOption(option);
  }, [props.cityList2,props.twoData])

  return (
    <>
    <div
        className={styles['container']}
        style={{
        zoom: 1 / (widthWidth / 1920),
        transform: "scale("+(widthWidth / 1920)+")", 
        transformOrigin: "0% 0%", 
        width: (1/(widthWidth / 1920)) * 100 + "%" 
        }}
    >
        <EcClass>
        <div className="ecClass">
        <div ref={chartRef} style={{ width: "521.37px",height:"304px"}}></div>
        </div>
        </EcClass>
    </div>
    </>
  )
}

export default NoncircleInfo;