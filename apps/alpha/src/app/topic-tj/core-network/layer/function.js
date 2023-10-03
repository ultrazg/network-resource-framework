/**
 * 地图图层工具函数文件
 */
import * as d3 from 'd3';
import * as _ from 'lodash';
import { areaMap, colorMap } from '../static/config';
import {
  simplifyProvinceName,
} from 'apps/alpha/src/utils/commFunc';

/**
 * 高亮相应省份Edge
 * @param {*} name
 */
const showProvinceEdge = (name) => {
  d3.selectAll('path.edge').attr('class', (d) => {
    if (d.properties.name.indexOf(name) > -1) {
      return d.info ? 'active2 edge' : 'active2 edge disabled';
    } else {
      return d.info ? 'edge' : 'edge disabled';
    }
  });
};

/**
 * 高亮相应区域Edge
 * @param {*} name
 */
 const showProvinceAreaEdge = (type) => {
  d3.selectAll('path.edge')
    .attr('class', (d) => {
      if (areaMap[type].includes(simplifyProvinceName(d.properties.name))) {
        return 'active edge'
      }
      return 'edge';
    }).attr('fill', d => {
      let index = 0
      areaMap.map((item, i) => {
        item.includes(simplifyProvinceName(d.properties.name)) && (index = i)
      })
      return colorMap[index]
    });
};

/**
 * 显示相应省份标签
 * @param {*} name
 */
const showProvinceLabel = (name) => {
  d3.selectAll('div.svg-label-info')
    .attr('class', (d) => {
      return d.info ? 'active svg-label-info' : 'active svg-label-info disabled';
    })
    .style('z-index', (d) => {
      return d.properties.name.includes(name) ? 9 : 2;
    });
};

/**
 * 显示相应省份信息框内容
 * @param {*} name
 * @param {*} mapType
 * @param {*} areaValue
 */
const showProvinceTips = (name, mapType, areaValue) => {
  d3.selectAll('div.core-svg-tips').attr('class', (d) => {
    let provName = name
    if(mapType === 0) {
      provName = areaMap[areaValue][0]
    }
    if (d.properties.name.indexOf(provName) > -1) {
      return d.info ? 'active core-svg-tips' : 'active core-svg-tips disabled';
    } else {
      return d.info ? 'core-svg-tips' : 'core-svg-tips disabled';
    }
  });
};

/**
 * 查找有数据的省份Index
 * @param {*} index 当前index
 * @param {*} geo 数据
 * @returns
 */
const findProvinceIndex = (index, geo, length = 31) => {
  let cnt = 0;
  while (geo && geo[index % length] && !geo[index % length].info) {
    index++;
    cnt++;
    if (cnt > length + 4) break;
  }
  return index;
};

const compareFun = (property)=>{
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

export {
  showProvinceEdge,
  showProvinceAreaEdge,
  showProvinceLabel,
  showProvinceTips,
  findProvinceIndex,
  compareFun
};
