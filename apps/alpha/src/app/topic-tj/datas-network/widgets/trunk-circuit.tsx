// 中继电路
import React, { useEffect, useRef, useState } from 'react';
import widgetsCss from './widgets.module.scss';
import DevNameView from '../dev-list-dialog/dev-name/dev-name';
import * as echarts from 'echarts';
import Charts from '../../../../../../../libs/chart/src/lib/chart';
import { getPortList, getPortDetails } from '../../api/datasNetwork';
// import Spin from '@alpha/app/topic-tj/components/spin/spin';
import { Spin } from 'antd';
import { useViewport } from '@alpha/app/context/viewport-context';

export interface trunkCircuitProps {
  eqpId?: string;
  eqpName: string;
}

const baseOption = {
  color: ['#00F56E', '#B4DD26', '#11EBD3', '#D06620'],
  grid: {
    left: '2%',
    right: '5%',
    bottom: '1%',
    containLabel: true,
  },
  legend: {
    selectedMode: false,
    // data: [
    //   '流入流量',
    //   '流出流量',
    //   // { name: '平均流入', icon: 'rect', itemHeight: 1 },
    //   '平均流入',
    //   '平均流出'
    // ],

    show: true,
    right: '0',
    itemWidth: 8,
    itemHeight: 8,
    icon: 'rect',
    textStyle: {
      color: '#ffffff',
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      textStyle: {
        color: '#88D7FD',
      },
    },
    nameTextStyle: {
      color: '#02BAFF',
    },
    data: [],
  },
  yAxis: [
    {
      type: 'value',
      name: '流量（MB）',
      nameTextStyle: {
        color: '#02BAFF',
      },
      axisLine: {
        lineStyle: {
          color: '#88D7FD',
        },
      },
      axisLabel: {
        textStyle: {
          color: '#88D7FD',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#353b5a',
        },
      },
    },
  ],
  series: [
    {
      name: '流入流量',
      type: 'line',
      smooth: true,
      data: [],
      // markLine: {
      //   data: [{ type: 'average', name: '平均流入' }],
      //   symbol: 'none'
      // },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#00F56E',
            },
            {
              offset: 0.5,
              color: 'rgba(0,0,0,0.00)',
            },
          ]),
        },
      },
    },
    {
      name: '流出流量',
      type: 'line',
      smooth: true,
      data: [],
      // markLine: {
      //   data: [{ type: 'average', name: '平均流出' }],
      //   symbol: 'none'
      // },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#B4DD26',
            },
            {
              offset: 0.5,
              color: 'rgba(0,0,0,0.00)',
            },
          ]),
        },
      },
    },
    {
      name: '平均流出流量',
      type: 'line',
      markLine: {
        data: [],
      },
    },
    {
      name: '平均流入流量',
      type: 'line',
      markLine: {
        data: [],
      },
    },
  ],
};

function TrunkCircuit(props: trunkCircuitProps) {
  const [widthWidth] = useViewport();
  const zoomVal = widthWidth / 1920;
  const [dateType, setDateType] = React.useState(1); // 1：24小时 2：7天
  const [portLists, setPortLists] = React.useState<any>([]);
  const [circuitId, setCircuitId] = React.useState<string>('');
  const [options, setOptions] = React.useState<{ [key: string]: any }>(
    baseOption
  );
  const [timeArr, setTime] = useState([]);
  const [active, setActive] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(true);

  const tabLists = [
    {
      id: 1,
      text: '24小时',
    },
    {
      id: 2,
      text: '7天',
    },
  ];
  const getStartAndEndTime = (data: any) => {
    let timeOut: any = [];
    if (dateType == 1) {
      const time = data.timePortDtos;
      const nowDate =
        new Date().getFullYear() +
        '-' +
        (new Date().getMonth() + 1) +
        '-' +
        new Date().getDate();
      timeOut.push(time[0]['collectTime']);
      timeOut.push(time[time.length - 1]['collectTime']);
    } else {
      timeOut.push(data.timePortDtos[0].collectTime);
      timeOut.push(data.timePortDtos[data.timePortDtos.length - 1].collectTime);
    }

    setTime(timeOut);
  };
  /** 按设备 ID 查询端口列表 */
  const getPortLists = () => {
    setLoading(true);
    getPortList({
      eqpId: props.eqpId, //  设备ID
      dateType: dateType + '', // 24小时传1  7天传2
    }).then((res) => {
      setPortLists(res?.data);
      setCircuitId(res?.data[0]?.circuitId + '');
      setLoading(false);
    });
  };

  /** 根据端口提供的电路 ID 获取流量 */
  const getPortDetail = (circuitId: string) => {
    if (circuitId.length === 0 || circuitId === 'undefined') {
      return;
    }

    setLoading(true);

    getPortDetails({
      circuitId,
      dateType: dateType + '', // 24小时传1  7天传2
    }).then((res) => {
      setLoading(false);

      if (res?.data?.dto) {
        // const showX = res?.data?.dto.timePortDtos.map((i: any) => {
        //   return dateType == 1 ? i.showTime : i.collectTime;
        // });
        const showX = res.data.dto.showX.reverse();
        getStartAndEndTime(res.data.dto);
        drawHandle(
          showX,
          res?.data?.dto.timePortDtos,
          res.data.dto.avgReceiveRateSUM,
          res.data.dto.avgSendOutRateSUM
        );
      }
    });
  };

  const drawHandle = (
    showX: any[],
    timePortDtos: any[],
    avgInput: any,
    avgOutput: any
  ) => {
    // 判断是否为 7 天
    // if (dateType == 2) {
    //   showX = showX.map((item: any, index: number) => {
    //     const dateArray = item.split('-');
    //     console.log('7天', dateArray);
    //     return dateArray[1] + '-' + dateArray[2];
    //   });
    // }
    let avgReceiveRateShowList: number[] = [];
    let avgSendOutRateShowList: number[] = [];

    timePortDtos &&
      timePortDtos.map((item: any, index: number) => {
        avgReceiveRateShowList.push(item.avgReceiveRate);
      });
    timePortDtos &&
      timePortDtos.map((item: any, index: number) => {
        avgSendOutRateShowList.push(item.avgSendOutRate);
      });

    let newOptions = {
      ...baseOption,
      tooltip: {
        trigger: 'axis',
        padding: 0,
        backgroundColor: 'transparent',
        formatter: (params: any) => {
          let vDom = '';

          vDom =
            vDom +
            `<p style='display:flex;justify-conten:space-between;'>
              <span style='text-align:left;margin-bottom: 8px'>
              <span class='el-icon-time'></span>
              时间：</span>
              <span style='text-align:right;flex:1;color: #51FEFFFF'>${params[0].axisValue}</span>
            </p>`;

          for (let i = 0; i < params.length; i++) {
            const element = params[i];
            vDom += `<p style='display:flex;justify-conten:space-between;'>
            <span style='text-align:left;margin-bottom: 8px'>
               <span style='display:inline-block;width:10px;margin-right:13px;height:10px;background-color:${
                 element.color
               }'></span>
            ${element.seriesName}：</span>
            <span style='text-align:right;flex:1;color: #51FEFFFF'>${Number(
              element.value
            )}<span style='color:#fff;padding:5px'>MB</span></span></span></p>`;
          }

          vDom += `<p style='display:flex;justify-conten:space-between;'>
            <span style='text-align:left;margin-bottom: 8px'>
               <span style='display:inline-block;width:10px;margin-right:13px;height:10px;background-color:#11EBD3'></span>平均流出流量：</span><span style='text-align:right;flex:1;color: #51FEFFFF'>${Number(
                 avgOutput
               )}<span style='color:#fff;padding:5px'>MB</span></span></span></p>
<p style='display:flex;justify-conten:space-between;'>
            <span style='text-align:left;margin-bottom: 8px'>
               <span style='display:inline-block;width:10px;margin-right:13px;height:10px;background-color:#D06620'></span>平均流入流量：</span>
            <span style='text-align:right;flex:1;color: #51FEFFFF'>${Number(
              avgInput
            )}<span style='color:#fff;padding:5px'>MB</span></span></span></p>`;

          vDom = `<div style='border: 1px solid #51feff;color: #ffffff;padding: 15px 15px 7px;border-radius: 5px;background: rgba(0,0,0,0.5);'>${vDom}</div>`;

          return vDom;
        },
      },
      xAxis: {
        ...baseOption.xAxis,
        data: showX,
      },
      series: [
        {
          name: '流入流量',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: avgReceiveRateShowList,
          // markLine: {
          //   data: [{ type: 'average', name: '平均流入' }],
          //   symbol: 'none',
          //   lineStyle: { color: '#11EBD3' }
          // },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#00F56E',
                },
                {
                  offset: 0.5,
                  color: 'rgba(0,0,0,0.00)',
                },
              ]),
            },
          },
        },
        {
          name: '流出流量',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: avgSendOutRateShowList,
          // markLine: {
          //   data: [{ type: 'average', name: '平均流出' }],
          //   symbol: 'none'
          // },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#B4DD26',
                },
                {
                  offset: 0.5,
                  color: 'rgba(0,0,0,0.00)',
                },
              ]),
            },
          },
        },
        {
          name: '平均流出流量',
          type: 'line',
          markLine: {
            data: [
              {
                symbol: 'none',
                yAxis: avgOutput,
                label: {
                  shadowColor: 'transparent',
                  fontSize: 12,
                  color: '#fff',
                  formatter: (value: any) => {
                    return value.data.yAxis;
                  },
                },
              },
            ],
          },
        },
        {
          name: '平均流入流量',
          type: 'line',
          markLine: {
            data: [
              {
                symbol: 'none',
                yAxis: avgInput,
                label: {
                  shadowColor: 'transparent',
                  fontSize: 12,
                  color: '#fff',
                  formatter: (value: any) => {
                    return value.data.yAxis;
                  },
                },
              },
            ],
          },
        },
        // {
        //   name: '平均流入',
        //   type: 'line',
        //   smooth: true,
        //   data: [],
        //   colorBy: 'data',
        //   areaStyle: {
        //     normal: {
        //       color: '#D06620'
        //     }
        //   }
        // },
        // {
        //   name: '平均流出',
        //   type: 'line',
        //   smooth: true,
        //   data: [],
        //   areaStyle: {
        //     normal: {
        //       color: '#D06620'
        //     }
        //   }
        // }
      ],
    };

    setOptions(newOptions);
  };

  React.useEffect(() => {
    getPortLists();
  }, []);

  React.useEffect(() => {
    getPortDetail(circuitId);
  }, [dateType, circuitId]);

  // @ts-ignore
  const renderDetailView = (): JSX.Element => {
    return loading ? (
      <Spin
        spinning={loading}
        tip="正在加载"
        style={{ width: '100%', paddingTop: '90px' }}
      />
    ) : portLists.length == 0 ? (
      <div
        style={{
          width: '100%',
          height: '50px',
          textAlign: 'center',
          lineHeight: '50px',
          color: 'rgb(144, 147, 153)',
        }}
      >
        暂无数据
      </div>
    ) : (
      <>
        <div className={widgetsCss['time-content']}>
          时间范围：
          {timeArr.length > 0 ? timeArr[0] + '-' + timeArr[1] : ''}
        </div>

        <div
          className={widgetsCss['charts-content']}
          style={{ zoom: 1 / zoomVal }}
        >
          <Charts option={options} data={options} />
        </div>

        <div className={widgetsCss['trunk-items-content']}>
          <ul>
            {portLists &&
              portLists.map((item: any, index: number) => (
                <li
                  key={index}
                  onClick={() => {
                    // circuitId 电路ID 查流量时使用
                    setCircuitId(item.circuitId);
                    setActive(index);
                  }}
                >
                  <div
                    className={
                      index === active
                        ? widgetsCss['trunk-item-box-active']
                        : widgetsCss['trunk-item-box']
                    }
                  >
                    <div className={widgetsCss['trunk-item-top']}>
                      <div className={widgetsCss['left-icon']}></div>
                      <div
                        className={widgetsCss['trunk-item-title']}
                        title={item.portDiscern ? item.portDiscern : '-'}
                      >
                        {item.portDiscern ? item.portDiscern : '-'}
                      </div>
                    </div>
                    <div className={widgetsCss['trunk-item-info']}>
                      <div className={widgetsCss['info-box']}>
                        <div className={widgetsCss['info-icon']}></div>
                        <div className={widgetsCss['info-title']}>电路类型</div>
                        <div
                          className={widgetsCss['info-text']}
                          title={item.circuitType ? item.circuitType : '-'}
                        >
                          {item.circuitType ? item.circuitType : '-'}
                        </div>
                      </div>
                      <div className={widgetsCss['info-box']}>
                        <div className={widgetsCss['info-icon']}></div>
                        <div className={widgetsCss['info-title']}>
                          流入带宽利用率
                        </div>
                        <div
                          className={widgetsCss['info-text-number']}
                          title={
                            item.avgReceiveRatePercentage
                              ? item.avgReceiveRatePercentage + '%'
                              : '-'
                          }
                        >
                          {item.avgReceiveRatePercentage
                            ? item.avgReceiveRatePercentage + '%'
                            : '-'}
                        </div>
                      </div>
                      <div className={widgetsCss['info-box']}>
                        <div className={widgetsCss['info-icon']}></div>
                        <div className={widgetsCss['info-title']}>
                          流出带宽利用率
                        </div>
                        <div
                          className={widgetsCss['info-text-number']}
                          title={
                            item.avgSendOutRatePercentage
                              ? item.avgSendOutRatePercentage + '%'
                              : '-'
                          }
                        >
                          {item.avgSendOutRatePercentage
                            ? item.avgSendOutRatePercentage + '%'
                            : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={widgetsCss['top-content']}>
        <div className={widgetsCss['title-content']}>
          <DevNameView devName={props.eqpName} />
        </div>
        <div className={widgetsCss['tabs-content']}>
          {tabLists.map((item) => (
            <span
              className={dateType === item.id ? widgetsCss['active'] : ''}
              key={item.id}
              onClick={() => {
                setDateType(item.id);
              }}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>
      {/*{loading ? (*/}
      {/*  <Spin tip='正在加载' style={{ width: '100%', paddingTop: '50px' }} />*/}
      {/*) : (*/}
      {/*  renderDetailView()*/}
      {/*)}*/}
      {renderDetailView()}
    </>
  );
}

export default TrunkCircuit;
