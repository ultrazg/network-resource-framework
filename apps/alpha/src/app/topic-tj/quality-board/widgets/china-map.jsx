import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { fetchChinaMapWithNameLabel } from '@alpha/api/data';
import { useNavigate } from 'react-router-dom';
import {
  init,
  initEdge,
  initInfos,
  initInfoLabels,
  initTooltips,
} from '../layer/init';
import { createLabel } from '../layer/create';
import {
  showProvinceLabel,
  showProvinceTips,
  findProvinceIndex,
} from '../layer/function';
import styled from 'styled-components';
import {resourceQualityProvince } from '../../api/quality-board';
import ProvinceMap from './province-map';
import Crumbs from '../components/crumbs';
import { simplifyProvinceName } from '@alpha/utils/commFunc';
const NOT_SHOW_PROVINCE = ['台湾省', '香港特别行政区', '澳门特别行政区'];
const MIN_DISTANCE = 1800;


let timer = null,
  timeout = null,
  index = 28,
  DURATION = 5,
  DELAY = 30,
  province = null,
  china = null,
  projection = null;

let type = 0;

let geoData = [];

function ChinaMap(props) {
  // console.log(props.tabIndex)
  const navigate = useNavigate();
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
        loopHandler(province, index % 32);

        index++;
      }, DURATION * 1000);
    }, DELAY * 1000);
  }

  function clickHandler(name) {
    let currValue = '';
    if (totalNum) {
      totalNum.forEach((i) => {
        if (i.provinceName && i.provinceName.includes(name)) {
          currValue = i.data[props.tabIndex+'达标率'];
        }
      });
    }
    if (NOT_SHOW_PROVINCE.includes(name)) {
      return;
    }
    showProvinceLabel(name);
    d3.select('.svg-label-info-group')
      .select('.single-info')
      .select('span.name')
      .html(() => {
        return simplifyProvinceName(name) + `<span>${currValue}</span>`;
      });
    showProvinceTips(name);
  }

  function doubleClickHandler(name, id, properties) {
    navigate('/topic/idc');
  }

  function loopHandler(geo, index, d) {
    let currValue = '';
    if (d ) {
      d.forEach((i) => {
        if (i.provinceName && geo && geo[index].properties && i.provinceName.includes(geo[index].properties.name)) {
          currValue = i.data[props.tabIndex+'达标率'];
        }
      });
    }
    if (geo && geo[index]) clickHandler(geo[index].properties.name);
  }

  function clickMenuHandler(type, geo) {
    if (type == 0) {
      //请求
      // getResMap().then((res) => {
      //   updateData(res, geo, type);
      // });
      resourceQualityProvince({ dateType: "day" }).then((res) => {

        updateData(res, geo, type);
      });
    }
  }
  let totalNum = null;
  function updateData(d, g, i) {//important
    if (d.code == 200 && d.data) {
      //处理数据
      const tabIndex = props.tabIndex;
      const data = d.data;
      const keysList = Object.keys(data);
      const arr = keysList.map(key => {
        const info = {};
        data[key].forEach((ele, eleIndex) => {
          if (ele.speciality !== "核心网" && eleIndex !== 0) {
            info[
              `${eleIndex === 0 ? `${name}资源质量` : ""}${
                eleIndex !== 0 ? ele.speciality : ""
              }${eleIndex !== 0 ? "达标率" : ""}`
            ] = `${ele.normalNumRate}%`;
          }
        });
        const provinceName = data[key][0].provinceName
        return {
          key,
          data: info,
          activeIndex: tabIndex,
          code: key,
          provinceName
        };
      });
      const mapData = arr.map(arrItem => !!arrItem && arrItem);
      totalNum = mapData;
      // console.log(mapData)


      d3.selectAll('div.svg-label-info')
        .selectAll('div.name span.value')
        .html('');
    
      // const mapData = d.data;
      let geo = JSON.parse(JSON.stringify(g));
      for (let i = 0; i < geo.length; i++) {
        for (let j = 0; j < mapData.length; j++) {
          if (geo[i].properties.name.indexOf(mapData[j].provinceName) > -1) {
            geo[i].info = mapData[j];
            break;
          }
        }
      }
      if(props.tabIndex != '国际'){
        createLabel(i, geo, target,props.tabIndex);
      }
      
      d3.selectAll('path.edge')
        .data(geo)
        .attr('class', (d) => {
          return d.info ? 'edge' : 'edge disabled';
        });
      geoData = geo;
    }

    index = findProvinceIndex(index, geoData);
    loopHandler(province, index % 32, totalNum);
    index++;
    timer && timer.stop();
    timer = d3.interval(() => {
      index = findProvinceIndex(index, geoData);
      loopHandler(province, index % 32, totalNum);
      index++;
    }, DURATION * 1000);
    // totalNum = d;
  }

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
        //立体效果
        // const provinceG = china.append('g').attr('class', 'province');
        // initEdge(
        //   provinceG,
        //   path,
        //   data,
        //   color,
        //   timeHoldHandler,
        //   clickHandler,
        //   doubleClickHandler
        // );

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

        // d3.select(current)
        //   .select('.svg-label-info-group')
        //   .append('div')
        //   .attr('class', 'single-info active')
        //   .attr('name', (d, _) => {
        //     return '';
        //   })
        //   .style('width', (d, _) => {
        //     return 120 + 'px';
        //   })
        //   .style('left', (d, _) => {
        //     return 100 + 'px';
        //   })
        //   .style('top', (d, _) => {
        //     return 573 + 'px';
        //   })
        //   .style('position', 'absolute')
        //   .append('div')
        //   .attr('class', 'wrapper')
        //   .append('div')
        //   .attr('class', 'name')
        //   .html((d, _) => {
        //     return `
        //           <span class="name"></span>
        //           <span class="value"></span>
        //         `;
        //   });

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
      DURATION = 5;
      DELAY = 30;
      province = null;
    };
  }, [showProvince,props.tabIndex]);
  return (
    <>
      {!(showProvince && provinceId) ? (
        <MapWrap
          style={{ display: 'block' }}
          className={`wireless-netword-map`}
          ref={chinaMapRef}
        ></MapWrap>
      ) : (
        <>
          <Crumbs
            provinceName={provinceName}
            clickFn={() => {
              setShowProvince(false);
              // props.setProvince({
              //   name: '全国',
              // });
            }}
          ></Crumbs>
          {/* <ProvinceMap
            provinceName={provinceName}
            adcode={provinceId}
            selectedName={props.selectedName}
            setCity={props.setCity}
            target={target}
            typeIndex={typeIndex}
          ></ProvinceMap> */}
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
