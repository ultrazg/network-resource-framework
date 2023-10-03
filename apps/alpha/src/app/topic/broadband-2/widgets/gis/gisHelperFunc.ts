import {
  markers,
  resourceLegendList,
} from '@alpha/app/topic/broadband-2/widgets/gis/constants';
import Icon = BMapGL.Icon;

export function processOnePathLocal(item: LocalPathObj) {
  let start: DeviceObj = {
    EQP_ID: '',
    RES_TYPE_ID: '',
    WGS84_Y: 0,
    WGS84_X: 0,
  };
  let end: DeviceObj = {
    EQP_ID: '',
    RES_TYPE_ID: '',
    WGS84_Y: 0,
    WGS84_X: 0,
  };

  Object.keys(item)
    .filter((key) => key.includes('A_'))
    .forEach((key) => {
      // @ts-ignore
      start[key.slice(2)] = item[key];
    });
  Object.keys(item)
    .filter((key) => key.includes('Z_'))
    .forEach((key) => {
      // @ts-ignore
      end[key.slice(2)] = item[key];
    });

  start.IS_DOUBLE_CONN = item.IS_DOUBLE_CONN;
  end.ROOM_NUM = item.HOUSE_NUM;

  return [start, end];
}

export function processOnePath(item: PathObj) {
  let start: DeviceObj = {
    EQP_ID: '',
    RES_TYPE_ID: '',
    WGS84_Y: 0,
    WGS84_X: 0,
  };
  start.ONU_NUM = item.ONU_NUM;
  start.OBD_NUM = item.OBD_NUM;
  start.BUSINESS_ROOM_NUM = item.BUSINESS_ROOM_NUM;
  start.ROOM_NUM = item.ROOM_NUM;

  Object.keys(item)
    .filter((key) => key.includes('A_'))
    .forEach((key) => {
      // @ts-ignore
      start[key.slice(2)] = item[key];
    });
  let end: DeviceObj = {
    EQP_ID: '',
    RES_TYPE_ID: '',
    WGS84_Y: 0,
    WGS84_X: 0,
  };
  end.ONU_NUM = item.ONU_NUM;
  end.OBD_NUM = item.OBD_NUM;
  end.BUSINESS_ROOM_NUM = item.BUSINESS_ROOM_NUM;
  end.ROOM_NUM = item.ROOM_NUM;

  Object.keys(item)
    .filter((key) => key.includes('Z_'))
    .forEach((key) => {
      // @ts-ignore
      end[key.slice(2)] = item[key];
    });
  return [start, end];
}

export function getIconName(
  deviceTypeCode: '2510' | '2530' | '0000' | 'other',
  item: LocalIObject | DeviceObj
): Icon {
  if (deviceTypeCode === '2510') {
    return getOltDeviceIconName(item as LocalOltObj);
  } else if (deviceTypeCode === '2530') {
    return getObdDeviceIconName(item as LocalObdObj);
  }
  if (deviceTypeCode === '0000') {
    return getCommunityDeviceIconName(item as LocalCommunityObj);
  }
  if (deviceTypeCode === 'other') {
    return getDeviceIconName(item as DeviceObj);
  }
  return markers[`m${'RES_TYPE_ID' in item ? item.RES_TYPE_ID : '704'}`];
}

export function getDeviceIconName(item: DeviceObj) {
  if (item.RES_TYPE_ID == '2530') {
    const rate =
      Number(item.PORT_TAKEUP_RATE || item.PORT_OCCUPANCY_RATE || 0) * 100;
    if (rate < resourceLegendList[0].limit) {
      return markers['m2530Y'];
    } else if (rate < resourceLegendList[1].limit) {
      return markers['m2530G'];
    } else {
      return markers[`m2530R`];
    }
  } else if (item.RES_TYPE_ID == '2510') {
    return getOltDeviceIconName({
      eqpId: item.EQP_ID,
      isDoubleConn: item.IS_DOUBLE_CONN,
      wgs84Y: Number(item.WGS84_Y),
      wgs84X: Number(item.WGS84_X),
    });
  } else if (item.RES_TYPE_ID == '0000') {
    return getCommunityDeviceIconName({
      segmId: item.RES_TYPE_ID,
      portUsage: Number(item.PORT_OCCUPANCY_RATE) || 0,
      houseNum: item.ROOM_NUM || 0,
      wgs84Y: Number(item.WGS84_Y),
      wgs84X: Number(item.WGS84_X),
    });
  }
  return markers[`m${item.RES_TYPE_ID}`];
}

function getOltDeviceIconName(item: LocalOltObj) {
  if (item.isDoubleConn) {
    return markers[`m2510P`];
  }
  return markers[`m2510Y`];
}

function getObdDeviceIconName(item: LocalObdObj) {
  const portUsage = (item.portUsage || 0) * 100;
  if (portUsage < resourceLegendList[0].limit) {
    return markers[`m2530Y`];
  } else if (portUsage < resourceLegendList[1].limit) {
    return markers[`m2530G`];
  }
  return markers[`m2530R`];
}

function getCommunityDeviceIconName(item: LocalCommunityObj) {
  let name = 'm0000_';
  const houseNum = item.houseNum || 0;
  const portUsage = (item.portUsage || 0) * 100;
  houseNum >= 1000
    ? (name += '1000_')
    : houseNum >= 100
    ? (name += '100_')
    : (name += '0_');

  portUsage < resourceLegendList[0].limit
    ? (name += 'Y')
    : portUsage < resourceLegendList[1].limit
    ? (name += 'G')
    : (name += 'R');

  return markers[name];
}

export function getPointOffset(key: number, offsetSize: number) {
  // 列
  const remain = key % offsetSize ? key % offsetSize : offsetSize;
  const width = Math.floor(remain / 2) * (remain % 2 ? -1 : 1);
  // 行
  const height = Math.ceil(key / offsetSize) - 1;
  return [width, height];
}
/**
 * 查询坐标地址是否在中国境内，简略的写法。待优化为中国边境线查询
 * @param {string} x 经度
 * @param {string} y 纬度
 */
export function isCoordinatesWithinChina(x: string, y: string) {
  const [pointX, pointY] = [Number(x), Number(y)];
  if (73 < pointX && pointX < 135 && pointY > 3 && pointY < 54) {
    return true;
  }
  return false;
}

/**
 * 根据键值去重对象数组
 * @param {IObject[]} arr 需要去重的原数组
 * @param {string} uniId 需要去重的键
 */
export function uniqueArray(arr: IObject[], uniId: string) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}
