import { getAction, postAction } from '../utils/http';
interface SyncDataMapDataResObj {
  code: number;
  msg: string;
  data: {
    list: {
      province: string;
      standardAddrSyncNum: number;
      otherSyncNum: number;
      standardAddrSyncCycle: string;
      otherSyncCycle: string;
    }[];
  };
}

interface SyncDataMapDataResObj {
  provName: string;
  resSum: number;
  resDaySync: number;
  standAddr: number;
  lightConBag: number;
  oltEquip: number;
  onuEquip: number;
  lightShuntEquip: number;
}

export interface SyncDataTableDataResObj {
  code: number;
  msg: string;
  data: {
    list: { time: string; standardAddrSyncNum: number; otherSyncNum: number }[];
  };
}

function fetchStatesCodeList(): Promise<unknown> {
  return getAction(`./assets/data/states-code.json`);
}

function getResourceOverview(): Promise<unknown> {
  return getAction(`/api/netres-service/line-res-overview/getResOverviewData`);
}

function getResourceChartData(): Promise<unknown> {
  return getAction(`/api/netres-service/line-res-total-bar/items`);
}

function getResourceMap(): Promise<SyncDataMapDataResObj[]> {
  return getAction(`/api/netres-service/line-res-overview/getProvinceData`);
}

function getSyncDataOverview(params: { day?: string }): Promise<unknown> {
  return getAction(
    `/api/netres-service/line-res-data-sync/province-num`,
    params
  );
}

function getSyncDataTableData(params: {
  day?: string;
  statisType: number;
}): Promise<SyncDataTableDataResObj> {
  return getAction(`/api/netres-service/line-res-data-sync/sync-trend`, params);
}

function getDataSyncMap(params: {
  day?: string;
}): Promise<SyncDataMapDataResObj> {
  return getAction(`/api/netres-service/line-res-data-sync/sync-map`, params);
}

function getMockData() {
  // return getAction(
  //   `http://10.168.11.225:8081/baidumap/bmapgl/mapvgl/examples/static/beijing.07102610.json`
  // );
  return getAction(`./assets/data/map/beijing_mock_data.json`);
}

function fetchCoordinatesByType(params: { type: number }) {
  return getAction(`/api/netres-service/line-res-map`, params);
}

function getLineResQuality(): Promise<any> {
  return getAction('/api/netres-service/line-res-quality');
}

function getLineResQualityApplyScene(): Promise<any> {
  return getAction('/api/netres-service/line-res-quality/applyscene');
}

function getLineResQualityAll(): Promise<any> {
  return getAction('/api/netres-service/line-res-quality/all');
}

function getLineResBusinessOperationItem(): Promise<any> {
  return getAction('/api/netres-service/line-res-business-operation/item');
}

function getLineResBusinessOperationMapItem(): Promise<any> {
  return getAction('/api/netres-service/line-res-business-operation/map-item');
}

interface SignalRes {
  code: number;
  msg: string;
  data: SignalDataRes;
}

interface SignalDataRes {
  code: number;
  message: string;
  data: SignalSignalDataResObj[];
}

function queryBiaoZhunDiZhi(params: {
  addressName: string;
  provinceId: string;
  cityId: string;
  districtId?: string;
  sort: boolean;
  phraseQuery: boolean;
  pageSize: number;
  pageNum: number;
}): Promise<SignalRes> {
  return getAction('/rpapi/resource-prediction/address/biaozhundizhi', params);
}

function queryCmtreoPolygon(params: {
  bldgName?: string;
  cmtName?: string;
  districName?: string;
  districtId?: string;
  province: string;
  regionId?: string;
  regionName?: string;
  segmIds: string;
  standName?: string;
}) {
  return postAction(
    '/api/netres-service/line-res-building-village/cmtreo',
    params
  );
}

function queryBuildingPolygon(params: {
  bldgName?: string;
  districName?: string;
  districtId?: string;
  province: string;
  regionId?: string;
  regionName?: string;
  segmIds: string;
  standName?: string;
}) {
  return postAction(
    '/api/netres-service/line-res-building-village/building',
    params
  );
}

function queryStandardAddrResStatis(params: {
  PRO_CODING: string;
  SEGM_ID: string;
}) {
  return postAction(
    '/api/netres-service/line-gis/standard-addr-res-statis',
    params
  );
}

function getCoverEqp(params: { PRO_CODING: string; SEGM_ID: string }) {
  return postAction('/api/netres-service/line-gis/getCoverEqp', params);
}

function queryOlt(params: {
  PRO_CODING: string;
  EQP_ID: string;
  RES_TYPE_ID: string;
}) {
  return postAction('/api/netres-service/line-gis/queryOlt', params);
}

export {
  getResourceOverview,
  getResourceMap,
  getResourceChartData,
  getSyncDataOverview,
  getSyncDataTableData,
  getDataSyncMap,
  getMockData,
  getLineResQuality,
  getLineResQualityApplyScene,
  getLineResBusinessOperationItem,
  getLineResBusinessOperationMapItem,
  getLineResQualityAll,
  fetchCoordinatesByType,
  fetchStatesCodeList,
  queryBiaoZhunDiZhi,
  queryCmtreoPolygon,
  queryBuildingPolygon,
  queryStandardAddrResStatis,
  getCoverEqp,
  queryOlt,
};
