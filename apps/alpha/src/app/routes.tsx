import React from 'react';

const OperationSchedule = React.lazy(
  () => import('@alpha/app/topic/operation-schedule/operation-schedule')
);
const SignalDedicated = React.lazy(
  () => import('@alpha/app/topic/signal-dedicated-line/signal-dedicated-line')
);
const Transmission = React.lazy(
  () => import('@alpha/app/topic/transmission/transmission')
);
const International = React.lazy(
  () => import('@alpha/app/topic/international/international')
);
const IDCResourceView = React.lazy(
  () => import('@alpha/app/topic/idc-resource-analysis/idc-resource-analysis')
);
// 通建路由
 // 资源质量
const QualityBoardView = React.lazy(
  () => import('@alpha/app/topic-tj/quality-board/quality-board')
);
 // 无线网
const WirelessNetworkView = React.lazy(
  () => import('@alpha/app/topic-tj/wireless-network/wireless-network')
);
 // 数据网
const DatasNetworkView = React.lazy(
  () => import('@alpha/app/topic-tj/datas-network/datas-network')
);

// 核心网
const CoreNetworkView = React.lazy(
  () => import('@alpha/app/topic-tj/core-network/core-network')
);

const BroadBand = React.lazy(
  ()=>import('@alpha/app/topic/broadband-2/broadband')
)
export const routesTopicConfig = [
  {
    name: '号线专题',
    title: '号线专题',
    component: <SignalDedicated />,
    url: 'signal',
  },
  {
    name: '调度运营',
    component: <OperationSchedule />,
    title: '调度运营专题',
    url: 'operation',
  },
  {
    name: '传输网',
    title: '传输网',
    component: <Transmission />,
    url: 'transmission',
  },
  {
    name: '国际资源',
    component: <International />,
    title: '国际资源专题',
    url: 'international',
  },
  {
    name: 'IDC资源',
    component: <IDCResourceView />,
    title: 'IDC资源运营视图',
    url: 'idc',
  },
  // 通建-质量看板
  {
    name: '资源质量',
    component: <QualityBoardView />,
    title: '资源质量',
    url: 'qualityBoard',
  },
  // 通建-无线网
  {
    name: '无线网',
    component: <WirelessNetworkView />,
    title: '无线网资可视化',
    url: 'wirelessNetwork',
  },
  // 通建-数据网
  {
    name: '数据网',
    component: <DatasNetworkView />,
    title: '数据网',
    url: 'datasNetwork',
  },
  // 通建-核心网
  {
    name: '核心网',
    component: <CoreNetworkView />,
    title: '核心网',
    url: 'coreNetwork',
  },
  {
    name: '宽带资源',
    component: <BroadBand/>,
    title: '宽带资源可视化',
    url:'broadband'
  }
];

export const getTopicUrl = (name: string) => {
  const filter = routesTopicConfig.filter((item) => item.name === name);

  return filter && filter[0] ? filter[0].url : undefined;
};
