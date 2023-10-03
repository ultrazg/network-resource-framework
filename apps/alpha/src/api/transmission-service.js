import { getAction } from '../utils/http';

const transmissionService = {
  getTrsOverview: (params) => {
    return getAction('/api/netres-service/trs-net-overview/overview', params);
  },
  getTrsOverviewMap: (params) => {
    return getAction(
      '/api/netres-service/trs-net-overview/map-with-topo',
      params
    );
  },

  getTrsProductRatio: (params) => {
    return getAction('/api/netres-service/trs-net-equ/items', params);
  },

  getTrsProductRatioByProvince: (params) => {
    return getAction('/api/netres-service/trs-net-equ/mapData', params);
  },

  getTrsNetSeg: (params) => {
    return getAction('/api/netres-service/trs-net-seg/items-new', params);
  },

  getTrsNetSegByProvince: (params) => {
    return getAction(
      '/api/netres-service/trs-net-seg/province-items-new',
      params
    );
  },

  getTrsNetBusinessRatio: () => {
    return getAction('/api/netres-service/trs-net-business-ratio');
  },

  //可传month来指定月份
  getTrsNetCircuit: (month) => {
    return getAction(`/api/netres-service/trs-net-circuit`, month);
  },

  fetchCities: () => {
    return getAction(`./assets/data/citys.json`);
  },

  getTrsOverviewByProvince: () => {
    return getAction('/api/netres-service/trs-net-overview/map');
  },

  getTrsCircuitByProvince: (params) => {
    return getAction('/api/netres-service/trs-net-circuit/map', params);
  },

  getTrsNetBearerReationship: (date) => {
    return getAction(`/api/netres-service/trs-net-bearer-relationship`, date);
  },

  /**
   * 获得传输网业务总览接口
   * @param {*} params
   * @returns
   */
  getTrsBussinessOverview: (params) => {
    return getAction(
      `/api/netres-service/trs-net-business-ratio/province`,
      params
    );
  },

  getSegCircult: (params) => {
    return getAction(
      `/api/netres-service/trs-net-seg-circuit/seg-circuits`,
      params
    );
  },

  getSysCircult: (params) => {
    return getAction(
      `/api/netres-service/trs-net-seg-circuit/sys-circuits`,
      params
    );
  },

  getCircuitSysList: (params) => {
    return getAction(
      `/api/netres-service/trs-net-seg-circuit/circuit-sys-list`,
      params
    );
  },

  getCircultList: (params) => {
    return getAction(
      `/api/netres-service/trs-net-seg-circuit/circuit-seg-list`,
      params
    );
  },

  getTrsNetBearerReationshipMap: (date) => {
    return getAction(
      `/api/netres-service/trs-net-bearer-relationship-map`,
      date
    );
  },

  getOTNSectionList: (params) => {
    return getAction(
      `/api/netres-service/trs-net-seg-circuit/otn-circuit-seg-list`,
      params
    );
  },
};

export default {
  ...transmissionService,
};
