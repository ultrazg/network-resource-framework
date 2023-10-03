/**
 * 地图初始化函数文件
 */

import * as d3 from 'd3';
import { flattenDepth } from 'lodash';
import * as turf from '@turf/turf';

import {
  generateRadomNum,
  simplifyProvinceName,
} from 'apps/alpha/src/utils/commFunc';

const NOT_SHOW_PROVINCE = ['台湾省', '香港特别行政区', '澳门特别行政区'];

const init = (chinaMapRef) => {
  const current = chinaMapRef.current,
    parent = current.parentNode;

  const w = parent.offsetWidth || 802,
    h = parent.offsetHeight;

  d3.select(current).select('svg').remove();

  const svg = d3
    .select(current)
    .append('svg')
    .attr('class', 'svg-china-map')
    .attr('width', w)
    .attr('height', h);

  return [svg.append('g').attr('transform', 'translate(0,0)'), current, w, h];
};

const initCenters = (province) => {
  return province
    .map((t) => {
      let p = t.properties;
      return {
        center: p.cp,
        name: p.name,
      };
    })
    .filter((t) => t.center && NOT_SHOW_PROVINCE.indexOf(t.name) === -1);
};

// 初始化全国地图edge
const initEdge = (
  provinceG,
  path,
  data,
  color,
  timeHoldHandler,
  clickHandler,
  doubleClickHandler
) => {
  provinceG
    .selectAll('path.edge')
    .data(data.features)
    .enter()
    .append('path')
    .attr('class', 'edge')
    .attr('fill', (_, i) => {
      return String(color(i)).replace(')', ', 0.0)');
    })
    .attr('d', path)
    .attr('name', function (d, _) {
      return d.properties.name;
    })
    .attr('adcode', function (d, _) {
      return `${d.properties.id}0000`;
    })
    .on('click', (_, d) => {
      if (d.info) {
        timeHoldHandler(d.properties.name);
        clickHandler(d.properties.name);
      }
    })
    .on('dblclick', (_, d) => {
      doubleClickHandler(
        d.properties.name,
        `${d.properties.id}0000`,
        d.properties
      );
    });
};

// 初始化省份地图edge
const initCityEdge = (
  provinceG,
  path,
  timeHoldHandler,
  clickHandler,
  doubleClickHandler
) => {
  provinceG
    .append('path')
    .attr('class', 'edge')
    .attr('fill', '#182c4d')
    .attr('d', path)
    .attr('name', function (d, _) {
      return d.properties.name;
    })
    .attr('ad', function (d, _) {
      return d.properties.id;
    })
    .on('click', (_, d) => {
      if (d.info) {
        timeHoldHandler(d.properties.name);
        clickHandler(d.properties.name);
      }
    })
    .on('dblclick', (_, d) => {
      doubleClickHandler({
        name: d.properties.name,
        id: d.properties.adcode,
        center: d.properties.center,
        cp: d.properties.centroid,
        childrenNum: d.properties.childrenNum,
      });
    });
};

const initInfos = (
  current,
  features,
  projection,
  clickHandler,
  timeHoldHandler,
  doubleClickHandler,
  linePoints
) => {
  return d3
    .select(current)
    .append('div')
    .attr('class', 'svg-label-info-group')
    .selectAll('div.svg-label-info')
    .data(features)
    .enter()
    .append('div')
    .attr('class', 'svg-label-info')
    .attr('name', (d, _) => {
      return d.properties.name;
    })
    .style('pointer-events', (d, _) => {
      return d.properties.label ? 'all' : 'none';
    })
    .style('width', (d, _) => {
      return 120 + 'px';
    })
    .style('left', (d, _) => {
      let point = d.properties.label ? d.properties.label : d.properties.cp;

      if (d.properties.label) {
        linePoints.push([
          projection(d.properties.label),
          projection(d.properties.cp),
        ]);
      }

      let position = projection(point || [0, 0]);
      return position[0] + 'px';
    })
    .style('top', (d, _) => {
      let point = d.properties.label ? d.properties.label : d.properties.cp;

      if (d.properties.label) {
        linePoints.push([
          projection(d.properties.label),
          projection(d.properties.cp),
        ]);
      }

      let position = projection(point || [0, 0]);

      return position[1] - 16 + 'px';
    })
    .on('click', (_, d) => {
      // console.log('????!!!!');
      timeHoldHandler(d.properties.name);
      clickHandler(d.properties.name);
    })
    .on('dblclick', (_, d) => {
      doubleClickHandler(
        d.properties.name,
        `${d.properties.id}0000`,
        d.properties
      );
    })
    .style('position', 'absolute')
    .append('div')
    .attr('class', 'wrapper');
};

const initCityInfos = (
  current,
  features,
  projection,
  timeHoldHandler,
  clickHandler,
  offsetX,
  offsetY,
  linePoints,
  doubleClickHandler
) => {
  return d3
    .select(current)
    .append('div')
    .attr('class', 'svg-label-info-group')
    .selectAll('div.svg-label-info')
    .data(features)
    .enter()
    .append('div')
    .attr('class', 'svg-label-info')
    .attr('name', (d, _) => {
      return d.properties.name;
    })
    .style('pointer-events', (d, _) => {
      return d.properties.label ? 'auto' : 'none';
    })
    .style('width', '200px')
    .style('left', (d, _) => {
      const points = flattenDepth(d.geometry.coordinates, 2);
      const features = turf.points(points);
      const center = turf.center(features);
      let point = d.properties.label
        ? d.properties.label
        : center.geometry.coordinates;

      if (d.properties.label) {
        linePoints.push([
          projection(d.properties.label),
          projection(d.properties.centroid),
          d.properties.name,
        ]);
      }

      let position = projection(point || [0, 0]);
      return position[0] + offsetX - 60 + 'px';
    })
    .style('top', (d, _) => {
      const points = flattenDepth(d.geometry.coordinates, 2);
      const features = turf.points(points);
      const center = turf.center(features);

      let point = d.properties.label
        ? d.properties.label
        : center.geometry.coordinates;

      let position = projection(point || [0, 0]);
      return position[1] + offsetY - 16 + 'px';
    })
    .on('click', (_, d) => {
      // console.log('????????');
      timeHoldHandler(d.properties.name);
      clickHandler(d.properties.name);
    })
    .on('dblclick', (_, d) => {
      doubleClickHandler({
        name: d.properties.name,
        id: d.properties.adcode,
        center: d.properties.center,
        cp: d.properties.centroid,
        childrenNum: d.properties.childrenNum,
      });
    })
    .style('position', 'absolute')
    .append('div')
    .attr('class', 'wrapper');
};

const initInfoLabels = (info, clickHandler, doubleClickHandler) => {
  const nameWrapper = info.append('div').attr('class', 'name');

  nameWrapper
    .append('span')
    .attr('class', 'name')
    .html((d, _) => {
      const currentName = d.properties.name;

      return simplifyProvinceName(currentName);
    });

  nameWrapper
    .append('span')
    .attr('class', 'value')
    .html((d, _) => {
      return generateRadomNum() * 100;
    });
};

const initCityInfoLabels = (info) => {
  info
    .append('div')
    .attr('class', 'name')
    .html((d, _) => {
      const currentName = d.properties.name;
      return `
            <span class="name">${currentName}</span>
            <span class="value"> ${parseInt(generateRadomNum() * 100)}</span>
          `;
    });
};

const initTooltips = (current, features, projection, top = 600, left = 100) => {
  return d3
    .select(current)
    .append('div')
    .attr('class', 'svg-tips-group')
    .selectAll('div.svg-tips')
    .data(features)
    .enter()
    .append('div')
    .attr('class', 'svg-tips')
    .style('left', (d, _) => {
      let position = projection(
        d.properties.cp || d.properties.centroid || [0, 0]
      );

      return left + 'px';
    })
    .style('bottom', (d, _) => {
      // let position = projection(
      //   d.properties.cp || d.properties.centroid || [0, 0]
      // );

      return 16 + 'px';
    })
    .style('position', 'absolute')
    .attr('name', (d, _) => {
      return d.properties.name;
    });
};

export {
  init,
  initCenters,
  initEdge,
  initInfos,
  initInfoLabels,
  initTooltips,
  initCityEdge,
  initCityInfoLabels,
  initCityInfos,
};
