/**
 * 资源总览相关函数文件
 */

import { generateRadomNum } from '@alpha/utils/commFunc';
import { provinces } from '../components/resource';

const getTestData1 = (cities?: any[]) => {
  return new Promise((resolve, reject) => {
    const list = (cities ? cities : provinces).map((item, index) => {
      return {
        province: cities ? item.name || item.properties.name : item,
        city: cities ? item.name || item.properties.name : item,
        district: cities ? item.name || item.properties.name : item,
        standardAddrTotal: +(generateRadomNum() * 10000000).toFixed(2),
        resTotal: +(generateRadomNum() * 10000000).toFixed(2),
        oltTotal: +(generateRadomNum() * 10000000).toFixed(2),
        obdTotal: +(generateRadomNum() * 10000000).toFixed(2),
        onuTotal: +(generateRadomNum() * 10000000).toFixed(2),
        ponPortTotal: +(generateRadomNum() * 10000000).toFixed(2),
        obdPortTotal: +(generateRadomNum() * 10000000).toFixed(2),
        ponPortRate: +(generateRadomNum() * 100).toFixed(2),
        obdPortRate: +(generateRadomNum() * 100).toFixed(2),
      };
    });
    const res = {
      code: 200,
      data: { list: list },
    };
    resolve(res);
  });
};
const getTestData2 = (cities?: any[]) => {
  return new Promise((resolve, reject) => {
    const list = (cities ? cities : provinces).map((item, index) => {
      return {
        province: cities ? item.name || item.properties.name : item,
        city: cities ? item.name || item.properties.name : item,
        district: cities ? item.name || item.properties.name : item,
        resTotal: +(generateRadomNum() * 10000000).toFixed(2),
        oltTotal: +(generateRadomNum() * 10000000).toFixed(2),
        singleOltTotal: +(generateRadomNum() * 10000000).toFixed(2),
        doubleOltTotal: +(generateRadomNum() * 10000000).toFixed(2),
        villageTotal: +(generateRadomNum() * 10000000).toFixed(2),
        coverVillage: +(generateRadomNum() * 10000000).toFixed(2),
        doubleCoverVillage: +(generateRadomNum() * 10000000).toFixed(2),
      };
    });
    const res = {
      code: 200,
      data: { list: list },
    };
    resolve(res);
  });
};
const getTestData3 = (cities?: any[]) => {
  return new Promise((resolve, reject) => {
    const list = (cities ? cities : provinces).map((item, index) => {
      return {
        province: cities ? item.name || item.properties.name : item,
        city: cities ? item.name || item.properties.name : item,
        district: cities ? item.name || item.properties.name : item,
        resTotal: +(generateRadomNum() * 10000000).toFixed(2),
        villageTotal: +(generateRadomNum() * 10000000).toFixed(2),
        hectoHouseVillage: +(generateRadomNum() * 10000000).toFixed(2),
        kiloHouseVillage: +(generateRadomNum() * 10000000).toFixed(2),
        endObdTotal: +(generateRadomNum() * 10000000).toFixed(2),
        endObdPortTotal: +(generateRadomNum() * 10000000).toFixed(2),
        endObdPortRate: +(generateRadomNum() * 100).toFixed(2),
      };
    });
    const res = {
      code: 200,
      data: { list: list },
    };
    resolve(res);
  });
};

export { getTestData1, getTestData2, getTestData3 };
