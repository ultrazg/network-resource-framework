import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import * as turf from '@turf/turf';

import { fetchChinaProvinceMapWithId } from '@alpha/api/data';
import styled from 'styled-components';
import {
  initCityEdge,
  initCityInfoLabels,
  initCityInfos,
  initTooltips,
} from '../layer/init';
import { createLabel } from '../layer/create';
import {
  findProvinceIndex,
  setProvinceColor,
  showProvinceEdge,
  showProvinceLabel,
  showProvinceTips,
} from '../layer/function';
import {
  getOltAnalysisMap,
  getResCellResourcesMap,
  getResMap,
} from '@alpha/api/broardband';

const MIN_DISTANCE = 1800;
const NOT_SHOW_PROVINCE = ['台湾省', '香港特别行政区', '澳门特别行政区'];

let timer = null,
  timeout = null,
  index = 0,
  DURATION = 10,
  DELAY = 30,
  cities = null,
  length = 1,
  svg = null,
  projection = null;

let type = 0;

let geoData = [];

const selectedNames = [
  '宽带资源上图',
  'OLT单/双上联分析',
  '千/百户小区资源预警',
];

function ProvinceMap(props) {
  const provinceMapRef = useRef(null);

  function timeHoldHandler(name) {
    if (timer) {
      timer.stop();
    }

    if (timeout) {
      timeout.stop();
    }

    index = cities.findIndex((item) => item.properties.name.indexOf(name) > -1);

    timeout = d3.timeout(() => {
      timer = d3.interval(() => {
        index = findProvinceIndex(index, geoData, geoData.length);
        loopHandler(cities, index % length);

        index++;
      }, DURATION * 1000);
    }, DELAY * 1000);
  }

  function clickHandler(name) {
    if (NOT_SHOW_PROVINCE.includes(name)) {
      return;
    }

    showProvinceEdge(name);
    showProvinceLabel(name);
    d3.select('.svg-label-info-group')
      .select('.single-info')
      .select('span.name')
      .html(() => {
        return name;
      });
    showProvinceTips(name);
  }

  function doubleClickHandler(city) {
    props.setCity(city);
  }

  function loopHandler(geo, idx) {
    if (geo && geo[idx]) clickHandler(geo[idx].properties.name);
  }

  function clickMenuHandler(type, geo) {
    console.log(props.provinceName);
    let province = props.provinceName;
    const params = { province };
    if (['天津市', '重庆市', '北京市', '上海市'].includes(province)) {
      params.city = province;
    }
    if (type == 0) {
      //请求
      getResMap(params).then((res) => {
        updateData(res, geo, type);
      });
    } else if (type == 1) {
      //请求
      getOltAnalysisMap(params).then((res) => {
        updateData(res, geo, type);
      });
    } else if (type == 2) {
      getResCellResourcesMap(params).then((res) => {
        updateData(res, geo, type);
      });
    }
  }

  function updateData(d, g, i) {
    d3.selectAll('div.svg-label-info')
      .selectAll('div.name span.value')
      .html('');

    d3.selectAll('div.legend').remove();
    console.log(props.target, props.typeIndex, 'province');
    d3.select(provinceMapRef.current.parentNode)
      .append('div')
      .attr('class', 'legend')
      .attr('data-content-before', '0%')
      .attr('data-content-after', '100%')
      .append('div')
      .attr('class', 'title')
      .html(props.target ? props.target : names[0][0]);

    if (d.code == 200) {
      const mapData = d.data.list;

      let geo = JSON.parse(JSON.stringify(g));
      for (const element of geo) {
        for (const child of mapData) {
          if (child.city.indexOf(element.properties.name) > -1) {
            element.info = child;
            break;
          } else if (
            child.district &&
            child.district.indexOf(element.properties.name) > -1
          ) {
            element.info = child;
            break;
          }
        }
      }
      length = geo.length;
      setProvinceColor(i, geo, props.target);

      createLabel(i, geo, props.target);

      d3.selectAll('path.edge')
        .data(geo)
        .attr('class', (d) => {
          return d.info ? 'edge' : 'edge disabled';
        });
      geoData = geo;
    }

    index = findProvinceIndex(index, geoData, geoData.length);
    loopHandler(cities, index % length);
    index++;
    timer && timer.stop();
    timer = d3.interval(() => {
      index = findProvinceIndex(index, geoData, geoData.length);
      loopHandler(cities, index % length);
      index++;
    }, DURATION * 1000);
  }

  useEffect(() => {
    if (!props.adcode) {
      return;
    }

    const current = provinceMapRef.current,
      parent = current.parentNode;

    const w = parent.offsetWidth,
      h = parent.offsetHeight;

    const offsetX = w * 0.2,
      offsetY = props.adcode == '460000' ? h * 0.2 : h * 0.05;

    svg = d3
      .select(current)
      .append('svg')
      .attr('class', 'svg-province-map')
      .attr('width', w)
      .attr('height', h);
    const g = svg
      .append('g')
      .attr('transform', `translate(${offsetX}, ${offsetY})`);

    let linePoints = [];

    //获取中国地图的json文件
    fetchChinaProvinceMapWithId(`${props.adcode}`).then((data) => {
      const centroid = turf.centroid(data);

      cities = data.features;

      projection = d3
        .geoMercator()
        .center(centroid.geometry.coordinates)
        .fitSize([w * 0.8, h * 0.8], data);

      const path = d3.geoPath(projection);

      const clippath = svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'clipPath')
        .attr('transform', `translate(${offsetX}, ${offsetY})`);
      clippath
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path);

      d3.select(current).classed('bg', true);

      const provinceG = g
        .selectAll('g.city')
        .data(data.features)
        .enter()
        .append('g')
        .attr('class', 'city');

      // 初始化edge
      initCityEdge(
        provinceG,
        path,
        timeHoldHandler,
        clickHandler,
        doubleClickHandler
      );

      //绘制文字
      const info = initCityInfos(
        parent,
        cities,
        projection,
        timeHoldHandler,
        clickHandler,
        offsetX,
        offsetY,
        linePoints,
        doubleClickHandler
      );

      initCityInfoLabels(info);
      d3.select(parent)
        .select('.svg-label-info-group')
        .append('div')
        .attr('class', 'single-info active')
        .attr('name', (d, _) => {
          return '';
        })
        .style('width', (d, _) => {
          return 180 + 'px';
        })
        .style('left', (d, _) => {
          return 100 + 'px';
        })
        .style('top', (d, _) => {
          return 653 + 'px';
        })
        .style('position', 'absolute')
        .append('div')
        .attr('class', 'wrapper')
        .append('div')
        .attr('class', 'name')
        .html((d, _) => {
          return `
              <span class="name"></span>
              <span class="value"></span>
            `;
        });

      const tooltips = initTooltips(parent, cities, projection, 680);
      tooltips.html('');
      clickMenuHandler(type, data.features);

      const lineGroup = d3
        .select(parent)
        .append('svg')
        .attr('class', 'svg-province-line')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', `translate(${offsetX}, ${offsetY})`)
        .append('g')
        .attr('class', 'label-lines')
        .selectAll('g.line-group')
        .data(linePoints)
        .enter()
        .append('g')
        .attr('class', 'line-group')
        .attr('name', (d, _) => {
          return d[2];
        });

      lineGroup
        .append('line')
        .attr('class', 'line')
        .attr('x1', (d, _) => {
          return d[0][0];
        })
        .attr('y1', (d, _) => {
          return d[0][1];
        })
        .attr('x2', (d, _) => {
          return d[1][0];
        })
        .attr('y2', (d, _) => {
          return d[1][1];
        })
        .attr('stroke', '#fff');

      lineGroup
        .append('circle')
        .attr('class', 'start')
        .attr('cx', (d, _) => {
          return d[0][0];
        })
        .attr('cy', (d, _) => {
          return d[0][1];
        })
        .attr('r', 2);

      lineGroup
        .append('circle')
        .attr('class', 'end')
        .attr('cx', (d, _) => {
          return d[1][0];
        })
        .attr('cy', (d, _) => {
          return d[1][1];
        })
        .attr('r', 2);
    });

    return () => {
      if (timer) {
        timer.stop();
      }

      if (timeout) {
        timeout.stop();
      }
      timer = null;
      timeout = null;
      index = 0;
      DURATION = 10;
      DELAY = 30;
      cities = null;
    };
  }, [props.adcode]);

  useEffect(() => {
    if (props.selectedName) {
      type = selectedNames.findIndex((t) => t.includes(props.selectedName));

      if (cities) {
        if (timer) {
          timer.stop();
        }

        if (timeout) {
          timeout.stop();
        }
      }
    }
  }, [props.selectedName]);

  useEffect(() => {
    if (props.target) {
      if (cities) {
        clickMenuHandler(props.typeIndex, cities);
      }
    }
  }, [props.target]);

  return (
    <>
      <ProvinceMapWrap>
        <div className={`province-map`} ref={provinceMapRef}></div>
      </ProvinceMapWrap>
    </>
  );
}

export default ProvinceMap;

const ProvinceMapWrap = styled.div`
  pointer-events: auto;
  position: absolute;
  left: 50px;
  width: 900px;
  height: 920px;

  .svg-province-line {
    pointer-events: none;
    position: absolute;
    top: 0;

    g {
      &.label-lines {
        line {
          stroke: #fdff0030;
        }
        circle {
          stroke: #fff;
          stroke-width: 1;
          fill: #fdff0030;
        }
      }
      &.line-group {
        visibility: hidden;
        &.visible {
          visibility: visible;
        }
      }
    }
  }

  .svg-label-info {
    background: url('./assets/broadband-label.svg') left center no-repeat;
    background-size: 86px 26px;
    width: 180px;
    height: 27px;
    position: absolute;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    &.active {
      opacity: 1 !important;
      &.disabled {
        display: none;
        opacity: 0 !important;
      }
    }
    &.disabled {
      display: none;
    }
    .wrapper {
      position: relative;
      > div {
        position: absolute;
      }
      .duration {
        font-family: 'PMZD', sans-serif;
        font-size: 12px;
        color: #7e4d15;
        top: 6px;
        left: 6px;
        width: 18px;
        text-align: center;
      }
      .name {
        font-size: 12px;
        color: #ffffff;
        top: 5px;
        left: 15px;
        display: flex;
        align-items: center;
        span {
          &.name {
            letter-spacing: 2px;
            white-space: nowrap;
          }
          &.value {
            font-family: 'PMZD', sans-serif;
            margin-left: 8px;
          }
        }
      }
    }
  }
  .single-info {
    background: url('./assets/transmission-label.svg') left center no-repeat;
    width: 180px;
    height: 27px;
    position: absolute;
    cursor: pointer;
    opacity: 0;
    /* pointer-events: none; */
    &.active {
      opacity: 1 !important;
      &.disabled {
        display: none;
        opacity: 0 !important;
      }
    }
    &.disabled {
      display: none;
    }
    .wrapper {
      position: relative;
      > div {
        position: absolute;
      }
      .duration {
        font-family: 'PMZD', sans-serif;
        font-size: 12px;
        color: #7e4d15;
        top: 6px;
        left: 6px;
        width: 18px;
        text-align: center;
      }
      .name {
        font-size: 12px;
        color: #ffffff;
        top: 5px;
        left: 15px;
        span {
          &.name {
            letter-spacing: 2px;
            white-space: nowrap;
          }
          &.value {
            font-family: 'PMZD', sans-serif;
          }
        }
      }
    }
  }
  .svg-tips {
    display: none;
    pointer-events: none;
    &.active {
      &.disabled {
        display: none;
      }
      transform: scale(0.9);
      transform-origin: 0 0;
      min-width: 150px;
      min-height: 30px;
      border: 1px solid #007cff;
      box-shadow: inset 0 0 22px 0 rgb(0 122 255 / 30%),
        inset 0 0 3px 0 rgb(6 135 240 / 40%);
      border-radius: 0px;
      background-color: rgba(12, 51, 97, 0.7);
      font-size: 12px;
      padding: 8px 8px 0;
      box-sizing: border-box;
      display: block;
      white-space: nowrap;
      z-index: 99;
      .header {
        color: #00c5f5;
        letter-spacing: 0;
        width: 100%;
        height: 30px;
        margin-bottom: 10px;
        padding: 0;

        span {
          float: right;
          font-size: 10px;
          width: 60px;
          text-align: left;
        }
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          top: 30px;

          background: url('./assets/info-line.png') no-repeat center;
          background-size: 90% 100%;
        }
      }
      > div:not(.bar, .header, .cylinder) {
        display: flex;
        margin: 0 0 8px;
        &:not(.box, .device) {
          background: url('./assets/tooltips-item.svg') left center no-repeat;
        }
        padding-left: 25px;
        &.fixed {
          span {
            &.key {
              width: 105px;
            }
            &.value {
              margin-left: 0;
              text-align: left;
            }
          }
        }
        span {
          font-size: 12px;
          &.key {
            padding-right: 10px;
          }
          &.key-long {
            width: 50px;
            padding-right: 18px;
            word-wrap: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          &.iconfont,
          &.precentage {
            padding-left: 0;
          }
          &.name {
            color: #32c5ff;
            margin-right: 20px;
          }
          &.value {
            font-family: 'PMZD', sans-serif;
            color: #01fafb;
            margin-left: auto;
            min-width: 60px;
            text-align: right;
          }
          &.value-long {
            font-family: 'PMZD', sans-serif;
            color: #01fafb;
            margin-left: auto;
            width: 60px;
            text-align: left;
            line-height: 20px;
          }
        }
      }
    }
  }
  .legend {
    position: absolute;
    top: 850px;
    left: 350px;
    width: 180px;
    height: 12px;
    background: linear-gradient(
      90deg,
      rgba(0, 255, 206, 1),
      rgba(81, 166, 255, 1),
      rgba(0, 47, 255, 1)
    );
    display: flex;
    font-size: 10px;
    > div {
      position: relative;
      font-size: 12px;
      text-align: left;
      line-height: 12px;
    }
    &::before {
      content: attr(data-content-before);
      position: relative;
      left: -23px;
      font-size: 12px;
      color: #00f2ff;
      height: 12px;
      line-height: 12px;
    }
    &::after {
      content: attr(data-content-after);
      position: relative;
      right: -45px;
      font-size: 12px;
      color: #00f2ff;
      height: 12px;
      display: inline-block;
      width: 50px;
      line-height: 12px;
    }
    .title {
      left: -5px;
      width: 200px !important;
      height: 20px;
      top: -20px;
      text-align: left;
      color: #00f2ff;
    }
  }
`;
