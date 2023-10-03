/**
 * 图层物体创建函数文件
 */

import * as d3 from 'd3';
import { simplifyProvinceName } from '@alpha/utils/commFunc';
import { nameMap } from '../static/config'
import core_up from '../../core-network/images/core_up.png'
import core_down from '../../core-network/images/core_down.png'

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
        ` + '<div class="item-wrap">' + nameMap[type].map((item,index) => {
          return `
            <div class="item">
              <span class="key">${item.name}
              ${item.name.includes('环比') && transformValue(d.info[item.key])<0?`<span style="display:inline-block;width:8px;height:10px;background: url(${core_down}) no-repeat center center;background-size: 100% 100%;"></span>`:''}
              ${item.name.includes('环比') && transformValue(d.info[item.key])>0?`<span style="display:inline-block;width:8px;height:10px;background: url(${core_up}) no-repeat center center;background-size: 100% 100%;"></span>`:''}
              </span>
              <span class="value">${transformValue(d.info[item.key])<0?transformValue(d.info[item.key]).slice(1) || '':transformValue(d.info[item.key]) || ''}${item.name.includes('率')||item.name.includes('环比')?'%':'万'}</span>
            </div>
          `
        }).join('') + '</div>'
        :
        '';
    }).style('top','726px').style('left','60px')
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
