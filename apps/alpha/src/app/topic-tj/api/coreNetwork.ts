import { getAction, postAction } from '@alpha/utils/http';
import { store } from '@alpha/store' 

// 核心网
export const getRoomTypes = () => {
  return getAction('/oss/roomPosition/getRoomTypes', {});
};

function getPageNetworkRoomCircuitList(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};
  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }
  return postAction('/oss/roomPosition/pageRoomCircuitList', params, {
    headers,
  });
}

/** 获取机房设备信息 */
function getRoomRackInfo(params?: any): Promise<any> {
  const state = store.getState();
  if (state.reduxMapResource.mapSelect.areaCode) {
    params.province = state.reduxMapResource.mapSelect.areaCode;
  }
  return getAction('/oss/coreNetwork/getRoomRackInfo', params);
}

function roomNeList(params?: any): Promise<any> {
  const state = store.getState();
  if (state.reduxMapResource.mapSelect.areaCode) {
    params.provinceCode = state.reduxMapResource.mapSelect.areaCode;
  }
  return postAction('/oss/roomNe/roomNeList', params);
}
/** 获取网元详细信息 */
function getNeDetail(params?: any): Promise<any> {
  const state = store.getState();
  if (state.reduxMapResource.mapSelect.areaCode) {
    params.provinceCode = state.reduxMapResource.mapSelect.areaCode;
  }
  return postAction('/oss/roomNe/neDetail', params);
}

/** 获取机架详情数据 */
function getRackInsideInfo(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {};
  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }
  return getAction('/oss/coreNetwork/getRackInsideInfoDto', params, {
    headers,
  });
}

// 获取核心资源总览数据
function getCoreDatas(params: any): Promise<any> {
  return getAction('/oss/coreNetwork/getCoreResourceTotal', params);
}


// 获取设备详情
function getCoreNetWorkDevice(params: any): Promise<any> {
  return getAction('/oss/coreNetwork/getCoreNetWorkDevice', params);
}

// 获取厂家设备占比
function getPercentageOccupancy(params: any): Promise<any> {
  return getAction('/oss/coreNetwork/getPercentageOccupancy', params);
}

// 获取数据网
function resourceQualityDetails(params: any): Promise<any> {
  return getAction('/oss/coreNetwork/resourceQualityDetails', params);
}
// 获取网络拓扑
function getTopologyData(params: any): Promise<any> {
  return getAction('/oss/coreNetwork/getTopologyInfo', params);
}
export {
    getPageNetworkRoomCircuitList,
    getRoomRackInfo,
    roomNeList,
    getNeDetail,
    getRackInsideInfo,
    getCoreDatas,
    getCoreNetWorkDevice,
    getPercentageOccupancy,
    resourceQualityDetails,
    getTopologyData,
  };