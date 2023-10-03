/**
 * 地图图层工具函数文件
 */
import { convertMeasure } from '@alpha/utils/commFunc';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { nameMap, names } from '../components/resource';

/**
 * 高亮相应省份Edge
 * @param {*} name
 */
const showProvinceEdge = (name) => {
  d3.selectAll('path.edge').attr('class', (d) => {
    if (d.properties.name.indexOf(name) > -1) {
      return d.info ? 'active edge' : 'active edge disabled';
    } else {
      return d.info ? 'edge' : 'edge disabled';
    }
  });
};

/**
 * 显示相应省份标签
 * @param {*} name
 */
const showProvinceLabel = (name) => {
  d3.selectAll('div.svg-label-info')
    .attr('class', (d) => {
      return d.info
        ? 'active svg-label-info'
        : 'active svg-label-info disabled';
    })
    .style('z-index', (d) => {
      return d.properties.name.includes(name) ? 9 : 2;
    });
};

/**
 * 显示相应省份信息框内容
 * @param {*} name
 */
const showProvinceTips = (name) => {
  d3.selectAll('div.svg-tips').attr('class', (d) => {
    if (d.properties.name.indexOf(name) > -1) {
      return d.info ? 'active svg-tips' : 'active svg-tips disabled';
    } else {
      return d.info ? 'svg-tips' : 'svg-tips disabled';
    }
  });
};

/**
 * 根据省份数据重置edge
 */
const resetEdge = () => {
  d3.selectAll('path.edge').attr('class', (d) => {
    return d.info ? 'edge' : 'edge disabled';
  });
};

/**
 * 根据省份数组显示相应省份标签
 * @param {*} nameArray
 */
const showProvinceLabelByArray = (nameArray) => {
  d3.selectAll('div.svg-label-info')
    .attr('class', (d) => {
      return d.info ? 'active svg-label-info' : 'svg-label-info disabled';
    })
    .style('z-index', (d) => {
      return nameArray.includes(d.properties?.name) ? 9 : 2;
    });
};

/**
 * 根据省份数组显示相应省份信息框内容
 * @param {*} nameArray
 */
const showProvinceTipsByArray = (nameArray) => {
  d3.selectAll('div.svg-tips').attr('class', (d) => {
    if (nameArray.includes(d.properties?.name)) {
      return d.info ? 'active svg-tips' : 'active svg-tips disabled';
    } else {
      return d.info ? 'svg-tips' : 'svg-tips disabled';
    }
  });
};

const getUnit = (name) => {
  if (name.includes('率') || name.includes('占比') || name === '宽带资源质量') {
    return '%';
  } else if (['宽带覆盖小区'].includes(name)) {
    return ' 个';
  } else {
    return '';
  }
};

const isValue = (value) => {
  return value !== null && value !== undefined;
};

/**
 * 查找有数据的省份Index
 * @param {*} index 当前index
 * @param {*} geo 数据
 * @returns
 */
const findProvinceIndex = (index, geo, length = 31) => {
  let cnt = 0;
  if (geo && geo[index % length] && !geo[index % length].info) {
    while (true) {
      index++;
      cnt++;
      if (cnt > length + 4) break;
    }
  }
  return index;
};

/**
 *
 * @param {number} type 当前的标题类型
 * @param {Array} data 各个省份数据数组
 * @param {Array} sorted 通过某指标排序的数组
 */
function setProvinceColor(type, data, target, change = false) {
  target =
    target !== '' && names[type].includes(target) ? target : names[type][0];

  console.log(target);

  const key = _.findKey(nameMap[type], (t) => t.includes(target));

  const max = d3.max(data.filter((t) => t.info).map((t) => t.info[key]));
  const min = d3.min(data.filter((t) => t.info).map((t) => t.info[key]));
  if (target.includes('率') || target.includes('占比')) {
    d3.selectAll('.legend')
      .attr('data-content-before', '0%')
      .attr('data-content-after', '100%');
  } else {
    d3.selectAll('.legend')
      .attr('data-content-before', '0')
      .attr('data-content-after', `${convertMeasure(max, 0).join('')}`);
  }
  const color = d3
    .scaleQuantize()
    .domain([min, max])
    .range([
      'rgba(0, 255, 206, 0.4)',
      'rgba(0, 145, 255, 0.5)',
      'rgba(1, 28, 141, 0.4)',
    ]);

  if (type === 0) {
    d3.selectAll('path.edge')
      .data(data)
      .attr('fill', (d) => {
        if (target !== names[0][1] || !change) {
          return d.info && isValue(d.info[key])
            ? String(color(d.info[key]))
            : 'rgba(1, 28, 141, 0.01)';
        } else {
          return d.info && isValue(d.info[key])
            ? String(getObdColor(d.info[key]))
            : 'rgba(1, 28, 141, 0.02)';
        }
      });
  } else if (type == 1) {
    d3.selectAll('path.edge')
      .data(data)
      .attr('fill', (d) => {
        return d.info && isValue(d.info[key])
          ? String(color(d.info[key]))
          : 'rgba(1, 28, 141, 0.03)';
      });
  } else if (type === 2) {
    d3.selectAll('path.edge')
      .data(data)
      .attr('fill', (d) => {
        return d.info && isValue(d.info[key])
          ? String(color(d.info[key]))
          : 'rgba(1, 28, 141, 0.04)';
      });
  } else {
    d3.selectAll('path.edge')
      .data(data)
      .attr('fill', (d) => {
        return d.info ? 'rgba(1, 28, 141, 0.4)' : 'rgba(0,0,0,0.1)';
      })
      .attr('class', (d) => {
        return d.info ? 'edge' : 'edge disabled';
      });
  }
}

const getObdColor = (value) => {
  if (value > 8e6) {
    return 'rgba(1, 28, 141, 0.4)';
  } else if (value > 3e6) {
    return 'rgba(0, 145, 255, 0.5)';
  } else {
    return 'rgba(0, 255, 206, 0.4)';
  }
};

export {
  showProvinceEdge,
  showProvinceLabel,
  showProvinceTips,
  resetEdge,
  showProvinceLabelByArray,
  showProvinceTipsByArray,
  getUnit,
  findProvinceIndex,
  setProvinceColor,
};
