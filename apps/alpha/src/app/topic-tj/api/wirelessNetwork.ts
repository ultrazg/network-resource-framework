import { getAction, postAction } from '@alpha/utils/http';
import { store } from '@alpha/store';

// 地图数据
function getResMap(params: any): Promise<any> {
  return getAction('/api/netres-service/broadband/res-map', params);
}

function getResourcesAll(params: any): Promise<any> {
  return getAction('/oss/res/getResourcesAll', params);
}

function get5gRan(params: any): Promise<any> {
  return postAction('/oss/wireless/get5gRan', params);
}

// 网络健壮性查询接口
function getByKey(params: any): Promise<any> {
  return getAction('/oss/redisControll/getByKey', params);
}

// 资源生命周期
function getResLife(params: any): Promise<any> {
  return getAction('/oss/roomPosition/getResLife?province=', params);
}

// 获取地市汇总数据
function getCountBaseStationInfo(param: { name: string; code: string }) {
  // getCountBaseStationInfo;
  return getAction('/oss/res/getResourcesProvince', {
    provinceCode: param.code,
  });
}

/** 获取BBU设备列表省份地市下拉框数据 */
function getProvinceAndRegionInfo(params: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return getAction('/oss/wirelessNetwork/getProvinceAndRegionInfo', params, {
    headers,
  });
}

/** 获取 BBU 设备列表 */
function getBbuPage(params: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return postAction('/oss/wirelessNetwork/page', params, {
    headers,
  });
}

/** 获取统计数据 */
function getStatistics(params: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return getAction('/oss/wirelessNetwork/getStatistics', params, {
    headers,
  });
}

/** bbu设备导出 */
function exportBbu(params: any): Promise<any> {
  const state = store.getState();
  let headers = {};

  if (state.reduxMapResource.mapSelect.areaCode) {
    headers = {
      areaCode: state.reduxMapResource.mapSelect.areaCode,
    };
  }

  return postAction('/oss/wirelessNetwork/export', params, {
    headers,
  });
}

/** 下载文件列表 */
function getDownLoadFilePage(params: any): Promise<any> {
  return postAction('/oss/wirelessNetwork/downLoadFilePage', params);
}

/** 下载文件列表 */
function getDownLoad(params: any, config: any): Promise<any> {
  return getAction(
    '/apioss/excelExport/exportFile?fileName=stationElectric',
    params,
    config
  );
}
/** 文件下载接口 */

function downLoadFile(params: any): Promise<any> {
  return getAction('/oss/wirelessNetwork/downLoadSftpFile', params, {
    responseType: 'blob',
  });
}

export {
  getResMap,
  getResourcesAll,
  get5gRan,
  getByKey,
  getResLife,
  getCountBaseStationInfo,
  getDownLoadFilePage,
  getProvinceAndRegionInfo,
  getBbuPage,
  getStatistics,
  exportBbu,
  getDownLoad,
  downLoadFile,
};
