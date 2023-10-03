import { getAction, postAction } from '@alpha/utils/http';
import { store } from '@alpha/store' 

// 无线
function getPageNetworkRoomCircuitList(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {}
  if(state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode
    }
  }
  return postAction('/oss/roomPosition/pageNetworkRoomCircuitList', params, {
    headers
  });
}

// 光分纤箱--光端子占用率(通用)
function getUsageRateByPortType(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {}
  if(state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode
    }
  }
  return postAction('/oss/businessResInfo/getUsageRateByPortType', params, {
    headers
  });
}
// 光分纤箱--板卡端口信息（通用）
function getPortTermByCardModule(params?: any): Promise<any> {
  const state = store.getState();
  let headers = {}
  if(state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode
    }
  }
  return postAction('/oss/businessResInfo/getPortTermByCardModule', params, {
    headers
  });
}
// 设备详情
function getEqpDetailName(name?: any): Promise<any> {
  const state = store.getState();
  let headers = {}
  if(state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode
    }
  }
  return getAction(`/oss/roomEqp/getEqpDetailByName/${name}`, {}, {
    headers
  });
}
//  资源上图基房基本信息
function getStationInfo(id: string): Promise<any> {
  const state = store.getState();
  const areaCode = state.reduxMapResource.mapSelect.areaCode
  return getAction(`/oss/resourcesSand/getStationInfo?stationId=${id}&areaCode=${areaCode}`);
}

//  资源上图基房基本信息 -- 设备列表
function getEqpList(id: string, network: string): Promise<any> {
  const state = store.getState();
  let headers = {}
  if(state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode
      // areaCode: '510000000000'
    }
  }
  return getAction(`/oss/roomEqp/getEqpList?roomId=${id}&netType=${network}`, {}, {
    headers
  });
}

// 基站成环右边的基站列表
function queryBaseStationLoopListByRoomID2(params: object): Promise<any> {
  const state = store.getState();
  let headers = {}
  if(state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode
    }
  }
  return postAction('/oss/baseStationLoop2/queryBaseStationLoopListByRoomID2', params, {
    headers
  });
}


// 基站成环右边的基站列表
function queryBaseStationLoopInfo(params: object): Promise<any> {


  const state = store.getState();
  let headers = {}
  if(state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode
    }
  }
  // params = {
  //   "bbuNum":0,
  //   "cityCode":"",
  //   "dataType":2,
  //   "deviceId":"039015180100000080588126",
  //   "mfrEqpId":"038021630100000798202887",
  //   "deviceType":2,
  //   "isLoop":0,
  //   "name":"",
  //   "networkType":0,
  //   "provinceCode":"500000000000",
  //   "type":1,
  //   "provinceName":"\u91cd\u5e86",
  // }
  return postAction('/oss/baseStationLoop2/queryBaseStationLoopInfoByBBUId', params, {
    headers
  });
}

//  资源上图基房基本信息 -- 设备列表
function queryRRUByBBUEqpId(eqpId: string): Promise<any> {
  const state = store.getState();
  let headers = {}
  if(state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode
    }
  }
  return getAction(`/oss/baseStationLoop2/queryRRUByBBUEqpId?eqpId=${eqpId}`, {}, {
    headers
  });
}

export {
  getPageNetworkRoomCircuitList,
  getStationInfo,
  getEqpList,
  getPortTermByCardModule,
  getUsageRateByPortType,
  getEqpDetailName,
  queryBaseStationLoopListByRoomID2,
  queryBaseStationLoopInfo,
  queryRRUByBBUEqpId,
};
