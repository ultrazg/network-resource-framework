import { getAction, postAction } from '../utils/http';

const internetService = {
  getSpaceResourceOverview: () => {
    return getAction(`/api/netres-service/international-res-space/overview`);
  },

  getDeviceResourceOverviewByPort: () => {
    return getAction(`/api/netres-service/international-res-port/getData`);
  },

  getDeviceResourceOverviewByDevice: () => {
    return getAction(`/api/netres-service/international-res-equipment/getData`);
  },

  getProductLineOverview: () => {
    return getAction(`/api/netres-service/international-res/dedicated-line`);
  },

  getClientRank: () => {
    return postAction(`/api/netres-service/international-client/clientRank`);
  },
  getClientCities: () => {
    return postAction(
      `/api/netres-service/international-client/cityThermodynamic`
    );
  },

  getClientDetail: (params) => {
    return getAction(
      `/api/netres-service/international-client/companyDetails`,
      params
    );
  },

  /**
   * 参数7000405海缆、参数7000406陆缆
   * @param {string} type 缆线类型参数
   */
  getCableList: (type) => {
    return getAction(
      `/api/netres-service/international-res/res-optical-detail`,
      { optTypeId: type }
    );
  },

  getCableMap: (optId) => {
    return getAction(
      `/api/netres-service/international-res/res-optical-detail-map`,
      { optId }
    );
  },

  getAllCable: (optTypeId) => {
    return getAction(
      `/api/netres-service/international-res/res-optical-detail-map/all`,
      { optTypeId }
    );
  },

  getSummaryItem: () => {
    return getAction(
      `/api/netres-service/international-res-total/summary-items`
    );
  },

  getSpaceContinent: () => {
    return getAction(
      `/api/netres-service/international-res-space/mapDataContinent`
    );
  },

  getSpaceEarth: () => {
    return getAction(`/api/netres-service/international-res-space/mapDataCity`);
  },

  getResOpticalOverview: () => {
    return getAction(
      `/api/netres-service/international-res/res-optical-overview`
    );
  },

  getEuipmentContinent: () => {
    return getAction(
      `/api/netres-service/international-res-equipment/getUnderMapData`
    );
  },

  getEuipmentEarth: () => {
    return getAction(
      `/api/netres-service/international-res-equipment/getMapData`
    );
  },

  getPortContinent: () => {
    return getAction(
      `/api/netres-service/international-res-port/getUnderMapData`
    );
  },

  getPortEarth: () => {
    return getAction(`/api/netres-service/international-res-port/getMapData`);
  },

  getDedicateContinent: () => {
    return getAction(
      `/api/netres-service/international-res/dedicated-line/continent`
    );
  },

  getDedicateEarth: () => {
    return getAction(
      `/api/netres-service/international-res/dedicated-line/map`
    );
  },

  getBusinessContinent: () => {
    return getAction(`/api/netres-service/international-res-total/map-items`);
  },

  getCableInfo: (params) => {
    return getAction(
      `/api/netres-service/international-res/res-optical-detail-map/windows`,
      params
    );
  },
};

export default {
  ...internetService,
};
