import { getAction, postAction } from '@alpha/utils/http';

interface AllDeviceResObj {
  TOTAL_NUM: string;
  MESSAGE: string;
  DATA_LIST: DeviceObj[];
}

interface DataResObj {
  RESP_CODE: string;
  DATA_OBJECT: DATAOBJECT;
}

interface OltResObj {
  PATH_NUM: number;
  PATH_LIST: RelatingDevice[];
  MESSAGE: string;
}

interface RouteResObj {
  PATH_NUM: number;
  PATH_LIST: PathObj[];
  MESSAGE?: any;
}

function queryAllDevice(params: {
  PRO_CODING: string;
  SEGM_ID: string;
}): Promise<AllDeviceResObj> {
  return postAction(`/unicom-nrm/line/all`, params);
}

function queryAddressInfoData(params: {
  PRO_CODING: string;
  SEGM_ID: string;
}): Promise<DataResObj> {
  return postAction(`/unicom-nrm/line/data`, params);
}

function queryOlt(params: {
  PRO_CODING: string;
  EQP_ID: string;
  RES_TYPE_ID?: string;
}): Promise<OltResObj> {
  return postAction(`/unicom-nrm/line/queryOlt`, params);
}

// 第三方的链路接口
function queryRoutes(params: {
  PRO_CODING: string;
  EQP_ID: string;
  RES_TYPE_ID?: string;
}): Promise<RouteResObj> {
  return postAction(`/unicom-nrm/line/routes`, params);
}

interface RouteResLocalObj {
  code: number;
  msg: string;
  data: RouteResLocalObjData;
}

interface RouteResLocalObjData {
  list: LocalPathObj[];
}

// 内部的链路接口
function queryRoutesLocal(params: {
  PRO_CODING: string;
  EQP_ID: string;
  RES_TYPE_ID?: string;
}): Promise<RouteResLocalObj> {
  return getAction(`/api/netres-service/broadband-gis/gis-map-routes`, params);
}

interface LocalAllDeviceRes {
  code: number;
  data: LocalAllDeviceResData;
  msg: string;
}

interface LocalAllDeviceResData {
  qaddrSegmSevenRes: LocalCommunityObj[];
  qrmeEqpObd: LocalObdObj[];
  qrmeEqpOlt: LocalOltObj[];
}

function getAllDevicesInDistrict(params: {
  provName: string;
  cityName: string;
  regionName: string;
}): Promise<LocalAllDeviceRes> {
  return getAction(`/api/netres-service/broadband-gis/gis-map-gis`, params);
}
interface InfoResObj {
  code: number;
  msg: string;
  data: InfoObj;
}

function getDeviceInfo(params: {
  EQP_ID: string;
  RES_TYPE_ID: string;
  PRO_CODING: string;
}): Promise<InfoResObj> {
  return getAction(`/api/netres-service/broadband-gis/gis-info-all`, params);
}

export {
  queryAllDevice,
  queryAddressInfoData,
  queryOlt,
  queryRoutes,
  getAllDevicesInDistrict,
  queryRoutesLocal,
  getDeviceInfo,
};
