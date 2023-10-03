import { getAction, postAction } from '../utils/http';
import idcService from './idc-service.js';
import boService from './bo-service.js';
import scheduleService from './schedule';
import transmissionService from './transmission-service';
import internetService from './internet-service';

const getCityPosition = (params) => {
  params = Object.assign(params, {
    ApiAuthorization: 'baidu-8720164ac7c140dd8557cbd26ddc6209',
    q: '中国',
    page_size: 1,
    page_num: 10,
    output: 'json',
  });
  return getAction('//10.168.13.31:8022/dugis-baidu/search', params);
};

const fectchProvinces = () => {
  return getAction(`./assets/data/provinces.json`);
};

const fetchChina = () => {
  return getAction(`./assets/data/china.json`);
};

const fetchChinaMapWithName = () => {
  return getAction(`./assets/data/china-map-with-name.json`);
};

const fetchChinaMapWithNameLabel = () => {
  return getAction(`./assets/data/china-map-with-name-label.json`);
};

const fetchProvincePinyinName = () => {
  return getAction(`./assets/data/province-pinyin.json`);
};

const fetchChinaProvinceMapWithId = (id) => {
  return fetch(`./assets/data/province/${id}.json`)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
const fetchChinaDistrictMapWithId = (id) => {
  return fetch(`./assets/data/city/${id}.json`)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
const fetchBuildings = () => {
  return getAction(`./assets/data/buildings.json`);
};

const getTrunk = () => {
  return getAction(`/api/netres-service/one-trunk-optical-sect`);
};

const getBusinessSupportSummary = () => {
  return getAction(`/api/netres-service/business-support`);
};
const getBusinessSupportByType = (params) => {
  return getAction(
    `/api/netres-service/business-support/by-type`,
    params,
    _,
    true
  );
};

const getKeyIndicatorsSummary = () => {
  return getAction(`/api/netres-service/key-indicator`);
};

const getAirShipData = () => {
  return getAction(`/api/netres-service/top-ship`);
};

const getOperationalSummary = () => {
  return getAction(`/api/netres-service/operational-efficacy`);
};

const getOpenSharingData = () => {
  return getAction(`/api/netres-service/open-sharing`);
};

const getApplySection = () => {
  return getAction(`/api/netres-service/open-sharing/applySection`);
};

const getApplyInfo = () => {
  return getAction(`/api/netres-service/open-sharing/applyInfo`);
};

const getCapabilityCallTrend = (params) => {
  return postAction(
    `/api/netres-service/open-sharing/getCapabilityCallTrend`,
    params
  );
};

const getOpenSharingDetailData = () => {
  return getAction(`/api/netres-service/open-sharing/detail`);
};

const getMapRes = (params) => {
  return getAction(`/api/netres-service/netres/mapRes`, params);
};

const getInternationalSeaOptical = () => {
  return getAction(
    `/api/netres-service/international-res/internationalSeaOptical`
  );
};
const getCapabilityCallPercent = (params) => {
  return postAction(
    `/api/netres-service/open-sharing/getCapabilityCallPercent`,
    params
  );
};

const getApplyCall = (params) => {
  return postAction('/api/netres-service/open-sharing/applyCall', params);
};

const getHealthRank = (params) => {
  return postAction(`/api/netres-service/open-sharing/applyHealth`, params);
};
const getIDCResourceOverview = (params) => {
  return getAction('/api/netres-service/idc-res-overview', params);
};
const getIDCResourceConstruction = (params) => {
  return getAction(`/api/netres-service/idc_res_construction`, params);
};
const getIDCDataCenterBenefits = (params) => {
  return getAction(
    `/api/netres-service/operational-health/getIdcOperationBenefits`,
    params
  );
};
const getIDCRackStatus = (params) => {
  return getAction('/api/netres-service/idc_rack_status', params);
};
const getIDCMapDataCenter = (params) => {
  return getAction('/api/netres-service/idc-res-map-data-center', params);
};

const getIDCMapNetworkTrafficAnalysis = (params) => {
  return getAction(
    '/api/netres-service/idc-res-map-network-traffic-analysis',
    params
  );
};

const getBusinessAvgTime = () => {
  return getAction(
    '/api/netres-service/bo-collaborative-order-management/businessAvgTime'
  );
};

const getBoOrderStatisticsAnalyze = () => {
  return getAction(
    '/api/netres-service/bo-collaborative-order-management/boOrderStatisticsAnalyze'
  );
};

const getIDCWorkOrder = (params) => {
  return getAction('/api/netres-service/idc-res-analysisview', params);
};

const getIDCDataCenterConstruction = (params) => {
  return getAction(
    '/api/netres-service/operational-health/idcOperationResConstruction',
    params
  );
};

const getIdcOperationCosts = (params) => {
  return getAction(
    '/api/netres-service/operational-health/idcOperationCosts',
    params
  );
};

const getIdcOperationSecurityUnfitItem = (params) => {
  return getAction(
    '/api/netres-service/operational-health/idc-operation-security-unfit-item',
    params
  );
};

const getIdcRadarMap = (params) => {
  return getAction('/api/netres-service/operational-health/radarMap', params);
};

const getBOOrderOverview = (params) => {
  return getAction(
    '/api/netres-service/bo-collaborative-order-management/boFullOrderview',
    params
  );
};

const getIdcDataCenterInfo = (params) => {
  return getAction(
    '/api/netres-service/idc-res-map-data-center-info/province',
    params
  );
};

//运营健康度、运营持续性
const getIdcOperationHealthCustomer = (params) => {
  return getAction(
    '/api/netres-service/operational-health/idcOperationHealthCustomer',
    params
  );
};

const getOperationHealthAll = (params) => {
  return getAction('/api//netres-service/operational-health/map/all', params);
};

const getOperationCheckMatchRate = (params) => {
  return getAction(
    '/api/netres-service/dispatch-operation/check-match-rate',
    params
  );
};
const getMaxCustomer = (params) => {
  return getAction(
    '/api/netres-service/operational-health/idcOperationHealthCustomerMAX',
    params
  );
};

const getTop20Customer = (params) => {
  return getAction(
    '/api/netres-service/operational-health/idcOperationHealthCustomerTOP20',
    params
  );
};

const getDispatchOperationMap = () => {
  return getAction('/api//netres-service/dispatch-operation/map');
};

//调度运营专题
const getBomData = (date) => {
  return getAction('/api/netres-service/dispatch-operation/bom-pass', date);
};

const getEndToEndData = (date) => {
  return getAction('/api/netres-service/dispatch-operation/end-to-end', date);
};

// 号线专题
function fetchBMapStyle() {
  return getAction(`./assets/data/map/custom_map_config.json`);
}

// 资源图谱
function fetchResAtlas() {
  return getAction(`/api/netres-service/res-atlas/data`);
}

// 资源分布
function fetchResAtlasMap(data) {
  return getAction(`/api/netres-service/res-atlas/map`, data);
}

// 资源分布
function fetchResAtlasByPro(data) {
  return getAction(`/api/netres-service/res-atlas/res-data-by-province`, data);
}

// 资源分布
function fetchResMapMenus(data) {
  return getAction(`/api/netres-service/res-atlas/res-data-by-province`, data);
}

export {
  fectchProvinces,
  fetchChina,
  fetchChinaMapWithName,
  fetchChinaMapWithNameLabel,
  fetchProvincePinyinName,
  fetchChinaProvinceMapWithId,
  fetchChinaDistrictMapWithId,
  fetchBuildings,
  getBusinessSupportSummary,
  getBusinessSupportByType,
  getKeyIndicatorsSummary,
  getAirShipData,
  getOperationalSummary,
  getOpenSharingData,
  getOpenSharingDetailData,
  getApplyInfo,
  getCapabilityCallTrend,
  getApplySection,
  getMapRes,
  getTrunk,
  getInternationalSeaOptical,
  getCapabilityCallPercent,
  getApplyCall,
  getHealthRank,
  getIDCResourceOverview,
  getIDCResourceConstruction,
  getIDCRackStatus,
  getIDCMapDataCenter,
  getIDCMapNetworkTrafficAnalysis,
  getIDCWorkOrder,
  getIDCDataCenterConstruction,
  getIDCDataCenterBenefits,
  getBusinessAvgTime,
  getBoOrderStatisticsAnalyze,
  getBOOrderOverview,
  getIdcOperationCosts,
  getIdcOperationSecurityUnfitItem,
  getIdcRadarMap,
  idcService,
  boService,
  scheduleService,
  transmissionService,
  internetService,
  getIdcDataCenterInfo,
  getIdcOperationHealthCustomer,
  getOperationHealthAll,
  getOperationCheckMatchRate,
  getMaxCustomer,
  getTop20Customer,
  getDispatchOperationMap,
  getBomData,
  getEndToEndData,
  fetchBMapStyle,
  getCityPosition,
  fetchResAtlas,
  fetchResAtlasMap,
  fetchResAtlasByPro,
  fetchResMapMenus,
};
