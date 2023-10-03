import { getAction } from '../utils/http';

const scheduleAnalysis = {
  getScheduleOrderNum: (params) => {
    return getAction(
      `/api/netres-service/dispatch-operation/order-num`,
      params
    );
  },

  getAllDoOrderProcessingTimeThree: (params) => {
    return getAction(
      `/api/netres-service/do-order-processing-time/getAllDoOrderProcessingTimeThree`,
      params
    );
  },

  getAllDoOrderProcessingTimeFive: (params) => {
    return getAction(
      `/api/netres-service/do-order-processing-time/getAllDoOrderProcessingTimeFive`,
      params
    );
  },

  getAllDoOrderProcessingTimeSeven: (params) => {
    return getAction(
      `/api/netres-service/do-order-processing-time/getAllDoOrderProcessingTimeSeven`,
      params
    );
  },

  getIntelligenceCapability: (params) => {
    return getAction(
      `/api/netres-service/dispatch-operation/value-of-intelligence-capability`,
      params
    );
  },

  getRoundAll: (params) => {
    return getAction(
      `/api/netres-service/do-order-processing-time/getRoundAll`,
      params
    );
  },
};

export default {
  ...scheduleAnalysis,
};
