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
  findProvinceIndex
} from '../layer/function';
import styled from 'styled-components';
import { getResourcesAll } from '../../api/wirelessNetwork';
import Crumbs from '../components/crumbs';
const NOT_SHOW_PROVINCE = ['台湾省', '香港特别行政区', '澳门特别行政区'];

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
        loopHandler(province, index % 31);

        index++;
      }, DURATION * 1000);
    }, DELAY * 1000);
    
  }

  function clickHandler(name) {
    // console.log(totalNum)
    // console.log(name)
    let currValue = ''
    if(totalNum){
      totalNum.data.wirelessResourcesDtos.forEach(i => {
        if(i.provinceName.includes(name)){
          currValue = i.stationSum
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
        // return name
         return name + `<span class="curr-class">${currValue}</span>`;
        // return simplifyProvinceName(name) + `<span>${currValue}</span>`;
      });
    showProvinceTips(name);
  }

  function doubleClickHandler(name, id, properties) {
    // navigate("/topic/idc");
    props.selectedProvinceHandle(name);
  }

  function loopHandler(geo, index, d) {
    let currValue = ''
    if(d && d.data && d.data.wirelessResourcesDtos){
      d.data.wirelessResourcesDtos.forEach(i => {
        if(i.provinceName.includes(geo[index].properties.name)){
          currValue = i.stationSum
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
      getResourcesAll().then((res) => {
        // console.log(res)
        updateData(res, geo, type);
      });
    }
  }

let totalNum = null;
  function updateData(d, g, i) {
    d3.selectAll('div.svg-label-info')
      .selectAll('div.name span.value')
      .html('');
    if (d.code == 200) {
      const mapData = d.data.wirelessResourcesDtos;
      let geo = JSON.parse(JSON.stringify(g));
      for (let i = 0; i < geo.length; i++) {
        for (let j = 0; j < mapData.length; j++) {
          if (geo[i].properties.name.indexOf(mapData[j].provinceName) > -1 || mapData[j].provinceName == "新疆自治区") {
            geo[i].info = mapData[j];
            break;
          }
        }
      }
      createLabel(i, geo, target);
      d3.selectAll('path.edge')
        .data(geo)
        .attr('class', (d) => {
          return d.info ? 'edge' : 'edge disabled';
        });
      geoData = geo;
    }

    index = findProvinceIndex(index, geoData);
    loopHandler(province, index % 31, d);
    index++;
    timer && timer.stop();
    timer = d3.interval(() => {
      index = findProvinceIndex(index, geoData);
      loopHandler(province, index % 31, d);
      index++;
    }, DURATION * 1000);
    totalNum = d
  }


  useEffect(() => {
    let w, h, current;
    if (chinaMapRef && !showProvince) {
      [china, current, w, h] = init(chinaMapRef);

      let linePoints = [];

      //获取中国地图的json文件
      fetchChinaMapWithNameLabel().then((data) => {
        const mapDatas = data.features
        const arrList = [{name:'新疆自治区'},{name:'内蒙古自治区'},{name:'上海'},{name:'北京'},{name:'天津'},{name:'天津'},{name:'广西自治区'},{name:'宁夏自治区'},{name:'重庆'},{name:'山西省'}]
        const mapDatasNew = mapDatas.map((firstIndex)=>{
          arrList.forEach((item)=>{
            if(firstIndex.properties.name.includes(item.name.substring(0,2))){
              firstIndex.properties.name = item.name
            }
          })
          return {...firstIndex }
        })
       // console.log(mapDatasNew)
        province = data.features;
        projection = d3.geoMercator().center([105, 32]).fitSize([w, h], data);
        const path = d3.geoPath(projection);
        const provinceG = china.append('g').attr('class', '');
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
            return 251 + 'px';
          })
          .style('left', (d, _) => {
            return 100 + 'px';
          })
          .style('bottom', (d, _) => {
            return 150 + 'px';
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
      DURATION = 5;
      DELAY = 30;
      province = null;
    };
  }, [showProvince]);
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
              props.setProvince({
                name: '全国',
              });
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
