import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import * as turf from '@turf/turf';

import { fetchChinaProvinceMapWithId } from '@alpha/api/data';
import styled from 'styled-components';
import {
  initCityEdge,
  initCityInfoLabels,
  initCityInfos,
  initCityTooltips,
} from '../layer/init';
import { createLabel } from '../layer/create';
import {
  findProvinceIndex,
  showProvinceLabel,
  showProvinceTips,
  showProvinceEdge
} from '../layer/function';

const NOT_SHOW_PROVINCE = ['台湾省', '香港特别行政区', '澳门特别行政区'];

const CITYS = ['重庆市', '上海市', '北京市', '天津市']

const XJ_NAME_MAP = new Map([
  ['哈密地区', '哈密市'],
  ['昌吉州', '昌吉回族自治州'],
  ['博州', '博尔塔拉蒙古自治州'],
  ['巴州', '巴音郭楞蒙古自治州'],
  ['克州', '克孜勒苏柯尔克孜自治州'],
  ['伊犁州', '伊犁哈萨克自治州']
])

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

    d3.select('.single-info')
      .select('span.name')
      .html(() => {
          return CITYS.includes(props.provinceName) ? props.provinceName : name;
      });
    showProvinceLabel(name);
    showProvinceTips(name);
    showProvinceEdge(name);
  }

  function doubleClickHandler(city) {
    props.setCity(city.name);
  }

  function loopHandler(geo, index) {
    if (geo && geo[index]) clickHandler(geo[index].properties.name);
  }

  function updateData(data, geoJson) {
    d3.selectAll('div.svg-label-info')
      .selectAll('div.name span.value')
      .html('');
    const cityArr = data
      .map(({name, mapList}) => (mapList.map(val => ({...val, name}))))
      .flat(1)
      .filter(item => item.provinceName)
    let geo = JSON.parse(JSON.stringify(geoJson)).map(item => {
      let info = [{name: '城域网'},{name: 'IPRAN'},{name: '智能城域网'}]
      if(CITYS.includes(props.provinceName)) {
        // 直辖市数据
        info = cityArr
      } else {
        const cityData = cityArr.filter(val => {
          const provName = XJ_NAME_MAP.get(val.provinceName) || val.provinceName
          return provName.indexOf(item.properties.name) > -1
        })
        // 接口有数据返回则取，否则默认填充
        cityData.length && (info = cityData)
      }
      return {
        ...item,
        info: info.length ? info : null
      }
    })
    length = geo.length;
    createLabel(geo, '', 'city');
    d3.selectAll('path.edge')
      .data(geo)
      .attr('class', (d) => {
        return d.info ? 'edge' : 'edge disabled';
      });
    geoData = geo;

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

  const addMapEvent = () => {
    if(!props.resourceData) return
    d3.selectAll('path.edge')
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
}

  const removeMapEvent = () => {
      if(!props.resourceData) return
      d3.selectAll('path.edge').on('click', null)
        .on('dblclick', null);
  }
  

  useEffect(() => {
    if (!props.adcode) {
      return;
    }

    const current = provinceMapRef.current,
      parent = current.parentNode;

    const w = parent.offsetWidth,
      h = parent.offsetHeight;

    const offsetX = w * 0.1,
      offsetY = props.adcode == '460000' ? h * 0.2 : h * 0.05;

    svg = d3
      .select(current)
      .append('svg')
      .attr('class', 'svg-province-map')
      .attr('width', w)
      .attr('height', h);
    const g = svg
      .append('g')
      .attr('transform', `translate(${offsetX}, ${offsetY})`)
      .style('pointer-events', 'auto');

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
        path
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

      const tooltips = initCityTooltips(parent, cities, projection, offsetX, offsetY);
      tooltips.html('');
      updateData(props.resourceData, cities);

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

      // lineGroup
      //   .append('circle')
      //   .attr('class', 'start')
      //   .attr('cx', (d, _) => {
      //     return d[0][0];
      //   })
      //   .attr('cy', (d, _) => {
      //     return d[0][1];
      //   })
      //   .attr('r', 2);

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

    d3.select(parent)
      .append('div')
      .attr('class', 'single-info active')
      .attr('name', (d, _) => {
          return '';
      })
      .style('width', (d, _) => {
          return 219 + 'px';
      })
      .style('left', (d, _) => {
          return 100 + 'px';
      })
      .style('bottom', (d, _) => {
          return 174 + 'px';
      })
      .style('position', 'absolute')
      .append('div')
      .attr('class', 'wrapper')
      .append('div')
      .attr('class', 'name')
      .html((d, _) => {
        return `
            <span class="name"></span>
          `;
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
    if (props.resourceData && cities) {
      updateData(props.resourceData, cities);
    }
    props.resourceData && addMapEvent()
    return () => {
        removeMapEvent()
    }
  }, [props.resourceData]);

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
  pointer-events: none;
  position: absolute;
  left: 0px;
  width: 700px;
  height: 784px;
  .province-map svg.svg-province-map g.city path.edge{
    stroke-width: 1;
    filter: drop-shadow(0 0 20px #000);
    &.active {
      fill: rgba(255, 124, 0, 0.34);
      stroke: #D7C448;
    }
  }
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
    .key,
    .value {
      font-size: 14px !important;
    }
    &.active {
      &.disabled {
        display: none;
      }
      .port-item {
        background: transparent !important;
        padding-left: 0 !important;
        
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
`;
