// 数据网-资源地图组件
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { fetchChinaMapWithNameLabel } from '@alpha/api/data';
import { getGuganNetworkTopologyByProvince } from '../../api/datasNetwork';
import {
  init,
  initEdge,
  initInfos,
  initInfoLabels,
  initDots,
} from '../layer/initMap';

import {
  showProvinceEdge
} from '../layer/function';
import { simplifyProvinceName } from 'apps/alpha/src/utils/commFunc';
import BgMark from '../images/bg-mark.png';
const NOT_SHOW_PROVINCE = ['台湾省', '香港特别行政区', '澳门特别行政区'];

let china = null,
  projection = null,
  allLineCitys = [],
  citys = {},
  province = [];
  
export function ResourcesMap(props) {
  const chinaMapRef = useRef(null);
  const color = d3
    .scaleLinear()
    .domain([1, 10])
    .range([
      'rgba(0, 255, 206, 1)',
      'rgba(81, 166, 255, 1)',
      'rgba(0, 47, 255, 1)',
    ]);

  function timeHoldHandler(name) {
  }

  function clickHandler(name) {
    if (NOT_SHOW_PROVINCE.includes(name)) {
      return;
    }
    d3.selectAll('div.svg-label-info')
    .attr('class', (d) => {
      if(d.properties.name == name){
        return 'active svg-label-info acticeClass';
      }
      else{
        return 'active svg-label-info'
      }
    })
    .style('z-index', (d) => {
      if(d.properties.name == name){
        return 9;
      }
      else{
        return 2;
      }
    });
    let className = citys[simplifyProvinceName(name)].code;
    d3.select('.map-label-lines')
    .selectAll('line')
    .attr('class', (d,_)=>{
      return d.class
    });

    d3.select('.map-label-lines')
    .selectAll('.' + className)
    .attr('class',className+ ' active');
    showProvinceEdge(name);
  }

  function doubleClickHandler(name,id) {
    if (NOT_SHOW_PROVINCE.includes(name)) {
      return;
    }
    props.selectedProvinceHandle(name, id + '0000000000');
    props.changeTab(1);
  }

  const addMapEvent = () => {
    d3.selectAll('path.edge')
      .on('click', (_, d) => {
        clickHandler(d.properties.name);
      })
      .on('dblclick', (_, d) => {
        let id = d.properties.id;
        doubleClickHandler(d.properties.name,id);
      });
  };

  const removeMapEvent = () => {
    d3.selectAll('path.edge').on('click', null).on('dblclick', null);
  };

  useEffect(() => {
    props.changeTab(0);
    let w, h, current;
    [china, current, w, h] = init(chinaMapRef);
    let linePoints = [];
    
    //获取中国地图的json文件
    fetchChinaMapWithNameLabel().then((data) => {
      projection = d3.geoMercator().center([105, 32]).fitSize([w, h], data);
      const path = d3.geoPath(projection);
      const provinceG = china.append('g').attr('class', '');
      initEdge(provinceG, path, data, color);

      const features = data.features.filter(
        (item) => (item.properties.name && NOT_SHOW_PROVINCE.indexOf(item.properties.name) < 0)
      );
      province = features;
      props.setProvince(province);
      //获取关联城市
      getGuganNetworkTopologyByProvince().then((res) => {
        allLineCitys = [];
        let dealCitys = [];
        let i = 0;
        for (const key in res.data) {
          citys[key] = {};
          i++;
          features.map((item) => {
            if(key == simplifyProvinceName(item.properties.name)){
              citys[key] = {
                code: 'code' + i,
                geo: item.properties.cp
              }
            }
          })
        }
        features.map((item) => {
          item.simpleName = simplifyProvinceName(item.properties.name);
          dealCitys.push(item.simpleName);
          item.lineCitys = res.data[item.simpleName];
          item.isCore = item.lineCitys[0].acorenode == 'CORE' ? true : false;
          item.code = citys[item.simpleName].code;
          item.lineCitys.map((list) => {
            let flag = true;
            if(dealCitys.length>0){
              dealCitys.map((name) => {
                if(name == list.zprovince){
                  flag = false;
                }
              })
            }
            if(!flag && (list.zprovince !== list.aprovince)){
              allLineCitys.push({
                from: projection(item.properties.cp),
                to: projection(citys[list.zprovince].geo),
                class: citys[list.aprovince].code + ' ' + citys[list.zprovince].code,
                name: list.aprovince + '-' + list.zprovince
              })
            }
          })
        });
        
        const lineGroup = china
          .append('g')
          .attr('class', 'map-label-lines')
          .selectAll('g.line-group')
          .data(allLineCitys)
          .enter()
          .append('g')
          .attr('class', 'line-group');

        lineGroup
          .append('line')
          .attr('class', (d, _) => {
            return d.class
          })
          .style('pointer-events', 'none')
          .attr('x1', (d, _) => {
              return d.from[0] + 10;
          })
          .attr('y1', (d, _) => {
              return d.from[1];
          })
          .attr('x2', (d, _) => {
              return d.to[0] + 10;
          })
          .attr('y2', (d, _) => {
              return d.to[1];
          });
          initDots(current, features, projection,clickHandler);
      });
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
      const labelLineGroup = china
      .append('g')
      .attr('class', 'label-lines')
      .selectAll('g.line-group')
      .data(linePoints)
      .enter()
      .append('g')
      .attr('class', 'line-group');

      labelLineGroup
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

      labelLineGroup
      .append('circle')
      .attr('class', 'start')
      .attr('cx', (d, _) => {
          return d[0][0];
      })
      .attr('cy', (d, _) => {
          return d[0][1];
      })
      .attr('r', 2);

      labelLineGroup
      .append('circle')
      .attr('class', 'end')
      .attr('cx', (d, _) => {
          return d[1][0];
      })
      .attr('cy', (d, _) => {
          return d[1][1];
      })
      .attr('r', 2);
      addMapEvent();
    });
    return () => {
      removeMapEvent();
    };
  }, []);

  return (
    <>
      <MapBox>
        <div className="mark-box">169骨干网</div>
        <ul className="mark-list">
          <li>
            <i className="icon1"></i>
            <span>核心节点</span>
          </li>
          <li>
          <i className="icon2"></i>
            <span>非核心节点</span>
          </li>
        </ul>
        <MapWrap
          style={{ display: 'block' }}
          className={`wireless-netword-map`}
          ref={chinaMapRef}
        ></MapWrap>
      </MapBox>
    </>
  );
}

export default ResourcesMap;
const MapBox = styled.div`
  margin: 20px 0 0 400px;
  width: 802px;
  height: 784px;
  position: relative;
  .mark-box{
    position: absolute;
    width: 103px;
    height: 46px;
    background: url(${BgMark}) no-repeat center;
    background-size: 100%;
    text-align: center;
    color: #00FCFF;
    line-height: 46px;
    left: -70px;
    top: -30px;
  }
  .mark-list{
    position: absolute;
    left: 300px;
    top: 70px;
    display: flex;
    li{
      display: flex;
      align-items: center;
      margin: 0 14px 0 0;
      height: 34px;
      background: rgba(11, 26, 74, 0.64);
      box-shadow: inset 0 0 12px 4px rgba(0,181,255,0.1);
      border-radius: 2px;
      font-size: 12px;
      color: #FFFFFF;
      padding: 0 10px;
      i{
        width: 6px;
        height: 6px;
        display: block;
        margin: 0 8px 0 0;
        &.icon1{
          background: rgba(245,245,14,0.76);
        }
        &.icon2{
          background: rgba(14,228,245,0.76);
        }
      }
    }
  }
`
const MapWrap = styled.div`
  .svg-china-map {
    padding: 3px 7px 2px 5px;
    >g {
      position: relative;
        path {
          &.edge {
            &.active {
              fill: rgba(255,124,0,0.34);
              stroke-width: 1;
              stroke: #D7C448;
            }
          }
        }
      }
  }
  .label-lines {
    margin: 0;
    pointer-events: none;
    line {
      stroke: #fdff0060;
    }
    circle {
      stroke: #fff;
      stroke-width: 1;
      fill: #fdff0060;
    }
  }
  .map-label-lines{
    pointer-events: none !important;
    line{
      stroke-width: 0.5;
      stroke: rgba(255,255,244,0.4);
      &.active{
        stroke-width: 2;
        stroke: rgba(255, 159, 63, 1);
      }
    }
  }
  .svg-label-info-group{

  }
  .svg-dot-group {
    .svg-dot {
      position: relative;
      background: rgba(14, 228, 245, 0.3);
      border: 0.5px solid rgba(14, 228, 245, 0.46);
      border-radius: 50%;
      &:before {
        content: '';
        position: absolute;
        left: 4px;
        top: 4px;
        width: 7px;
        height: 7px;
        background: #0ee4f5;
        border-radius: 50%;
      }
      &.core{
        background: rgba(245,245,14,0.30);
        border: 0.5px solid rgba(245,245,14,0.46);
        &:before {
          background: #F5F50E;
        }
      }
    }
  }
`;
