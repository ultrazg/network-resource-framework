// 核心网-资源地图组件
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { fetchChinaMapWithNameLabel } from '@alpha/api/data';
import {
    init,
    initEdge,
    initInfos,
    initInfoLabels,
    initTooltips,
} from '../layer/init';

import { createLabel } from '../layer/create';

import {
    showProvinceTips,
    showProvinceEdge,
    showProvinceAreaEdge,
    findProvinceIndex
} from '../layer/function';

import { areaMap } from '../static/config'
import { simplifyProvinceName } from 'apps/alpha/src/utils/commFunc';

const NOT_SHOW_PROVINCE = ['台湾省', '香港特别行政区', '澳门特别行政区'];

const provMap = new Map([
    [ '宁夏自治区', '宁夏回族自治区' ],
    [ '新疆自治区', '新疆维吾尔自治区' ],
    [ '广西自治区', '广西壮族自治区' ]
])
const strArr = ['5GC运营情况', '移网VIMS运营情况', '移动核心网运营情况']
const tabs = ['西南', '东部', '南部', '西北', '北部', '中部', '北京', '上海']

let timer = null,
    timeout = null,
    index = 28,
    DURATION = 10,
    DELAY = 30,
    province = null,
    china = null,
    projection = null;

let geoData = [];

export function CoreChinaMap(props) {
    const { mapData, areaValue } = props
    const chinaMapRef = useRef(null);
    const [isProvince, setIsProvince] = useState([])

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
        let currValue = 0
        if(mapData.mapType === 0) {
            currValue = mapData.data.find(item => item.area === tabs[areaValue])?.deviceNum
        } else {
            currValue = mapData.data.find(item => item.areaStr.indexOf(simplifyProvinceName(name)) > -1)?.deviceNum
        }
        if (NOT_SHOW_PROVINCE.includes(name)) {
            return;
        }
        d3.select('.svg-label-info-group')
            .select('.single-info').style('bottom','186px').style('left','60px')
            .select('.core-wrapper')
            .html(() => {
                return `
                    <span class="name">${mapData.mapType === 0 ? `${tabs[areaValue]}${areaValue < 6 ? '大区' : ''}` : name}</span>
                    <span class="value">${currValue || 0}</span>
                `
            });
        showProvinceTips(name, mapData.mapType, areaValue)
        if(mapData.mapType !== 0) {
            showProvinceEdge(name);
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
        } else {
          d3.selectAll('div.svg-label-info')
            .attr('class', 'active svg-label-info');
            const value = areaMap.findIndex(item => item.find(val => name.includes(val)))
            if(value !== areaValue && value > -1) {
                // 点击地图省份时设置大区的areaValue
                props.setAreaValue(value)
            }
        }
    }

    function doubleClickHandler(name, id, paramId) {
        if (NOT_SHOW_PROVINCE.includes(name)) {
            return;
        }
        props.selectedProvinceHandle(name);
    }

    function loopHandler(geo, index) {
        if (geo && geo[index]) clickHandler(geo[index].properties.name);
    }

    function updateData(data, geoJson) {
        d3.selectAll('div.svg-label-info')
            .selectAll('div.name span.value')
            .html('');
        let geo = JSON.parse(JSON.stringify(geoJson));
        for (let i = 0; i < geo.length; i++) {
            if(mapData.mapType === 0) {
                if(areaMap[areaValue][0].includes(simplifyProvinceName(geo[i].properties.name))) {
                    geo[i].info = {
                        name: strArr[mapData.mapType],
                        ...(data.find(item => item.area === tabs[areaValue]) || {})
                    }
                    break;
                }
            } else {
                for (let j = 0; j < data.length; j++) {
                    const name = provMap.get(data[j].areaStr) || data[j].areaStr
                    if (geo[i].properties.name.indexOf(name) > -1) {
                        geo[i].info = {
                            name: strArr[mapData.mapType],
                            ...data[j]
                        }
                        break;
                    }
                }
            }
        }
        // 渲染标签&浮层数据
        createLabel(geo, mapData.mapType);
        d3.selectAll('path.edge')
            .data(geo)
            .attr('class', (d) => {
                return d.info ? 'edge' : 'edge disabled';
            })
            .attr('fill', 'rgba(0,0,0,0)');
        geoData = geo;

        if(mapData.mapType === 0) {
            showProvinceAreaEdge(areaValue)
            clickHandler(tabs[areaValue])
            if (timer) {
                timer.stop();
            }

            if (timeout) {
                timeout.stop();
            }
            timer = null;
            timeout = null;
            index = 28;
        } else {
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
    }

    const addMapEvent = () => {
        if(!(props.mapData.data?.length)) return
        d3.selectAll('path.edge').on('click', (_, d) => {
            if (d.info || mapData.mapType === 0) {
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

          d3.selectAll('div.svg-label-info').on('click', (_, d) => {
            timeHoldHandler(d.properties.name);
            clickHandler(d.properties.name);
          })
          .on('dblclick', (_, d) => {
            doubleClickHandler(
              d.properties.name,
              `${d.properties.id}0000`,
              d.info?.province
            );
          })
    }

    const removeMapEvent = () => {
        if(!(props.mapData.data?.length)) return
        d3.selectAll('path.edge').on('click', null)
          .on('dblclick', null);

        d3.selectAll('div.svg-label-info').on('click', null)
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
            );

            const features = data.features.filter(
                (item) => NOT_SHOW_PROVINCE.indexOf(item.properties.name) < 0
            );
            province = features;
            setIsProvince(true)
            //绘制文字
            const info = initInfos(
                current,
                features,
                projection,
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
                  return 240 + 'px';
                })
                .style('left', (d, _) => {
                  return 80 + 'px';
                })
                .style('bottom', (d, _) => {
                  return 171 + 'px';
                })
                .style('position', 'absolute')
                .append('div')
                .attr('class', 'core-wrapper')
                .html('');
                const tooltips = initTooltips(current, features, projection, -60, 80);
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
            setIsProvince(false)
        };
    }, []);

    useEffect(() => {
        province && updateData(mapData.data, province)
        mapData.data?.length && addMapEvent()
        return () => {
            removeMapEvent()
        }
    }, [mapData, areaValue, isProvince])

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

export default CoreChinaMap;

const MapWrap = styled.div`
    .core-svg-tips {
        display: none;
        padding: 8px 18px 3px;
        line-height: 18px;
        font-size: 14px;
        color: #fff;
        box-sizing: border-box;

        &.active {
            display: block;
            width: auto;
            height: 233px;
            border: 1px solid rgba(5,102,242,1);
            background: rgba(0,12,50,0.7);
            box-shadow: inset 0 0 40px 0 rgba(0,147,255,0.4);
        }

        .tips-title {
            margin-bottom: 10px;
            color: #00FCFF;
        }
        .item-wrap {
            width: 555px;
            height: calc(100% - 28px);
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;

            .item {
                width: 270px;
                display: flex;
                justify-content: space-between;
                padding-left: 24px;
                margin-bottom: 6px;
                box-sizing: border-box;
                background: url("./assets/tooltips-item.svg") left center no-repeat;
                .key{
                    // .up{
                    //     display:inline-block;
                    //     width:8px;
                    //     height:10px;
                    //     background: url("../../core-network/images/core_up.png") left center no-repeat;
                    // }   
                } 
                .value {
                    color: #00FCFF;
                }
                &:nth-child(n + 8) {
                    // margin-left: 15px;
                }
            }
        }
    }

    .core-wrapper {
        padding-left: 17px;
        line-height: 26px;
        font-size: 14px;
        .name {
            margin-right: 10px;
        }
    }

  .svg-china-map {
    g {
        path {
          &.edge {
            stroke-width: 1;
            stroke: #00f1ff;
            &.active {
              stroke: #BBFFFF;
              stroke-width: 3;
            }
            &.active2 {
              stroke-width: 1;
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
`;