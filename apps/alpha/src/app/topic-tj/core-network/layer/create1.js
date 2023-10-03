/**
 * 图层物体创建函数文件
 */

import * as d3 from 'd3';
import { simplifyProvinceName } from '@alpha/utils/commFunc';
import { nameMap } from '../static/config'
/**
 * 数字转万
 * @param value 数字或者字符串
 */
function transformValue(value){
  if(value - 10000 > 0) return (value/10000).toFixed(2)
  else return value
}
/**
 * 创建信息框
 * @param {Array} data
 * @param {string} name
 * @param {string} level
 * @param {number} mapType
 */
function createLabel(data, type) {
  d3.selectAll('div.svg-label-info')
    .data(data)
    .html((d, _) => {
      return `
        <div class="wrapper">
          <div class="name">
            <span class="name">
            ${simplifyProvinceName(d.properties.name)}
            </span>
          </div>
        </div>
      `
    });
  
  d3.selectAll('div.core-svg-tips')
    .data(data)
    .html((d, _) => {
      return d.info
        ? 
        `<div class="tips-title">
            <span class="key">${d.info.name}</span>
        </div>
        ` + '<div class="item-wrap">' + nameMap[type].map(item => {
          return `
            <div class="item">
              <span class="key">${item.areaName}</span>
              <span class="value">${item.areaCount}</span>
            </div>
          `
        }).join('') + '</div>'
        :
        '';
    })
    .style('width', type !== 1 ? '590px' : '306px')

  d3.selectAll('g.line-group').classed('visible', (d, _) => {
    return checkLineIsShow(data, d[2]);
  });
}

function checkLineIsShow(data, name) {
  const filter = data.filter((item) => item.properties?.name == name);

  return filter && filter[0] && filter[0].info;
}

export { createLabel };
