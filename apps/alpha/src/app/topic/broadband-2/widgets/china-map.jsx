import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchChinaMapWithNameLabel } from '@alpha/api/data';
import ButtonGroup from '../components/map-button';

import {
  init,
  initEdge,
  initCenters,
  initInfos,
  initInfoLabels,
  initTooltips,
} from '../layer/init';
import { createLabel } from '../layer/create';
import {
  showProvinceEdge,
  showProvinceLabel,
  showProvinceTips,
  findProvinceIndex,
  setProvinceColor,
} from '../layer/function';
import styled from 'styled-components';
import {
  getOltAnalysisMap,
  getResCellResourcesMap,
  getResMap,
} from '@alpha/api/broardband';
import ProvinceMap from './province-map';
import Crumbs from '../components/crumbs';
import { simplifyProvinceName } from '@alpha/utils/commFunc';
import { names } from '../components/resource';

const NOT_SHOW_PROVINCE = ['台湾省', '香港特别行政区', '澳门特别行政区'];
const MIN_DISTANCE = 1800;

let timer = null,
  timeout = null,
  index = 28,
  DURATION = 10,
  DELAY = 30,
  province = null,
  centers = null,
  china = null,
  projection = null;

let type = 0;

const selectedNames = [
  '宽带资源上图',
  'OLT单/双上联分析',
  '千/百户小区资源预警',
];

let geoData = [];
let selectTypeIndex = 0;

function ChinaMap(props) {
  const chinaMapRef = useRef(null);
  const [showProvince, setShowProvince] = useState(false);
  const [provinceId, setProvinceId] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [target, setTarget] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);

  const color = d3
    .scaleLinear()
    .domain([1, 10])
    .range([
      'rgba(0, 255, 206, 1)',
      'rgba(81, 166, 255, 1)',
      'rgba(0, 47, 255, 1)',
    ]);

  function timeHoldHandler(name) {
    if (timer) {
      timer.stop();
    }

    if (timeout) {
      timeout.stop();
    }

    index = province.findIndex(
      (item) => item.properties.name.indexOf(name) > -1
    );

    timeout = d3.timeout(() => {
      timer = d3.interval(() => {
        index = findProvinceIndex(index, geoData);
        loopHandler(province, index % 31);

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
        return simplifyProvinceName(name);
      });
    showProvinceTips(name);
  }

  function doubleClickHandler(name, id, properties) {
    if (NOT_SHOW_PROVINCE.includes(name)) {
      return;
    }
    setProvinceId(id);
    setProvinceName(name);
    setShowProvince(true);
    props.setProvince(properties);
  }

  function loopHandler(geo, idx) {
    if (geo && geo[idx]) clickHandler(geo[idx].properties.name);
  }

  function clickMenuHandler(type, geo) {
    if (type == 0) {
      //请求
      getResMap().then((res) => {
        updateData(res, geo, type);
      });
    } else if (type == 1) {
      //请求
      getOltAnalysisMap().then((res) => {
        updateData(res, geo, type);
      });
    } else if (type == 2) {
      getResCellResourcesMap().then((res) => {
        updateData(res, geo, type);
      });
    }
  }

  function updateData(d, g, i) {
    d3.selectAll('div.svg-label-info')
      .selectAll('div.name span.value')
      .html('');

    d3.selectAll('div.legend').remove();

    d3.select(chinaMapRef.current)
      .append('div')
      .attr('class', 'legend')
      .attr('data-content-before', '0%')
      .attr('data-content-after', '100%')
      .append('div')
      .attr('class', 'title')
      .html(target ? target : names[0][0]);

    if (d.code == 200) {
      const mapData = d.data.list;

      let geo = JSON.parse(JSON.stringify(g));
      for (const element of geo) {
        for (const child of mapData) {
          if (element.properties.name.indexOf(child.province) > -1) {
            element.info = mapData[j];
            break;
          }
        }
      }
      setProvinceColor(i, geo, target, true);
      createLabel(i, geo, target);

      d3.selectAll('path.edge')
        .data(geo)
        .attr('class', (d) => {
          return d.info ? 'edge' : 'edge disabled';
        });
      geoData = geo;
    }

    index = findProvinceIndex(index, geoData);
    loopHandler(province, index % 31);
    index++;
    timer && timer.stop();
    timer = d3.interval(() => {
      index = findProvinceIndex(index, geoData);
      loopHandler(province, index % 31);
      index++;
    }, DURATION * 1000);
  }

  useEffect(() => {
    return () => {
      selectTypeIndex = 0;
    };
  }, []);

  useEffect(() => {
    let w, h, current;
    if (chinaMapRef && !showProvince) {
      [china, current, w, h] = init(chinaMapRef);

      let linePoints = [];

      //获取中国地图的json文件
      fetchChinaMapWithNameLabel().then((data) => {
        province = data.features;

        projection = d3.geoMercator().center([105, 32]).fitSize([w, h], data);
        const path = d3.geoPath(projection);

        centers = initCenters(province);

        const provinceG = china.append('g').attr('class', 'province');

        initEdge(
          provinceG,
          path,
          data,
          color,
          timeHoldHandler,
          clickHandler,
          doubleClickHandler
        );

        const features = data.features.filter(
          (item) => NOT_SHOW_PROVINCE.indexOf(item.properties.name) < 0
        );
        //绘制文字
        const info = initInfos(
          current,
          features,
          projection,
          clickHandler,
          timeHoldHandler,
          doubleClickHandler,
          linePoints
        );

        initInfoLabels(info, clickHandler, doubleClickHandler);

        const lineGroup = china
          .append('g')
          .attr('class', 'label-lines')
          .selectAll('g.line-group')
          .data(linePoints)
          .enter()
          .append('g')
          .attr('class', 'line-group');

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

        d3.select(current)
          .select('.svg-label-info-group')
          .append('div')
          .attr('class', 'single-info active')
          .attr('name', (d, _) => {
            return '';
          })
          .style('width', (d, _) => {
            return 120 + 'px';
          })
          .style('left', (d, _) => {
            return 100 + 'px';
          })
          .style('top', (d, _) => {
            return 573 + 'px';
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

        const tooltips = initTooltips(current, features, projection);
        tooltips.html('');

        clickMenuHandler(type, data.features);
      });
    }
    return () => {
      if (timer) {
        timer.stop();
      }

      if (timeout) {
        timeout.stop();
      }
      timer = null;
      timeout = null;
      index = 28;
      DURATION = 10;
      DELAY = 30;
      province = null;
    };
  }, [showProvince]);

  useEffect(() => {
    setTarget('');
    if (props.selectedName) {
      type = selectedNames.findIndex((t) => t.includes(props.selectedName));
      setTypeIndex(type);
      if (province) {
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
    console.log(target, selectedNames[typeIndex], props.selectedName);
    if (!target) {
      // 默认选中各标题的第一个选项
      console.log(names[typeIndex][0]);
      setTarget(names[typeIndex][0]);
    }
    if (target) {
      props.setOutTarget('');
      if (province) {
        clickMenuHandler(typeIndex, province);
      }
    }
  }, [target]);

  useEffect(() => {
    if (props.outTarget !== '') {
      setTarget(props.outTarget);
    }
  }, [props.outTarget]);

  return (
    <>
      {typeIndex === 0 && (
        <ButtonGroup
          target={target}
          setValue={setTarget}
          names={names[typeIndex]}
          width={'500px'}
        />
      )}
      {!(showProvince && provinceId) ? (
        <MapWrap
          style={{ display: 'block' }}
          className={`broadband2-map`}
          ref={chinaMapRef}
        ></MapWrap>
      ) : (
        <>
          <Crumbs
            provinceName={provinceName}
            clickFn={() => {
              setShowProvince(false);
              props.setProvince({
                name: '全国',
              });
            }}
          ></Crumbs>
          <ProvinceMap
            provinceName={provinceName}
            adcode={provinceId}
            selectedName={props.selectedName}
            setCity={props.setCity}
            target={target}
            typeIndex={typeIndex}
          ></ProvinceMap>
        </>
      )}
    </>
  );
}

export default ChinaMap;

const Legend = styled.div`
  position: absolute;
  left: 350px;
  bottom: 200px;
`;

const MapWrap = styled.div`
  .svg-tips {
    &.active {
      > div {
        span {
          display: inline-block;
          height: 16px;
          line-height: 16px;
        }
        .value {
          margin-top: 1px;
        }
      }
    }
  }

  .svg-label-info {
    /* pointer-events: auto; */
    .wrapper {
      .name {
        span {
          &.name {
            // pointer-events: all;
          }
        }
      }
    }
  }

  .svg-china-map {
    g {
      &.province {
        path {
          &.edge {
            stroke-width: 1;
            filter: drop-shadow(0 0 20px #000);
            &.active {
              fill: rgba(167, 72, 0, 0.5);
              stroke: #ffe200;
              filter: drop-shadow(0 0 10px #ffe200);
            }
          }
        }
      }
      &.label-lines {
        line {
          stroke: #fdff0060;
        }
        circle {
          stroke: #fff;
          stroke-width: 1;
          fill: #fdff0060;
        }
      }
    }
  }
`;
