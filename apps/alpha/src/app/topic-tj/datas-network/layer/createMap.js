/**
 * 图层物体创建函数文件
 */

import * as d3 from 'd3';
import { simplifyProvinceName } from '@alpha/utils/commFunc';
import { convertMeasure } from '@alpha/utils/commFunc';

/**
 * 创建信息框
 * @param {Array} data
 * @param {string} name
 * @param {string} level
 * @param {number} mapType
 */
function createLabel(data, name, level = 'province', mapType) {
  d3.selectAll('div.svg-label-info')
    .data(data)
    .html((d, _) => {
      const value = d.info && level === 'province' ? mapType === 0 ? (d.info?.usedRate || 0) + '%' : (getValue(d.info.count) || 0) : 0
      return d.info
        ? `<div class="wrapper">
            <div class="name">
              <span class="name">
              ${simplifyProvinceName(d.properties.name)}
              </span>
            </div>
          </div>`
        : '';
    });
  
  // d3.selectAll('div.svg-tips')
  //   .data(data)
  //   .html((d, _) => {
  //     return d.info
  //       ? 
  //       level === 'province'
  //       ?
  //       `<div class="item">
  //           <span class="key">${name}</span>
  //       </div>
  //       <div class="port-item">
  //         <span class="key">端口占用率</span>
  //         <span class="value">${d.info?.usedRate || 0}%</span>
  //       </div>
  //       <div class="port-item">
  //         <span class="key">端口利用率达80%设备数</span>
  //         <span class="value">${d.info?.device80 || 0 }</span>
  //       </div>`
  //       :
  //       d.info.map((item, i) => {
  //         return `
  //           <div class="item" style="margin-top: ${i ? '15px' : '0'}">
  //               <span class="key">${item.name}</span>
  //           </div>
  //           <div class="port-item">
  //             <span class="key">端口占用率</span>
  //             <span class="value">${item.usedRate || 0}%</span>
  //           </div>
  //           <div class="port-item">
  //             <span class="key">端口利用率达80%设备数</span>
  //             <span class="value">${item.device80 || 0 }</span>
  //           </div>
  //         `
  //       }).join('')
  //       : '';
  //   });

  // d3.selectAll('g.line-group').classed('visible', (d, _) => {
  //   return checkLineIsShow(data, d[2]);
  // });
}

function getValue (value) {
  const [tNum, tUnit] = convertMeasure(value);
  return tNum + tUnit
}

const createCylinder = (data, mapType) => {
  d3.selectAll('div.svg-cylinder')
    .data(data)
    .html((d, _) => {
      const h = `${d.info?.usedRate || 0}%`
      return d.info?.usedRate && mapType === 0 ? `
        <div class="cylinder" style="height:${h}"></div>
      ` : ''
    });
}

const createSpot = (data, mapType) => {
  d3.selectAll('div.svg-spot')
    .data(data)
    .attr('class', (d) => {
      return d.info?.count && mapType === 1 ? 'svg-spot' : 'svg-spot disabled'
    });
}

function checkLineIsShow(data, name) {
  const filter = data.filter((item) => item.properties?.name == name);
  return filter && filter[0] && filter[0].info;
}
export { createLabel, createCylinder, createSpot };
