import { getAction } from '@alpha/utils/http';

// 资源质量
function getResourceList(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/get-overview', params);
}

function getResourceOverview(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/all-overview', params);
}
function getResourcePort(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/get-res-overview', params);
}
function getIdleDevice(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/get-res-overview', params);
}

function getOverviewMapData(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/all-overview', params);
}

function getOBDUsage(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/obd-usage', params);
}

// 网络质量
function getQualityMapData(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/network-quality/map', params);
}

function getNetworkQualityOverview(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/network-quality', params);
}

function getNetworkQualityListUser(params?: any): Promise<any> {
  return getAction(
    '/api/netres-service/broadband/network-quality/user-opt-loss-rank',
    params
  );
}

function getNetworkQualityListWork(params?: any): Promise<any> {
  return getAction(
    '/api/netres-service/broadband/network-quality/big-opt-loss-order-rank',
    params
  );
}

// 用户分布
function getUserDistributionList(params?: any): Promise<any> {
  return getAction(
    '/api/netres-service/UserDistribution/getBroadbandUserDistribution',
    params
  );
}
function getUserChangeTrend(params?: any): Promise<any> {
  return getAction(
    '/api/netres-service/UserDistribution/UserChangeTrend',
    params
  );
}

// 业务运营
function getBusinessOverview(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/business-operate', params);
}

function getBusinessCoverage(params?: any): Promise<any> {
  return getAction(
    '/api/netres-service/broadband-business-coverage/show-community-nums',
    params
  );
}
function getBusinessCover(params?: any): Promise<any> {
  return getAction(
    '/api/netres-service/broadband-business-coverage/show-community-nums',
    params
  );
}

function getBusinessMapData(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/business-map', params);
}

function getBusinessChartData(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/business-work-order', params);
}

function getUserDistributionMapData(params?: any): Promise<any> {
  return getAction(
    '/api/netres-service/UserDistribution/provinceBroadbandUserUetails',
    params
  );
}

function getOverviewGisData(params?: any): Promise<any> {
  return getAction('/api/netres-service/broadband/overview-gis', params);
}

function getBussinessSupport(params: any): Promise<any> {
  return getAction(
    '/api/netres-service/broadband-resources/operation-suppor',
    params
  );
}

// 宽带资源上图地图数据
function getResMap(params: any): Promise<any> {
  return getAction('/api/netres-service/broadband/res-map', params);
}

// OLT单双上联分析地图数据
function getOltAnalysisMap(params: any): Promise<any> {
  return getAction('/api/netres-service/broadband/olt-analysis', params);
}

// 千百户小区资源预警地图数据
function getResCellResourcesMap(params: any): Promise<any> {
  return getAction(
    '/api/netres-service/broadband/res-cell-resources-map',
    params
  );
}

export {
  getResourceOverview,
  getResourcePort,
  getIdleDevice,
  getOBDUsage,
  getOverviewMapData,
  getQualityMapData,
  getNetworkQualityOverview,
  getNetworkQualityListUser,
  getNetworkQualityListWork,
  getUserChangeTrend,
  getBusinessOverview,
  getBusinessCoverage,
  getBusinessCover,
  getBusinessChartData,
  getBusinessMapData,
  getUserDistributionList,
  getResourceList,
  getUserDistributionMapData,
  getOverviewGisData,
  getBussinessSupport,
  getResMap,
  getOltAnalysisMap,
  getResCellResourcesMap,
};
