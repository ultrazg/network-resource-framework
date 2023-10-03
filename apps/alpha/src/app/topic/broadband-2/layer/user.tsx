/**
 * 用户分布模块相关函数文件
 */

import { generateRadomNum } from '@alpha/utils/commFunc';
import { provinces } from '../components/resource';

const getUserMapData = () => {
  return new Promise((resolve, reject) => {
    const list = provinces.map((item, index) => {
      return {
        province: item,
        broadbandUserNum: +(generateRadomNum() * 10000).toFixed(2),
        OpticalFiberUserNum: +(generateRadomNum() * 10000).toFixed(2),
        gigabitUser: +(generateRadomNum() * 10000).toFixed(2),
        IPTVUser: +(generateRadomNum() * 10000).toFixed(2),
        networkAccessUser: +(generateRadomNum() * 10000).toFixed(2),
        backOutUser: +(generateRadomNum() * 10000).toFixed(2),
      };
    });
    const res = {
      code: 200,
      data: [...list],
    };
    resolve(res);
  });
};

export { getUserMapData };
