// 数据网-资源地图组件
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { fetchChinaMapWithNameLabel } from '@alpha/api/data';
import {
    init,
    initEdge,
    initInfos,
    initInfoLabels,
    initTooltips,
    initCylinder,
    initSpots
} from '../layer/init';

import { createLabel, createCylinder, createSpot } from '../layer/create';

import {
    showProvinceLabel,
    showProvinceTips,
    findProvinceIndex,
    showProvinceEdge
} from '../layer/function';
import { simplifyProvinceName } from 'apps/alpha/src/utils/commFunc';

const NOT_SHOW_PROVINCE = ['台湾省', '香港特别行政区', '澳门特别行政区'];

const provMap = new Map([
    [ '宁夏自治区', '宁夏回族自治区' ],
    [ '新疆自治区', '新疆维吾尔自治区' ],
    [ '广西自治区', '广西壮族自治区' ]
])

let timer = null,
    timeout = null,
    index = 28,
    DURATION = 10,
    DELAY = 30,
    province = null,
    china = null,
    projection = null;

let geoData = [];

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
        let currValue = ''
        if(props.resourceData){
            props.resourceData.mapList.forEach(i => {
                if(i.provinceName.includes(simplifyProvinceName(name))){
                currValue = i.usedRate + '%'
                }
            });
        }
        if (NOT_SHOW_PROVINCE.includes(name)) {
            return;
        }
        d3.select('.svg-label-info-group')
            .select('.single-info')
            .select('span.name')
            .html(() => {
                return name + `<span class="curr-class" style="padding-left: 14px;">${currValue}</span>`;
            });
        showProvinceLabel(name);
        showProvinceTips(name);
        showProvinceEdge(name);
    }

    function doubleClickHandler(name, id, paramId) {
        if (NOT_SHOW_PROVINCE.includes(name)) {
            return;
        }
        props.selectedProvinceHandle(name, id, paramId);
    }

    function loopHandler(geo, index) {
        if (geo && geo[index]) clickHandler(geo[index].properties.name);
    }

    function updateData(data, geoJson) {
        d3.selectAll('div.svg-label-info')
            .selectAll('div.name span.value')
            .html('');
        d3.selectAll('div.svg-tips-group')
            .style('display', 'block')
        d3.select('.svg-label-info-group')
            .select('.single-info')
            .style('display', props.mapType === 0 ? 'block' : 'none')
        const mapData = props.mapType === 0 ? (data?.mapList || []) : (data || []);
        let geo = JSON.parse(JSON.stringify(geoJson));
        for (let i = 0; i < geo.length; i++) {
            for (let j = 0; j < mapData.length; j++) {
                const name = provMap.get(mapData[j].provinceName) || mapData[j].provinceName
                if (geo[i].properties.name.indexOf(name) > -1) {
                    geo[i].info = props.mapType === 0 ? mapData[j] : {...mapData[j], province: `${geo[i].properties.id}0000000000`};
                    break;
                } else {
                    geo[i].info = { province: `${geo[i].properties.id}0000000000` ,count: 0, usedRate: 0 }
                }
            }
        }
        // 渲染标签&浮层数据
        createLabel(geo, data?.name, 'province', props.mapType);
        // 渲染圆柱高度
        createCylinder(geo, props.mapType)
        createSpot(geo, props.mapType)
        if(props.mapType === 1) {
            d3.selectAll('div.svg-tips-group')
            .style('display', 'none')
        }
        d3.selectAll('path.edge')
            .data(geo)
            .attr('class', (d) => {
                return d.info ? 'edge' : 'edge disabled';
            });
        geoData = geo;

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

    const addMapEvent = () => {
        if(!props.resourceData) return
        d3.selectAll('path.edge').on('click', (_, d) => {
            if (d.info) {
              timeHoldHandler(d.properties.name);
              clickHandler(d.properties.name);
            }
          })
          .on('dblclick', (_, d) => {
            doubleClickHandler(
              d.properties.name,
              `${d.properties.id}0000`,
              d.info?.province
            );
          });
    }

    const removeMapEvent = () => {
        if(!props.resourceData) return
        d3.selectAll('path.edge').on('click', null)
          .on('dblclick', null);
    }

    useEffect(() => {
        if(!chinaMapRef) return
        let w, h, current;
        [china, current, w, h] = init(chinaMapRef);

        let linePoints = [];

        //获取中国地图的json文件
        fetchChinaMapWithNameLabel().then((data) => {
            projection = d3.geoMercator().center([105, 32]).fitSize([w, h], data);
            const path = d3.geoPath(projection);
            const provinceG = china.append('g').attr('class', '');
            initEdge(
                provinceG,
                path,
                data,
                color,
            );

            const features = data.features.filter(
                (item) => NOT_SHOW_PROVINCE.indexOf(item.properties.name) < 0
            );
            province = features;
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

            // 初始化圆柱svg
            initCylinder(
                current,
                features,
                projection
            )

            initSpots(
                current,
                features,
                projection
            )

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
                    return 118 + 'px';
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
            index = 28;
            DURATION = 10;
            DELAY = 30;
            province = null;
        };
    }, []);

    useEffect(() => {
        if(province) {
            const data = props.mapType === 0 ? props.resourceData : props.efficiencyData
            updateData(data, province);
        }
        props.resourceData && addMapEvent()
        return () => {
            removeMapEvent()
        }
    }, [props.resourceData, props.efficiencyData])

    useEffect(() => {
        if(province) {
            if(props.mapType === 0) {
                updateData(props.resourceData, province);
            } else {
                updateData(props.efficiencyData, province);
            }
        }
    }, [props.mapType])

    return (
        <>
            <MapWrap
                style={{ display: 'block' }}
                className={`wireless-netword-map`}
                ref={chinaMapRef}
            ></MapWrap>
        </>
    );
}

export default ResourcesMap;

const MapWrap = styled.div`
  .svg-tips {
    &.active {
      > div {
        &.port-item {
            background: transparent !important;
            padding-left: 0;
        }
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
              fill: rgba(255, 124, 0, 0.34);
              stroke: #D7C448;
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

  .svg-cylinder {
    .cylinder {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 12px;
        background-image: linear-gradient(180deg, #00FFFE 0%, rgba(0,255,254,0.00) 100%);
        &::before {
            content: ' ';
            position: absolute;
            top: -2px;
            width: 100%;
            height: 4px;
            background: #11C5D6;
            border-radius: 6px / 2px;
        }
    }
  }
  .svg-spot {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(245,245,14,0.30);
    border: rgba(245,245,14,0.30);
    border-radius: 50%;
    &.disabled {
        display: none;
    }
    .spot {
        width: 6px;
        height: 6px;
        background: #F5F50E;
        border-radius: 50%;
    }
  }
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
`;