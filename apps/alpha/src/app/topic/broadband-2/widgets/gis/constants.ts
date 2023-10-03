import IconBuilding from '@alpha/app/topic/broadband-2/images/gis/button/building.svg';
import IconNoneWifi from '@alpha/app/topic/broadband-2/images/gis/button/none-wifi.svg';
import IconOLT from '@alpha/app/topic/broadband-2/images/gis/button/olt.svg';
import IconONU from '@alpha/app/topic/broadband-2/images/gis/button/onu.svg';
import IconUnit from '@alpha/app/topic/broadband-2/images/gis/button/unit.svg';
import IconLAN from '@alpha/app/topic/broadband-2/images/gis/button/lan.svg';
import IconSplitter from '@alpha/app/topic/broadband-2/images/gis/button/splitter.svg';
import IconOLTY from '@alpha/app/topic/broadband-2/images/marker/2510_1.png';
import IconOLTP from '@alpha/app/topic/broadband-2/images/marker/2510_2.png';
import IconOBD from '@alpha/app/topic/broadband-2/images/marker/OBD.png';
import IconBuilding0 from '@alpha/app/topic/broadband-2/images/marker/0000_0.png';
import IconBuilding100 from '@alpha/app/topic/broadband-2/images/marker/0000_1.png';
import IconBuilding1000 from '@alpha/app/topic/broadband-2/images/marker/0000_2.png';

import m0 from '@alpha/app/topic/broadband-2/images/marker/0.png';
import m1 from '@alpha/app/topic/broadband-2/images/marker/1.png';
import m704 from '@alpha/app/topic/broadband-2/images/marker/704.png';
import m2401 from '@alpha/app/topic/broadband-2/images/marker/2401.png';
import m2510 from '@alpha/app/topic/broadband-2/images/marker/2510.png';
import m2510Y from '@alpha/app/topic/broadband-2/images/marker/2510_1.png';
import m2510P from '@alpha/app/topic/broadband-2/images/marker/2510_2.png';
import m2511 from '@alpha/app/topic/broadband-2/images/marker/2511.png';
import m2530 from '@alpha/app/topic/broadband-2/images/marker/2530.png';
import m2530Y from '@alpha/app/topic/broadband-2/images/marker/2530_Y.png';
import m2530G from '@alpha/app/topic/broadband-2/images/marker/2530_G.png';
import m2530R from '@alpha/app/topic/broadband-2/images/marker/2530_R.png';
import m0000 from '@alpha/app/topic/broadband-2/images/marker/0000.png';
import m0000_0 from '@alpha/app/topic/broadband-2/images/marker/0000_0.png';
import m0000_1 from '@alpha/app/topic/broadband-2/images/marker/0000_1.png';
import m0000_2 from '@alpha/app/topic/broadband-2/images/marker/0000_2.png';

import m0000_0_R from '@alpha/app/topic/broadband-2/images/marker/0000_0_R.png';
import m0000_0_Y from '@alpha/app/topic/broadband-2/images/marker/0000_0_Y.png';
import m0000_0_G from '@alpha/app/topic/broadband-2/images/marker/0000_0_G.png';
import m0000_100_R from '@alpha/app/topic/broadband-2/images/marker/0000_100_R.png';
import m0000_100_Y from '@alpha/app/topic/broadband-2/images/marker/0000_100_Y.png';
import m0000_100_G from '@alpha/app/topic/broadband-2/images/marker/0000_100_G.png';
import m0000_1000_R from '@alpha/app/topic/broadband-2/images/marker/0000_1000_R.png';
import m0000_1000_Y from '@alpha/app/topic/broadband-2/images/marker/0000_1000_Y.png';
import m0000_1000_G from '@alpha/app/topic/broadband-2/images/marker/0000_1000_G.png';

export const RES_TYPE_LIST = [
  {
    id: '2530',
    name: '光分路器设备（OBD）',
  },
  {
    id: '2510',
    name: 'OLT设备',
  },
  {
    id: '0000',
    name: '小区',
  },
  {
    id: '2511',
    name: 'ONU设备',
  },

  {
    id: '2401',
    name: 'LAN交换机',
  },
  {
    id: '704',
    name: '光分纤盒',
  },
];
export const markers: MarkerType = {
  m0: new BMapGL.Icon(m0, new BMapGL.Size(32, 38)),
  m1: new BMapGL.Icon(m1, new BMapGL.Size(32, 38)),
  m704: new BMapGL.Icon(m704, new BMapGL.Size(32, 36)),
  m2401: new BMapGL.Icon(m2401, new BMapGL.Size(32, 36)),
  m2510: new BMapGL.Icon(m2510, new BMapGL.Size(32, 36)),
  m2510Y: new BMapGL.Icon(m2510Y, new BMapGL.Size(32, 36)),
  m2510P: new BMapGL.Icon(m2510P, new BMapGL.Size(32, 36)),
  m2511: new BMapGL.Icon(m2511, new BMapGL.Size(32, 36)),
  m2530: new BMapGL.Icon(m2530, new BMapGL.Size(32, 36)),
  m2530Y: new BMapGL.Icon(m2530Y, new BMapGL.Size(32, 37)),
  m2530G: new BMapGL.Icon(m2530G, new BMapGL.Size(32, 37)),
  m2530R: new BMapGL.Icon(m2530R, new BMapGL.Size(32, 37)),
  m0000: new BMapGL.Icon(m0000, new BMapGL.Size(32, 32)),
  m0000_0: new BMapGL.Icon(m0000_0, new BMapGL.Size(32, 32)),
  m0000_1: new BMapGL.Icon(m0000_1, new BMapGL.Size(32, 32)),
  m0000_2: new BMapGL.Icon(m0000_2, new BMapGL.Size(32, 32)),
  m0000_0_R: new BMapGL.Icon(m0000_0_R, new BMapGL.Size(33, 40)),
  m0000_0_Y: new BMapGL.Icon(m0000_0_Y, new BMapGL.Size(33, 40)),
  m0000_0_G: new BMapGL.Icon(m0000_0_G, new BMapGL.Size(33, 40)),
  m0000_100_R: new BMapGL.Icon(m0000_100_R, new BMapGL.Size(34, 40)),
  m0000_100_Y: new BMapGL.Icon(m0000_100_Y, new BMapGL.Size(34, 40)),
  m0000_100_G: new BMapGL.Icon(m0000_100_G, new BMapGL.Size(34, 40)),
  m0000_1000_R: new BMapGL.Icon(m0000_1000_R, new BMapGL.Size(33, 40)),
  m0000_1000_Y: new BMapGL.Icon(m0000_1000_Y, new BMapGL.Size(33, 40)),
  m0000_1000_G: new BMapGL.Icon(m0000_1000_G, new BMapGL.Size(33, 40)),
};

export const defaultProvince = {
  name: '',
  id: '1',
  children: [
    {
      name: '',
      id: '1-1',
      children: [{ name: '', id: '1-1-1' }],
    },
  ],
};

export const buttonList = [
  {
    name: '宽带覆盖小区',
    icon: IconBuilding,
  },
  {
    name: '宽带无覆盖小区',
    icon: IconNoneWifi,
  },
  {
    name: 'OLT设备',
    icon: IconOLT,
  },
  {
    name: 'ONU设备',
    icon: IconONU,
  },
  {
    name: '光分路器设备',
    icon: IconUnit,
  },
  {
    name: 'LAN交换机',
    icon: IconLAN,
  },
  {
    name: '光分纤盒',
    icon: IconSplitter,
  },
];

export const deviceLegendList: LegendObj[] = [
  {
    name: '单上联OLT设备',
    icon: IconOLTY,
    key: 'OLT_SINGLE',
  },
  {
    name: '双上联OLT设备',
    icon: IconOLTP,
    key: 'OLT_DOUBLE',
  },
  {
    name: 'OBD设备',
    icon: IconOBD,
    key: 'OBD',
  },
];

export const buildingLegendList: LegendObj[] = [
  {
    name: '千户小区',
    icon: IconBuilding1000,
    key: 'COMMUNITY_1000',
  },
  {
    name: '百户小区',
    icon: IconBuilding100,
    key: 'COMMUNITY_100',
  },
  {
    name: '普通小区',
    icon: IconBuilding0,
    key: 'COMMUNITY_0',
  },
];
export const resourceLegendList = [
  {
    name: '资源利用不足',
    color: '#FFBE00',
    limit: 30,
  },
  {
    name: '资源正常',
    color: '#3BFF00',
    limit: 80,
  },
  {
    name: '资源预警',
    color: '#FF3000',
    limit: 100,
  },
];
export const defaultLegendStatusMap = {
  OLT_SINGLE: false,
  OLT_DOUBLE: false,
  OBD: false,
  COMMUNITY_0: false,
  COMMUNITY_100: false,
  COMMUNITY_1000: false,
};
export const GIS_ALLOW_LIST = [
  '江苏',
  '黑龙江',
  '山西',
  '安徽',
  '广西',
  '贵州',
  '重庆',
  '青海',
  '宁夏',
];

export const GIS_LOCAL_DATA_LIST = ['江苏', '重庆', '北京'];

export const DIRECT_CITY_LIST = ['上海', '北京', '重庆', '天津'];
