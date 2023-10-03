import { postAction } from '@alpha/utils/http';

//
function getQualityLeftData(params?: any): Promise<any> {
  return postAction('/oss/resourceQuality/leftData', params);
}
function postQualityPassQualityPassRatio(params?: any): Promise<any> {
  return postAction('/oss/qualityPass/qualityPassRatio', params);
}

function resourceQualityDetails(params?: any): Promise<any> {
  return postAction('/oss/qualityNew/resourceQualityDetails', params);
}
function getTransferRuleDetailed(params?: any): Promise<any> {
  return postAction('/oss/qualityNew/getTransferRuleDetailed', params);
}
function getTransferRuleResultList(params?: any): Promise<any> {
  return postAction('/oss/qualityNew/getTransferRuleResultList', params);
}
function resourceQualityProvince(params?: any): Promise<any> {
  return postAction('/oss/qualityNew/resourceQualityProvince', params);
}
export {
  getQualityLeftData,
  postQualityPassQualityPassRatio,
  resourceQualityDetails,
  getTransferRuleDetailed,
  getTransferRuleResultList,
  resourceQualityProvince
};
