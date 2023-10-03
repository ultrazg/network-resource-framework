import { getAction } from '../utils/http';

const boService = {
  getBusinessStatisticalAnalysis: (params) => {
    return getAction(
      '/api/netres-service/bo-collaborative-order-management/businessStatisticalAnalysis',
      params
    );
  },

  getBOConfigurationDuration: () => {
    return getAction(
      '/api/netres-service/bo-collaborative-order-management/boConfigurationDuration'
    );
  },
  getOrderAvgTimeRank: (params) => {
    return getAction(
      `/api/netres-service/dispatch-operation/order-open-avg-time-rank`,
      params
    );
  },
  getOperationScheduleKeyIndicators: (params) => {
    return getAction(
      `/api/netres-service/dispatch-operation/operation-overview`,
      params
    );
  },
  getOperationScheduleDetail: (params) => {
    return getAction(
      `/api/netres-service/dispatch-operation/alert-rank`,
      params
    );
  },
  getOperationScheduleOverview: () => {
    return getAction('/api/netres-service/dispatch-operation/order-overview');
  },
  getResourceConfigure: (params) => {
    return getAction(
      '/api/netres-service/dispatch-operation/resource_configure',
      params
    );
  },
  getOrderOverview: (params) => {
    return getAction(
      '/api/netres-service/dispatch-operation/month-order-overview',
      params
    );
  },
  getOrderOverviewCircle: (date) => {
    return getAction(
      '/api/netres-service/dispatch-operation/dispatching-overvie-circle',
      date
    );
  },
  getOrderOverviewByProvince: (params) => {
    return getAction(
      '/api/netres-service/dispatch-operation/month-order',
      params
    );
  },
  getOrderIntelligenceList: (params) => {
    return getAction(
      '/api/netres-service/dispatch-operation/value-of-intelligence-capability-rate',
      params
    );
  },
  getOrderEndToEndByProvince: (params) => {
    return getAction(
      '/api/netres-service/dispatch-operation/end-to-end',
      params
    );
  },
  getOrderBOMByProvince: (params) => {
    return getAction('/api/netres-service/dispatch-operation/bom-pass', params);
  },
  getOrderProcessingTimeByProvince: (params) => {
    return getAction(
      '/api/netres-service/do-order-processing-time/getAllProvince',
      params
    );
  },
  getOrderIntelligenceValueByProvince: (params) => {
    return getAction(
      '/api/netres-service/dispatch-operation/value-of-intelligence-capability',
      params
    );
  },
};

export default {
  ...boService,
};
