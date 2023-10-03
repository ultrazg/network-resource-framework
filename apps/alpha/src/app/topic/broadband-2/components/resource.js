const nameMap = [
  {
    standardAddrTotal: '标准地址数',
    oltTotal: 'OLT设备数',
    obdTotal: 'OBD设备数',
    onuTotal: 'ONU设备数',
    ponPortTotal: 'PON端口数',
    obdPortTotal: 'OBD端子数',
    ponPortRate: 'PON端口利用率',
    obdPortRate: 'OBD端子利用率',
  },
  {
    oltTotal: 'OLT设备数',
    singleOltTotal: '单上联OLT设备数',
    doubleOltTotal: '双上联OLT设备数',
    doubleOltRate: 'OLT双上联占比',
  },
  {
    coverVillage: '资源覆盖小区数量',
    ponVillageNum: '10G PON覆盖小区数量',
    openServiceVillageNum: '开通业务小区数量',
    openServiceVillageRate: '开通业务小区占比',
    openServiceHectoHouseVillageNum: '开通业务百户小区数量',
  },
];

const provinces = [
  '北京',
  '天津',
  '上海',
  '重庆',
  '新疆',
  '西藏',
  '宁夏',
  '内蒙古',
  '广西',
  '黑龙江',
  '吉林',
  '辽宁',
  '河北',
  '山东',
  '江苏',
  '安徽',
  '浙江',
  '福建',
  '广东',
  '海南',
  '云南',
  '贵州',
  '四川',
  '湖南',
  '湖北',
  '河南',
  '山西',
  '陕西',
  '甘肃',
  '青海',
  '江西',
  '台湾',
  '香港',
  '澳门',
];

const names = [
  ['PON端口数', 'OBD端子数', 'PON端口利用率', 'OBD端子利用率'],
  ['OLT双上联占比'],
  ['开通业务小区占比'],
];

const legendColors = [
  '#591c7f',
  '#390677',
  '#061685',
  '#034e93',
  '#076c6a',
  '#246e19',
];

const legendDes = [
  '≤20%',
  '20%-50%',
  '50%-70%',
  '70%-80%',
  '80%-90%',
  '90%-100%',
];

export { provinces, nameMap, names, legendColors, legendDes };
