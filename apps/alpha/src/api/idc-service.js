import { getAction } from '../utils/http';

const idcResourceAnalysis = {
  getIdcResourceCabinetOperdation: (params) => {
    return getAction(
      `/api/netres-service/idc-resource-cabinet-operation`,
      params
    );
  },

  getIdcResTopTwentyCustomRack: () => {
    return getAction(
      `/api/netres-service/idc-res-overview/getIdcResTopTwentyCustomRack`
    );
  },

  getIdcOperationHealthEnergy: (params) => {
    return getAction(
      `/api/netres-service/operational-health/idcOperationHealthEnergy`,
      params
    );
  },

  getIdcOrderYearView: () => {
    return getAction(`/api/netres-service/idc-res-analysisview/getYearView`);
  },

  getIdcTrafficTrend: () => {
    return getAction(`/api/netres-service/idc-res-network-traffic-trend`);
  },

  getIdcOrderNum: () => {
    return getAction(`/api/netres-service/dispatch-operation/order-num`);
  },
};

export default {
  ...idcResourceAnalysis,
};
