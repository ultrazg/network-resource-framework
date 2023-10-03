/**
 * 网络质量地图图层
 */
import { provinces } from '../components/resource';
import { generateRadomNum } from '@alpha/utils/commFunc';

function getMapData() {
  return new Promise((resolve, reject) => {
    const list = provinces.map((item, index) => {
      return {
        province: item,
        userOpticalLowQualityRate: generateRadomNum().toFixed(2),
        WorkOrderCompletionRate: (generateRadomNum() * 100).toFixed(0),
        increaseActiveUsersRate: (generateRadomNum() * 100).toFixed(0),
        thirtyDayRepeatedFailureRate: (generateRadomNum() * 100).toFixed(0),
        lowQualityRate: (generateRadomNum() * 100).toFixed(0),
      };
    });
    const res = {
      code: 200,
      data: [...list],
    };
    resolve(res);
  });
}

function getTargetKey(target) {
  let key = '';
  switch (target) {
    case '光衰质差率':
      key = 'userOpticalLowQualityRate';
      break;
    case '大光衰整治工单完成率':
      key = 'WorkOrderCompletionRate';
      break;
    case '新增活跃用户测速合格率':
      key = 'increaseActiveUsersRate';
      break;
    case '30 天重复故障率':
      key = 'thirtyDayRepeatedFailureRate';
      break;
    case '装维服务质差网格率':
      key = 'lowQualityRate';
  }
  return key;
}

export { getMapData, getTargetKey };
