/**
 * 地图图层工具函数文件
 */
import * as d3 from 'd3';
import * as _ from 'lodash';

/**
 * 高亮相应省份地图上标签选中状态
 * @param {*} name
 */
const showProvinceTag = (name) => {
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
      return d.info ? 'active svg-label-info' : 'active svg-label-info disabled';
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
  showProvinceLabel,
  showProvinceTips,
  findProvinceIndex,
  showProvinceTag,
  compareFun
};
