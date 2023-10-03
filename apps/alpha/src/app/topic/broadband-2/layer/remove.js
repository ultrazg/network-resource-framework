/**
 * 地图图层物体清除函数
 */

import * as d3 from 'd3';

/**
 * 清除星点
 * @param {*} china
 */
const removeStarLightLayer = (china) => {
  china.selectAll('g.starLightGroups').remove();
};

/**
 * 清除柱子
 */
const removeCylinderLayer = (china) => {
  china.selectAll('g.rect3dGroups0, g.rect3dGroups1, g.rect3dGroups2').remove();
};

/**
 * 清除所有物体
 */
const removeAllLayer = (china) => {
  removeStarLightLayer(china);
  removeCylinderLayer(china);
};

/**
 * 移除当前专题图例
 */
function removeLegend() {
  d3.selectAll('div.legend').remove();
  d3.selectAll('div.legend-2').remove();
  d3.selectAll('div.legend-3').remove();
  d3.selectAll('div.legend-4').remove();
  d3.selectAll('div.legend-5').remove();
}

export {
  removeStarLightLayer,
  removeCylinderLayer,
  removeAllLayer,
  removeLegend,
};
