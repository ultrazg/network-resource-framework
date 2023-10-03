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

  const w = parent.offsetWidth,
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
const initEdge = (provinceG, path, data, color) => {
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
    });
};

// 初始化省份地图edge
const initCityEdge = (provinceG, path) => {
  provinceG
    .append('path')
    .attr('class', 'edge')
    .attr('fill', 'transparent')
    .attr('d', path)
    .attr('name', function (d, _) {
      return d.properties.name;
    })
    .attr('ad', function (d, _) {
      return d.properties.id;
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
    .attr('class', 'svg-label-info active')
    .attr('name', (d, _) => {
      return d.properties.name;
    })
    .style('pointer-events', (d, _) => {
      return d.properties.label ? 'auto' : 'none';
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
      if(d.properties.label){
        return position[0] + 6 + 'px';
      }
      else{
        return position[0] + 30 + 'px';
      }
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
      if(d.properties.label){
        return position[1] - 6 + 'px';
      }
      else{
        return position[1] + 'px';
      }
    })
    .on('click', (_, d) => {
      timeHoldHandler(d.properties.name);
      clickHandler(d.properties.name);
    })
    .on('dblclick', (_, d) => {
      doubleClickHandler(
        d.properties.name,
        `${d.properties.id}`
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
      return position[0] + offsetX - 45 + 'px';
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

const initCylinder = (current, features, projection) => {
  return d3
    .select(current)
    .append('div')
    .attr('class', 'svg-cylinder-group')
    .selectAll('div.svg-cylinder')
    .data(features)
    .enter()
    .append('div')
    .attr('class', 'svg-cylinder')
    .attr('name', (d, _) => {
      return d.properties.name;
    })
    .style('pointer-events', 'none')
    .style('width', '12px')
    .style('height', '90px')
    .style('left', (d, _) => {
      let point = d.properties.label ? d.properties.label : d.properties.cp;
      let position = projection(point || [0, 0]);
      return position[0] + 10 + 'px';
    })
    .style('top', (d, _) => {
      let point = d.properties.label ? d.properties.label : d.properties.cp;
      let position = projection(point || [0, 0]);
      return position[1] - 24 + 'px';
    })
    .style('position', 'absolute');
};

const initSpots = (current, features, projection) => {
  return d3
    .select(current)
    .append('div')
    .attr('class', 'svg-spot-group')
    .selectAll('div.svg-spot')
    .data(features)
    .enter()
    .append('div')
    .attr('class', 'svg-spot disabled')
    .attr('name', (d, _) => {
      return d.properties.name;
    })
    .style('pointer-events', 'none')
    .style('width', '14px')
    .style('height', '14px')
    .style('left', (d, _) => {
      let point = d.properties.label ? d.properties.label : d.properties.cp;
      let position = projection(point || [0, 0]);
      return position[0] - 10 + 'px';
    })
    .style('top', (d, _) => {
      let point = d.properties.label ? d.properties.label : d.properties.cp;
      let position = projection(point || [0, 0]);
      return position[1] + 68 + 'px';
    })
    .style('position', 'absolute')
    .append('div')
    .attr('class', 'spot');
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
      return left + 'px';
    })
    .style('bottom', (d, _) => {
      return 16 + 'px';
    })
    .style('position', 'absolute')
    .attr('name', (d, _) => {
      return d.properties.name;
    });
};

const initCityTooltips = (current, features, projection, offsetX, offsetY) => {
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
      return 100 + 'px';
    })
    .style('top', (d, _) => {
      return 588 + 'px';
    })
    .style('position', 'absolute')
    .attr('name', (d, _) => {
      return d.properties.name;
    });
};
const initDots = (current, features, projection,clickHandler) => {
  return d3
    .select(current)
    .append('div')
    .attr('class', 'svg-dot-group')
    .selectAll('div.svg-dot')
    .data(features)
    .enter()
    .append('div')
    .attr('class', (d,_)=>{
      if(d.isCore){
        return 'svg-dot core'
      }
      else{
        return 'svg-dot'
      }
    })
    .attr('name', (d, _) => {
      return d.properties.name;
    })
    .style('pointer-events', 'none')
    .style('width', '15px')
    .style('height', '15px')
    .style('left', (d, _) => {
      let point = d.properties.cp;
      let position = projection(point || [0, 0]);
      return position[0] + 8 + 'px';
    })
    .style('top', (d, _) => {
      let point = d.properties.cp;
      let position = projection(point || [0, 0]);
      return position[1] - 2 + 'px';
    })
    .style('position', 'absolute')
    .append('div')
    .attr('class', 'spot')
};
export {
  init,
  initCenters,
  initEdge,
  initInfos,
  initCylinder,
  initSpots,
  initInfoLabels,
  initTooltips,
  initCityTooltips,
  initCityEdge,
  initCityInfoLabels,
  initCityInfos,
  initDots,
};
