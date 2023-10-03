import { getAction, postAction } from '@alpha/utils/http';
import { store } from '@alpha/store';

// 数据网
export const getRoomTypes = () => {
  return getAction('/oss/roomPosition/getRoomTypes', {});
};

function queryDataNetworkRoomList(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};
  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }
  return postAction('/oss/dataNetwork/queryDataNetworkRoomList', params, {
    headers,
  });
}

function queryDataNetworkDeviceList(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};
  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }
  return postAction('/oss/dataNetwork/queryDataNetworkDeviceList', params, {
    headers,
  });
}

function queryDataNetworkDeviceTotal(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};
  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }
  return postAction('/oss/dataNetwork/queryDataNetworkDeviceTotal', params, {
    headers,
  });
}

// 资源拓扑
function queryCircuitRouteList(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};
  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }
  return postAction('/oss/circuitRoute/queryPositionRelation', params, {
    headers
  });
}
/** 获取机房设备信息 */
function getRoomDeviceInfo(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};
  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }
  return getAction('/oss/dataNetwork/getRoomDeviceInfo', params, {
    headers,
  });
}

/** 按设备查询端口列表 */
function getPortList(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return postAction('/oss/dataNetwork/getPortList', params, {
    headers,
  });
}

/** 根据端口提供的电路ID获取流量 */
function getPortDetails(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return postAction('/oss/dataNetwork/getPortDetails', params, {
    headers,
  });
}

function getCircuitList(params?: any): Promise<any> {
  return postAction('/oss/circuitRoute/queryCircuitRouteList', params);
}

function getcircuitInfo(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};
  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }
  return postAction('/oss/circuitRoute/queryCircuitRouteInfo', params, {
    headers,
  });
}

// 设备信息
function queryDataNetworkDeviceInfo(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return postAction('/oss/dataNetwork/queryDataNetworkDeviceInfo', params, {
    headers,
  });
}

// 设备端口信息
function queryPortListByEqpId(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return postAction('/oss/dataNetwork/queryPortListByEqpId', params, {
    headers,
  });
}

/** 客户电路 */
function getDeviceCustStatistics(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return postAction('/oss/dataNetwork/getDeviceCustStatistics', params, {
    headers,
  });
}
// 设备网络拓扑图
function getNetworkTopologyVo(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return getAction('/oss/dataNetwork/getNetworkTopologyVo', params, {
    headers,
  });
}

/** 查询楼宇详情信息 */
function getBldgDetail(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return postAction('/oss/bldgCoverRes/bldgDetail', params, {
    headers,
  });
}

//省份资源概览接口
function getResourcesAll(params: any): Promise<any> {
  return getAction('/oss/res/getResourcesAll', params);
}
// 省份视图右侧重点关注联路数数据（地市统计数据及其列表）
function getStatisticsData(params: any): Promise<any> {
  return getAction('/oss/dataNetwork/getFocusLinksInfo', params)
}
//全国视图左侧上角接以及地图数据
function getDataNetWorkLeft(params: any): Promise<any> {
  return getAction('/oss/dataNetwork/getDataNetWorkLeft', params);
}
// 全国视图-网络视图-全网流量+厂商占比数据查询
function getAllwebData(params: any): Promise<any> {
  return getAction('/oss/dataNetwork/getWholeNetworkAndFactoryDto', params);
}
// 全国视图-数据质量数据查询
function resourceQualityDetails(params: any): Promise<any> {
  return getAction('/oss/dataNetwork/resourceQualityDetails', params);
}

// 全国视图-网络视图-全网流量+专线业务
function getResourceEffic(params: any): Promise<any> {
  return getAction('/oss/dataNetwork/getResourceEfficiencyAnalysisDto', params);

}
//省份城域网资源利用率接口
function getUtilizationList(params: any): Promise<any> {
  return getAction('/oss/dataNetwork/getProvinceSoursList', params);
}
//全国视图右上角资源效能分析
function getResource(params: any): Promise<any> {
  return getAction('/oss/dataNetwork/getResourceEfficiencyAnalysisDto', params);
}
function getRoomToBldgList(params: {provinceCode: string, roomId: string}){
  return postAction('/oss/bldgCoverRes/roomToBldgList', params);
}
function getWgsBldgList(params: {provinceCode: string, rangeCoordinate: any}){
  return postAction('/oss/bldgCoverRes/wgsBldgList', params);
}
function getGuganNetworkTopologyByProvince(params: {provinceCode: string, rangeCoordinate: any}){
  return getAction('/oss/network/topology/getGuganNetworkTopologyByProvince', params);
}

function fetchStatesCodeList(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const json = require('./json/jfCodeProvince.json')
    resolve(json)
  })
}
//全国省份拓扑图
function getProvinceBackboneRoute(params: any): Promise<any> {
  return postAction('/oss/backbone/provinceBackboneRoute', params);
}
function cityBackboneRoute(params: {provinceCode: string, eqpTypeId: string, cityId: string}){
  return postAction('/oss/backbone/cityBackboneRoute', params);
}

export {
  queryDataNetworkRoomList,
  queryDataNetworkDeviceList,
  queryDataNetworkDeviceTotal,
  getRoomDeviceInfo,
  getPortList,
  getPortDetails,
  getCircuitList,
  getcircuitInfo,
  queryCircuitRouteList,
  queryDataNetworkDeviceInfo,
  queryPortListByEqpId,

  getResourcesAll,
  getDataNetWorkLeft,
  getStatisticsData,
  getAllwebData,
  resourceQualityDetails,
  getResourceEffic,
  getUtilizationList,
  getResource,
  getBldgDetail,
  getNetworkTopologyVo,  
  getDeviceCustStatistics,
  getRoomToBldgList,
  fetchStatesCodeList,
  cityBackboneRoute,
  getGuganNetworkTopologyByProvince,
  getProvinceBackboneRoute,
  getWgsBldgList,
};
