export const OUT_URL = {
  circuit: {
    title: '电路呈现',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&rightState=dianlu&session=true&hiddenHeader=true',
  },
  importCustomCircuit: {
    title: '重点客户电路',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&rightState=kehu&session=true&hiddenHeader=true',
  },
  building: {
    title: '楼宇',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&rightState=louyu&session=true&hiddenHeader=true',
  },
  room: {
    title: '机房',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&rightState=jifang&session=true&hiddenHeader=true',
  },
  flowMonitor: {
    title: '专线流量监控',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=350000000000&session=true&table=flowMonitoringView&hiddenHeader=true',
  },
  internationalRes: {
    title: '国际资源',
    url: '',
  },
  opticalNet: {
    title: '光缆网',
    url: '//10.186.255.206/dwlp-front/#/homeScreen ',
  },
  dataNet: {
    title: '数据网',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&rightState=shuju&session=true&pageName=数据网',
  },
  translationNet: {
    title: '传输网',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&rightState=jifang&rightParame=传输网&session=true&hiddenHeader=true',
  },
  transmissionSysDetail: {
    title: '传输网系统详情',
    url: '//10.186.255.206/resourceCenter/#/networkAutoLogin?province=0&rightState=kehu&session=true&hi&noHeader=1&hiddenHeader=true',
  },
  wirelessNet: {
    title: '无线网',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&rightState=wuxian&session=true&hiddenHeader=true',
  },
  coreNet: {
    title: '核心网',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&rightState=jifang&rightParame=核心网&session=true&hiddenHeader=true',
  },
  accessNet: {
    title: '宽带资源',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&rightState=jifang&rightParame=接入网&session=true&hiddenHeader=true',
  },
  quality: {
    title: '数据治理质量看板',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&table=selfCountryView&session=true&hiddenHeader=true',
  },
  order: {
    title: '订单总览',
    url: '//10.186.255.206/resourceCenter/#/autoLogin?province=0&table=workOrderLists&session=true&hiddenHeader=true',
  },
  _3dExample: {
    title: '天津市东丽区空港IDC机房三号楼',
    url: '//10.245.6.128:8098/3dview/',
  },
};
export const MAP_RES = [
  {
    index: 5,
    name: '核心网',
    key: 'coreNet',
  },
  {
    index: 2,
    name: '数据网',
    key: 'dataNet',
  },
  {
    index: 6,
    name: '接入网',
    key: 'accessNet',
  },
  {
    index: 8,
    name: 'IDC资源',
    key: 'idcRes',
  },
  {
    index: 7,
    name: '国际资源',
    key: 'internationalRes',
  },
  {
    index: 1,
    name: '光缆网',
    key: 'optNet',
  },
  {
    index: 0,
    name: '空间资源',
    key: 'spcRes',
  },
  {
    index: 3,
    name: '传输网',
    key: 'trsNet',
  },
  {
    index: 4,
    name: '无线资源',
    key: 'wireNet',
  },
];

export const MAP_COLOR = [
  '#0aff99',
  '#ff8700',
  '#1BBAFF',
  '#a1ff0a',
  '#FAFF00',
  '#0aefff',
];

export const MAP_CODE = [
  { code: '110000000000', name: '北京' },
  { code: '120000000000', name: '天津' },
  { code: '140000000000', name: '山西' },
  { code: '150000000000', name: '内蒙古' },
  { code: '210000000000', name: '辽宁' },
  { code: '220000000000', name: '吉林' },
  { code: '230000000000', name: '黑龙江' },
  { code: '310000000000', name: '上海' },
  { code: '320000000000', name: '江苏' },
  { code: '330000000000', name: '浙江' },
  { code: '340000000000', name: '安徽' },
  { code: '350000000000', name: '福建' },
  { code: '360000000000', name: '江西' },
  { code: '370000000000', name: '山东' },
  { code: '410000000000', name: '河南' },
  { code: '420000000000', name: '湖北' },
  { code: '430000000000', name: '湖南' },
  { code: '440000000000', name: '广东' },
  { code: '450000000000', name: '广西' },
  { code: '460000000000', name: '海南' },
  { code: '500000000000', name: '重庆' },
  { code: '510000000000', name: '四川' },
  { code: '520000000000', name: '贵州' },
  { code: '530000000000', name: '云南' },
  { code: '540000000000', name: '西藏' },
  { code: '610000000000', name: '陕西' },
  { code: '620000000000', name: '甘肃' },
  { code: '630000000000', name: '青海' },
  { code: '640000000000', name: '宁夏' },
  { code: '650000000000', name: '新疆' },
  { code: '130000000000', name: '河北' },
];
export const DEVICE_TYPE_CODE = {
  producer: '1',
  modal: '2',
  device: '3',
  port: '4',
};
export const QUALITY_TYPE_CODE = {
  userLuminousAttenuation: '1',
  bigLuminousAttenuation: '2',
};
export const INTERNATIONAL_INFO_PLAY_DELAY = 0;
export const INTERNATIONAL_INFO_PLAY_TIME = 40 * 1000;

export const BUSINESS_TYPE = {
  networkingCircuit: '1',
  businessCircuit: '2',
};
