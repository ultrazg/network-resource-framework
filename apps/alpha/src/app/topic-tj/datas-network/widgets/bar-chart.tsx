
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import styled from 'styled-components';
import { useViewport } from "@alpha/app/context/viewport-context";
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import { getStatisticsData } from '../../api/datasNetwork';//调接口


const DedicatedLine = styled.div`
 margin-top:20px;
 height:324px;
.ecClass{
  margin-bottom:20px;
}
`

function HistogramChart(props: any) {
  const chartRef = useRef<any>('null');
  const [widthWidth, heightHeight] = useViewport();
  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current);

    const option = {
      // 标题
      grid: {
        x: '5%', //相当于距离左边效果:padding-left
        y: '20%', //相当于距离上边效果:padding-top
        bottom: "30",
      },
      color: ['#003366', '#006699', '#4cabce', '#e5323e'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
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
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          axisLabel: {
            color: '#FFFFFF',
            interval: 0,
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
          data: props.cityNameList,
        }
      ],
      yAxis: [
        {
          name: "链路数(条)",
          nameTextStyle: {
            color: '#00B6FD',
            fontSize: 12,
            fontWeight: '400',
            fontFamily: "PingFangSC-Regular",
            width: '56',
            height: '18',
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
          start: 0,
          end: 100,  // 数据窗口范围的结束百分比。范围是：0 ~ 100。
          height: '1px', //组件高度
          left: 5, //左边的距离
          right: 5, //右边的距离
          bottom: -5, //下边的距离
          show: true,  // 是否展示
          fillerColor: "rgba(17, 100, 210, 0.42)", // 滚动条颜色
          handleSize: 0,      //两边手柄尺寸
          showDetail: false, //拖拽时是否展示滚动条两侧的文字
          zoomLock: true,         //是否只平移不缩放
          moveOnMouseMove: false, //鼠标移动能触发数据窗口平移

          //下面是自己发现的一个问题，当点击滚动条横向拖拽拉长滚动条时，会出现文字重叠，导致效果很不好，以此用下面四个属性进行设置，当拖拽时，始终保持显示六个柱状图，可结合自己情况进行设置。添加这个属性前后的对比见**图二**
          startValue: 0, // 从头开始。
          endValue: 11,  // 最多六个
          minValueSpan: 11,  // 放大到最少几个
          maxValueSpan: 6,  //  缩小到最多几个
        },
        {
          type: "inside",  // 支持内部鼠标滚动平移
          start: 10,
          end: 100,
          zoomOnMouseWheel: false,  // 关闭滚轮缩放
          moveOnMouseWheel: true, // 开启滚轮平移
          moveOnMouseMove: true  // 鼠标移动能触发数据窗口平移 
        }
      ],
      series: [
        {
          type: 'bar',
          barGap: 0,
          data: props.cityNumList,
          barWidth: 11,
          itemStyle: {
            normal: {
              color: '#09CFF0'
            }
          },
        },
      ]
    };
    let dataZoom = [
      {
        type: 'slider',
        realtime: true,
        start: 0,
        end: 100,  // 数据窗口范围的结束百分比。范围是：0 ~ 100。
        height: '1px', //组件高度
        left: 5, //左边的距离
        right: 5, //右边的距离
        bottom: 4, //下边的距离
        show: true,  // 是否展示
        fillerColor: "rgba(17, 100, 210, 0.42)", // 滚动条颜色
        handleSize: 0,      //两边手柄尺寸
        showDetail: false, //拖拽时是否展示滚动条两侧的文字
        zoomLock: true,         //是否只平移不缩放
        moveOnMouseMove: false, //鼠标移动能触发数据窗口平移

        //下面是自己发现的一个问题，当点击滚动条横向拖拽拉长滚动条时，会出现文字重叠，导致效果很不好，以此用下面四个属性进行设置，当拖拽时，始终保持显示六个柱状图，可结合自己情况进行设置。添加这个属性前后的对比见**图二**
        startValue: 0, // 从头开始。
        endValue: 11,  // 最多六个
        minValueSpan: 11,  // 放大到最少几个
        maxValueSpan: 6,  //  缩小到最多几个
      },
      {
        type: "inside",  // 支持内部鼠标滚动平移
        start: 10,
        end: 100,
        zoomOnMouseWheel: false,  // 关闭滚轮缩放
        moveOnMouseWheel: true, // 开启滚轮平移
        moveOnMouseMove: true  // 鼠标移动能触发数据窗口平移 
      }
    ];
    if (option.series[0].data.length > 11) {
      option.dataZoom = dataZoom
    }

    chartInstance.setOption(option);
  }, [props.cityNameList, props.cityNumList]
  )

  return (
    <>
      <DedicatedLine>
        <SectionTitle title="专线重点关注联路数" style={{ width: '408px' }}>
        </SectionTitle>
        <div className="ecClass" style={{
          zoom: 1 / (widthWidth / 1920),
          transform: "scale(" + (widthWidth / 1920) + ")",
          transformOrigin: "0% 0%",
          width: (1 / (widthWidth / 1920)) * 100 + "%"
        }}>
          <div ref={chartRef} style={{ width: '600px', height: '270px', padding: '0', margin: '0' }}></div>
        </div>
      </DedicatedLine>
    </>
  )
}
function ChartsStyle(props: any) {
  const [cityNameList, setCityNameList] = useState<any>([]);
  const [cityNumList, setCityNumList] = useState<any>([]);

  useEffect(() => {
    getStatisticsData({
      provinceCode: props.provinceId
    }).then((res: any) => {
      if (res.code == 200) {
        props.selectedElement(res.data.focusLinks)
        let cityNameList = res.data.statistics?.map((item: any) => {
          return item.city
        })
        setCityNameList(cityNameList)
        let cityNumList = res.data.statistics?.map((item: any) => {
          return item.count
        })
        setCityNumList(cityNumList)
      }
    })
  }, []);


  return (
    <>
      <HistogramChart
        cityNameList={cityNameList}
        cityNumList={cityNumList}
      />
    </>
  )
}


export default ChartsStyle;