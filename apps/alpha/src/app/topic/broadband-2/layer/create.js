/**
 * 图层物体创建函数文件
 */

import { nameMap, names } from '../components/resource';
import * as d3 from 'd3';
import { getUnit } from './function';
import { convertMeasure, simplifyProvinceName } from '@alpha/utils/commFunc';

const getValue = (name, value) => {
  if (value === undefined || value === null) return '--';
  if (name.includes('Rate') || name.includes('rate')) {
    return value + '%';
  } else {
    return convertMeasure(value, 2).join('');
  }
};

/**
 * 创建信息框
 * @param {number} type
 * @param {Array} data
 */
function createLabel(type, data, target) {
  console.log(target);
  target = target ? target : names[0][0];
  d3.selectAll('div.svg-label-info')
    .data(data)
    .html((d, _) => {
      const retValue = () => {
        return d.info[getTargetKeyByName(target, type)]
          ? getValue(
              getTargetKeyByName(target, type),
              d.info[getTargetKeyByName(target, type)]
            )
          : '';
      };
      return d.info
        ? `<div class="wrapper">
            <div class="name">
              <span class="name">
              ${simplifyProvinceName(d.properties.name)}
              </span>
              <span class="value">
              ${retValue()}
              </span>
            </div>
          </div>`
        : '';
    });

  d3.selectAll('div.svg-tips')
    .data(data)
    .html((d, _) => {
      return d.info
        ? Object.keys(nameMap[type])
            .map((t) => {
              return `<div class="item">
                      <span class="key">${nameMap[type][t]}</span>
                      <span class="value">${
                        d.info[t] !== null && d.info[t] !== undefined
                          ? convertMeasure(d.info[t]).join('') +
                            getUnit(nameMap[type][t])
                          : '--'
                      }</span>
                    </div>`;
            })
            .join('')
        : '';
    });

  d3.selectAll('g.line-group').classed('visible', (d, _) => {
    return checkLineIsShow(data, d[2]);
  });
}

function getTargetKeyByName(name, type) {
  const keys = Object.keys(nameMap[type]);

  for (let key of keys) {
    if (nameMap[type][key] === name) {
      return key;
    }
  }

  return 'ponPortRate';
}

function checkLineIsShow(data, name) {
  const filter = data.filter((item) => item.properties?.name == name);

  return filter && filter[0] && filter[0].info;
}

export { createLabel };
