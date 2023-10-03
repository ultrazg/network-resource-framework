import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import styled from 'styled-components';
import { useViewport } from "@alpha/app/context/viewport-context";
import styles from '@alpha/app/topic-tj/components/map-view/map-view.module.scss';
import tooltipBg from '../images/tooltipBg.png'

const EcClass = styled.div`
  .ecClass{
    width: 521.37px;
    height: 304px;
  }
`;

function HiddenDangerCha(props:any) {
  const chartRef = useRef<any>('null');
  const [widthWidth, heightHeight] = useViewport();
  const zoom = widthWidth / 1920;
  const zoomh = heightHeight / 1080;
  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current)
    let cityList1 = props.cityList1.slice(0,10)
    let oneData1 = props.oneData1.slice(0,10)
    let oneData2 = props.oneData2.slice(0,10)
    let oneData3 = props.oneData3.slice(0,10)
    const option = {
      color: ["#FFCC3B","#22D69A","#0090FF"],
      legend: {
        show:true,
        top:9.8,
        right:20,
        itemWidth:10,
        itemHeight:10,
        itemGap:15,
        textStyle:{
          color: '#FFFFFF',
        },
        data: [
          "CR上联169骨干",
          "核心CR至省网CR",
          "BRAS、SR至CR"
        ],
      },
      grid:{
          show:false,
          top:'26%',
          right:'5%',
          bottom:'12%',
          left:'7%',
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
          data: cityList1,
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
          if(cityList1.length>0){
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
                <div style="font-size: 12px;color: #32C5FF;width:171px;display:flex;justify-content:space-between;">
                  <div style="display:flex;align-items:center;">    
                    <span style="display:inline-block;width:6px;height:6px;background:#22D69A;margin:0 5px 0 0"></span>
                    <div>核心CR至省网CR</div>
                  </div>
                  <div style="font-family:PMZD;color: #01FFFF;">${params[1].value}</div>
                </div>
                <div style="font-size: 12px;color: #32C5FF;width:171px;display:flex;justify-content:space-between;margin:0 0 10px 0;">
                  <div style="display:flex;align-items:center;">    
                    <span style="display:inline-block;width:6px;height:6px;background:#0090FF;margin:0 5px 0 0"></span>
                    <div>BRAS、SR至CR</div>
                  </div>
                  <div style="font-family:PMZD;color: #01FFFF;">${params[2].value}</div>
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
          data: oneData1,
          stack:'总量',
          type: "bar",
          barWidth: 6,
        },
        {
          name: "核心CR至省网CR",
          data: oneData2,
          stack:'总量',
          type: "bar",
          barWidth: 6,
        },
        {
          name: "BRAS、SR至CR",
          data: oneData3,
          stack:'总量',
          type: "bar",
          barWidth: 6,
        },
      ],
    };
    let triggerAction = function (action:any, selected:any) {
      let legend = [];
      for (let name in selected) {
          if (selected.hasOwnProperty(name)) {
              legend.push({name: name});
          }else{
            
          }
      }
      chartInstance.dispatchAction({
          type: action,
          batch: legend
      });
    };

    let isFirstUnSelect = function (selected:any, legend:any) {
      if (selected[legend] === true) return false;
      let unSelectedCount = 0;
      for (let name in selected) {
          if (!selected.hasOwnProperty(name)) {
              continue;
          }
          if (selected[name] === false) {
              unSelectedCount++;
          }
      }
      return unSelectedCount === 1;
    };

    // 所有都未选择，展示全部
    let isAllUnSelected = function (selected:any) {
      let selectedCount = 0;
      for (let name in selected) {
          if (!selected.hasOwnProperty(name)) {
              continue;
          }
          // selected对象内true代表选中，false代表未选中
          if (selected[name] === true) {
              selectedCount++;
          }
      }
      return selectedCount === 0;
    };

    chartInstance.on('legendselectchanged', function (params:any) {
      let selected = params.selected;
      let legend = params.name;
      // 使用legendToggleSelect动作将重新触发legendselectchanged事件，导致本函数重复运行从而丢失selected对象
      if (selected !== undefined) {
          if (isFirstUnSelect(selected, legend)) {
              triggerAction('legendToggleSelect', selected);
          } else if (isAllUnSelected(selected)) {
              triggerAction('legendSelect', selected);
          }
      }
    });
    chartInstance.setOption(option);
  }, [props.cityList1,props.oneData1,props.oneData2,props.oneData3]);
  return (
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
  );
}

export default HiddenDangerCha;