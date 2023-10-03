// 客户电路
import React from 'react';
import widgetsCss from '@alpha/app/topic-tj/datas-network/widgets/widgets.module.scss';
import DevNameView from '../dev-list-dialog/dev-name/dev-name';
import Charts from '../../../../../../../libs/chart/src/lib/chart';
import { getDeviceCustStatistics } from '../../api/datasNetwork';
import { useViewport } from '@alpha/app/context/viewport-context';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';

export interface customerCircuitProps {
  eqpId?: string;
  eqpName: string;
}

// window.addEventListener(
//   'resize',
//   () => {
//     Charts.resize();
//   },
//   false
// );

const baseOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['平均流入流量', '平均流出流量'],
    right: '0',
    icon: 'rect',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      color: '#ffffff'
    }
  },
  grid: {
    left: '5%',
    right: '3%',
    bottom: '10%',
    containLabel: false
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    splitNumber: 12,
    interval: 12,
    axisLabel: {
      fontSize: 9,
      showMinLabel: true, //显示最小值
      showMaxLabel: true, //显示最大值
      textStyle: {
        color: '#88D7FD'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#353b5a'
      }
    },
    axisLabel: {
      textStyle: {
        color: '#88D7FD'
      }
    }
  },
  series: [
    {
      name: '平均流入流量',
      type: 'line',
      stack: 'Total',
      data: [],
      lineStyle: {
        normal: {
          color: '#43CAFF'
        }
      }
    },
    {
      name: '平均流出流量',
      type: 'line',
      stack: 'Total',
      data: [],
      lineStyle: {
        normal: {
          color: '#CC91FF'
        }
      }
    }
  ]
};

function CustomerCircuit(props: customerCircuitProps) {
  const [dateType, setDateType] = useState(1); // 1：24小时 2：7天
  const [dataLists, setDataLists] = useState([]);
  const [active, setActive] = useState(0);
  const [options, setOptions] = useState<{ [key: string]: any }>(baseOption);
  const [selected, setSelected] = useState<{ [key: string]: any }>({});
  const [timeArr, setTime] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const tabLists = [
    {
      id: 1,
      text: '24小时'
    },
    {
      id: 2,
      text: '7天'
    }
  ];

  const getCustomerCircuit = () => {
    setLoading(true);
    getDeviceCustStatistics({
      eqpId: props.eqpId,
      dateType
    }).then((res) => {
      setDataLists(res?.data);
      drawHandle(res.data[0]);
      setSelected(res.data[0]);
      if (res.data.length > 0) {
        getStartAndEndTime(res.data[0]);
      }
      setActive(0);
      setLoading(false);
    });
  };

  const getStartAndEndTime = (data: any) => {
    let timeOut: any = [];
    if (dateType == 1) {
      if (data?.timePortDay) {
        timeOut.push(data?.timePortDay[0].collectTime);
        timeOut.push(data?.timePortDay[data.timePortDay.length - 1].collectTime);
      }
    } else {
      if (data?.timePortWeek) {
        timeOut.push(data?.timePortWeek[0].collectTime);
        timeOut.push(data?.timePortWeek[data.timePortWeek.length - 1].collectTime);
      }
    }
    // console.log('timeArr', timeOut);

    setTime(timeOut);
  };

  useEffect(() => {
    getCustomerCircuit();
  }, []);

  useEffect(() => {
    if (JSON.stringify(selected) !== '{}') {
      getStartAndEndTime(selected);
      drawHandle(selected);
    }
  }, [dateType]);
  const drawHandle = (item?: any) => {
    let xData: any = [];
    let yInFlowData: any = [];
    let yOutFiowData: any = [];
    if (dateType == 1) {
      item &&
      item.timePortDay.forEach((item: any) => {
        xData.push(item.showTime);
        yInFlowData.push(item.avgReceiveRateShow);
        yOutFiowData.push(item.avgSendOutRateShow);
      });
    } else {
      item &&
      item.timePortWeek.forEach((item: any) => {
        xData.push(item.collectTime);
        yInFlowData.push(item.avgReceiveRateShow);
        yOutFiowData.push(item.avgSendOutRateShow);
      });
    }
    let newOption = {
      ...baseOption,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
        axisLabel: {
          textStyle: {
            color: '#88D7FD'
          },
          formatter: (val: any) => {
            if (dateType == 2) {
              const dateArray = val.split('-');
              return dateArray[1] + '-' + dateArray[2];
            } else {
              return val;
            }
          }
        }
      },
      series: [
        {
          name: '平均流入流量',
          type: 'line',
          stack: 'Total',
          smooth: true,
          showSymbol: false,
          data: yInFlowData,
          itemStyle: {
            normal: {
              color: '#43CAFF',
              lineStyle: {
                normal: {
                  color: '#43CAFF'
                }
              }
            }
          }
        },
        {
          name: '平均流出流量',
          type: 'line',
          stack: 'Total',
          smooth: true,
          showSymbol: false,
          data: yOutFiowData,
          itemStyle: {
            normal: {
              color: '#CC91FF',
              lineStyle: {
                normal: {
                  color: '#CC91FF'
                }
              }
            }
          }
        }
      ]
    };

    setOptions(newOption);
  };

  const renderDetailView = () => {
    const [widthWidth] = useViewport();
    const zoomVal = widthWidth / 1920;
    if (dataLists.length === 0) {
      return (
        <div
          style={{
            width: '100%',
            height: '50px',
            textAlign: 'center',
            lineHeight: '50px',
            color: 'rgb(144, 147, 153)'
          }}
        >
          暂无数据
        </div>
      );
    } else {
      return (
        <div>
          <div className={widgetsCss['time-content']}>
            时间范围：{timeArr.length > 0 ? timeArr[0] + '-' + timeArr[1] : ''}
          </div>
          <div
            className={widgetsCss['charts-content']}
            style={{ zoom: 1 / zoomVal }}
          >
            <Charts option={options} data={options} />
          </div>

          {/*<div className={widgetsCss['tip-text']}>最多选择 5 名客户</div>*/}

          <div className={widgetsCss['customer-items-content']}>
            {dataLists.map((item: any, index: number) => (
              <div
                key={index}
                className={widgetsCss['customer-item']}
                onClick={() => {
                  setActive(index);
                  setSelected(item);
                  drawHandle(item);
                }}
              >
                <div className={widgetsCss['customer-item-card']}>
                  <div className={widgetsCss['customer-item-group-icon']}></div>
                  <div className={widgetsCss['customer-item-info']}>
                    <div className={widgetsCss['customer-item-top']}>
                      <div className={widgetsCss['title-box']}>
                        <div
                          className={
                            active === index
                              ? widgetsCss['icon-active']
                              : widgetsCss['icon']
                          }
                        ></div>
                        <div
                          className={
                            active === index
                              ? widgetsCss['title-active']
                              : widgetsCss['title']
                          }
                        >
                          {item?.circuitName}
                        </div>
                        <div
                          className={
                            active === index
                              ? widgetsCss['icon-active'] +
                              ' ' +
                              widgetsCss['icon-right']
                              : widgetsCss['icon']
                          }
                        ></div>
                      </div>
                    </div>
                    <div className={widgetsCss['customer-item-detail']}>
                      <div className={widgetsCss['info-group']}>
                        <div className={widgetsCss['info-box']}>
                          <div className={widgetsCss['info-icon']}></div>
                          <div className={widgetsCss['info-title']}>
                            业务号码
                          </div>
                          <div className={widgetsCss['info-text']} title={item?.businessNumber}>
                            {item?.businessNumber}
                          </div>
                        </div>
                        <div className={widgetsCss['info-box']}>
                          <div className={widgetsCss['info-icon']}></div>
                          <div className={widgetsCss['info-title']}>
                            端口名称
                          </div>
                          <div className={widgetsCss['info-text']} title={item?.portDiscern}>
                            {item?.portName}
                          </div>
                        </div>
                      </div>
                      <div className={widgetsCss['info-group']}>
                        <div className={widgetsCss['info-box']}>
                          <div className={widgetsCss['info-icon']}></div>
                          <div className={widgetsCss['info-title']}>
                            流入带宽利用率
                          </div>
                          <div className={widgetsCss['info-text-number']} title={item?.avgReceiveRate + '%'}>
                            {item?.avgReceiveRate}%
                          </div>
                        </div>
                        <div className={widgetsCss['info-box']}>
                          <div className={widgetsCss['info-icon']}></div>
                          <div className={widgetsCss['info-title']}>
                            流出带宽利用率
                          </div>
                          <div className={widgetsCss['info-text-number']} title={item?.avgSendOutRate + '%'}>
                            {item?.avgSendOutRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
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

      {
        loading
          ? <Spin spinning={true} tip='正在加载' style={{ width: '100%', paddingTop: '50px' }} />
          : renderDetailView()
      }
    </>
  );
}

export default CustomerCircuit;
