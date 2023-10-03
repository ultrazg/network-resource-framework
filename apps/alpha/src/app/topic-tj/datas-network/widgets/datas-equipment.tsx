
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import styled from 'styled-components';
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import { useViewport } from "@alpha/app/context/viewport-context";
import css from '../datas-network.module.scss'
import hulianwang from '../images/hulianwang.png';
import liuliang from '../images/liuliang.png';
import daikuan from '../images/daikuan.png';
import { getResourceEffic } from '../../api/datasNetwork';//调接口
import {transformValue} from '../../utils/utils';
import tooltipBg from '../images/tooltipBg.png'
const DedicatedLine = styled.div`

   .ecClass{
    width: 521.37px;
    height: 280px;
   }
`;

const EcData = styled.div`
margin-top:25px;
  .ecBox{
    position:relative,
  }
  .zongdetail{
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:25px;
    .signdetail{
      display:flex;
      align-items: center;
      .number{
        font-family: PangMenZhengDao, sans-serif;
        font-size: 18px;
        font-weight:600;
        color: #00FCFF;
        margin-bottom:6px;
      }
      .num_title{
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #FFFFFF;
      }
    }
  }
`;

function LineserviceChart(props: any) {
  const chartRef = useRef<any>('null');
  const [widthWidth, heightHeight] = useViewport();
  let clock:any = null;
  useEffect(() => {
    if (!(props.cityNameList1?.length && props.cityNumList1?.length && props.cityNameList2?.length)) return
    let chartInstance = echarts.init(chartRef.current);
    const option = {
      // 标题
      title: {
        // subtext: '链路数(条)',
        subtextStyle: {
          color: '#00B6FD',
          fontSize: 12,
          fontWeight: '400',
          fontFamily: "PingFangSC-Regular",
          width: '56',
          height: '18',
        }
      },
      grid: {
        x: '20%', //相当于距离左边效果:padding-left
        y: '15%', //相当于距离上边效果:padding-top
        bottom: "20",
        right: "90",
        // left:"0"
      },
      color: ['#003366', '#006699', '#4cabce', '#e5323e'],
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: "transparent",
        borderWidth: 0,
        formatter: (params:any) => {
          if(props.cityNumList1.length > 0 && props.cityNameList2.length>0){
            return `<div style="position: relative;width: 206px;">
              <img style="width: 206px;" src="${tooltipBg}" alt=""/>
              <div style="position: absolute; top: 14px;left: 14px;">
                <div style="display:flex;align-items: center;font-size: 14px;color: #01FFFF;width: 190px;line-height: 16px;white-space:normal;height: 32px;">${params[0].name}</div>
                <div style="font-size: 12px;color: #32C5FF;width:171px;display:flex;justify-content:space-between;margin:8px 0 0;">
                  <div style="display:flex;align-items:center;">    
                    <span style="display:inline-block;width:6px;height:6px;background:#13E09B;margin:0 5px 0 0"></span>
                    <div>流入流量(gbit/s)</div>
                  </div>
                  <div style="font-family:PMZD;color: #01FFFF;">${params[0].value}</div>
                </div>
                <div style="font-size: 12px;color: #32C5FF;width:171px;display:flex;justify-content:space-between;margin: 2px 0 0;">
                  <div style="display:flex;align-items:center;">    
                    <span style="display:inline-block;width:6px;height:6px;background:#0170C9;margin:0 5px 0 0"></span>
                    <div>流出流量(gbit/s)</div>
                  </div>
                  <div style="font-family:PMZD;color: #01FFFF;">${params[1].value}</div>
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
      legend: {
        show:true,
        top: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 15,
        textStyle:{
          color: '#FFFFFF',
        },
        data: [
          "流入流量(gbit/s)",
          "流出流量(gbit/s)"
        ],
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: false },
          dataView: { show: false, readOnly: false },
          magicType: { show: false, type: ['line', 'bar', 'stack', 'tiled'] },
          restore: { show: false },
          saveAsImage: { show: false }
        }
      },
      calculable: true,
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          axisLabel: {
            color: '#FFFFFF',
            interval: 0,
            formatter: function (params: any) {
              var newParamsName = ''
              const paramsNameNumber = params.length
              const provideNumber = 6 // 单行显示文字个数
              if (paramsNameNumber > provideNumber) {
                newParamsName = params.substring(0, 6) + "..."
              } else {
                newParamsName = params
              }
              return newParamsName
            },
            margin: 92,
            textStyle:{
              align:'left'
            }
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
          data: props.cityNameList1,
        }
      ],
      xAxis: [
        {
          name: "流量(gbit/s)",
          nameTextStyle: {
            color: '#00B6FD',
            fontSize: 12,
            fontWeight: '400',
            fontFamily: "PingFangSC-Regular",
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
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          realtime: true,
          width: '3.5',
          height: '80%',
          right: 5, //右边的距离
          bottom: 5, //下边的距离
          show: true,  // 是否展示
          orient: "vertical",
          yAxisIndex: [0],
          fillerColor: "rgba(17, 100, 210, 0.42)", // 滚动条颜色
          borderColor: "rgba(17, 100, 210, 0.12)",
          handleSize: 0,      //两边手柄尺寸
          showDetail: false, //拖拽时是否展示滚动条两侧的文字
          zoomLock: true,         //是否只平移不缩放
          moveOnMouseMove: false, //鼠标移动能触发数据窗口平移
          //下面是自己发现的一个问题，当点击滚动条横向拖拽拉长滚动条时，会出现文字重叠，导致效果很不好，以此用下面四个属性进行设置，当拖拽时，始终保持显示六个柱状图，可结合自己情况进行设置。添加这个属性前后的对比见**图二**
          startValue: 0, // 从头开始。
          endValue: 6,  // 最多六个
          // minValueSpan: 7,  // 放大到最少几个
          // maxValueSpan: 6,  //  缩小到最多几个
        },
        {
          type: "inside",  // 支持内部鼠标滚动平移
          yAxisIndex: [0],
          zoomOnMouseWheel: false,  // 关闭滚轮缩放
          moveOnMouseWheel: true, // 开启滚轮平移
          moveOnMouseMove: true,  // 鼠标移动能触发数据窗口平移
        }
      ],
      series: [
        {
          name: "流入流量(gbit/s)",
          type: 'bar',
          barGap: "3",
          data: props.cityNumList1,
          barWidth: 6,
          itemStyle: {
            normal: {
              color: '#13E09B',
              barBorderRadius: [0, 0, 0, 0]
            }
          },
        },
        {
          name: "流出流量(gbit/s)",
          data: props.cityNameList2,
          type: "bar",
          barGap: "0",
          barWidth: 6,
          itemStyle: {
            normal: {
              color: '#0091FF',
              barBorderRadius: [0, 0, 0, 0]
            }
          },
        },
      ]
    };
    chartInstance.setOption(option);
  
    // 定时自动滚动
    let start = () => {
      clock = setInterval(function () {
        let optionNew:any = chartInstance.getOption();
        if (optionNew.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].startValue = 0;
          option.dataZoom[0].endValue = 6;
        } else {
          option.dataZoom[0].startValue = optionNew.dataZoom[0].startValue + 1;
          option.dataZoom[0].endValue = optionNew.dataZoom[0].endValue + 1;
        }
        chartInstance.setOption(option);
      }, 3000);
    }
    let stop = () => {
      clearInterval(clock);
    }
    start();
    chartInstance.on('mouseover',function(){
      stop();
    });
    chartInstance.on('mouseout',function(){
      start();
    });
    return () => {
      clearInterval(clock);
    };
  }, [props.cityNameList1, props.cityNumList1, props.cityNameList2]
  )

  return (
    <>
      <DedicatedLine>
        <div className='ecBox'>
          <div className={css['province-source-box']} style={{ position: 'absolute', left: '0', top: '135px' }}>
            <h1 className={css['title']} style={{ margin: '0' }}>互联网专线TOP20客户流量</h1>
          </div>
          <div className="ecClass" style={{
            zoom: 1 / (widthWidth / 1920),
            transform: "scale(" + (widthWidth / 1920) + ")",
            transformOrigin: "0% 0%",
            width: (1 / (widthWidth / 1920)) * 100 + "%"
          }}>
            <div ref={chartRef} style={{ width: '500px', height: '270px', marginRight: '65px' }}></div>
          </div>
        </div>
      </DedicatedLine>
    </>
  )
}

function LineChartEm() {
  const [cityNameList1, setCityNameList1] = useState<any>([]);
  const [cityNumList1, setCityNumList1] = useState<any>([]);
  const [cityNameList2, setCityNameList2] = useState<any>([]);
  const [resourceList, setResourceList] = useState<any>({})

  useEffect(() => {
    getResourceEffic({}).then((res: any) => {
      if (res.code == 200) {
        setResourceList(res.data)
        //客户名称
        let cityNameList1 = res.data.networkTop20CustFlowDtos?.map((item: any) => {
          return item.customerName
        })
        setCityNameList1(cityNameList1)
        //流入流量
        let cityNumList1 = res.data.networkTop20CustFlowDtos?.map((item: any) => {
          return item.inFlow
        })
        setCityNumList1(cityNumList1)
        //流出流量
        let cityNameList2 = res.data.networkTop20CustFlowDtos?.map((item: any) => {
          return item.outFlow
        })
        setCityNameList2(cityNameList2)
      }
    })
  }, []);

  return (
    <>
      <DedicatedLine>
        <SectionTitle title="专线业务分析" style={{ width: '470px' }}>
        </SectionTitle>

        <EcData>
          <div className="zongdetail">
            <div className="signdetail">
              <div>
                <img src={hulianwang} style={{ width: '56px', height: '57px', marginRight: "12px" }} />
              </div>
              <div>
                <div className="number">{transformValue(resourceList.networkExpertLinkCount)}</div>
                <div className="num_title">互联网专线(个)</div>
              </div>
            </div>
            <div className="signdetail">
              <div>
                <img src={daikuan} style={{ width: '56px', height: '57px', marginRight: "12px" }} />
              </div>
              <div>
                <div className="number">{transformValue(resourceList.totalBandWithCount)}</div>
                <div className="num_title">总带宽(G)</div>
              </div>
            </div>
            <div className="signdetail">
              <div>
                <img src={liuliang} style={{ width: '56px', height: '57px', marginRight: "12px" }} />
              </div>
              <div>
                <div className="number">{transformValue(resourceList.totalFlowCount)}</div>
                <div className="num_title">总流量(G)</div>
              </div>
            </div>
          </div>
          <LineserviceChart
            cityNameList1={cityNameList1}
            cityNumList1={cityNumList1}
            cityNameList2={cityNameList2}
          />
        </EcData>

      </DedicatedLine>
    </>
  )
}


export default LineChartEm;