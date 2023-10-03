import styled from 'styled-components';
import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';

import networkDef from '../dev-list-dialog/assets/images/network-def.png';
import topoNormal from '../images/topoNormal.png';
import topoHeader from '../images/topoHeader.png';
import topoTitleBg from '../images/topoTitleBg.png';
import networkOn from '../dev-list-dialog/assets/images/network-on.png';
import oneLayer from '../dev-list-dialog/assets/images/one.png';
import twoLayer from '../dev-list-dialog/assets/images/two.png';
import threeLayer from '../dev-list-dialog/assets/images/three.png';
import { cityBackboneRoute } from '@alpha/app/topic-tj/api/datasNetwork'
import { useViewport } from '@alpha/app/context/viewport-context';
import { Spin } from 'antd';
import { drawCircle } from './utils';

/* eslint-disable-next-line */
export interface NetworkIPRANTopologyProps {
  eqpId: string;
  belongNetworkId: string;
  eqpName: string;
}

export function NetworkIPRANTopology(props: NetworkIPRANTopologyProps) {
  const networkBody = useRef<HTMLDivElement>(null);
  const canvasWidth = 750; // 默认宽度
  const canvasHeight = 750; // 默认高度
  const [widthWidth] = useViewport();
  const zoomVal = widthWidth / 1920;
  const [loading, setLoading] = useState<boolean>(false);

  const drawChart = (pointData: any, lineData: any, zoom: number) => {
    const currentRef = (networkBody && networkBody.current) as any;
    const nodeChart = echarts.init(currentRef);
    let option: any = {
      title: {
        text: "",
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: "quinticInOut",
      animation: false,
      series: [
        {
          type: "graph",
          layout: "none",
          symbolSize: 50,
          bottom: 80,
          top: '10%',
          // zoom: zoom, // 当前视角的缩放比例。
          roam: true,// 是否开启鼠标缩放和平移漫游。
          label: {
            show: true
          },
          edgeSymbol: ["none", "none"],
          edgeLabel: {
            fontSize: 20,
          },
          data: pointData,
          links: lineData,
          lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0,
            color: "#18ABFF",
          },
        },
      ],
    };
    nodeChart.setOption(option, true);

    // 鼠标移入事件
    nodeChart.on('mouseover', function (params: any) {
      console.log('params', params)
      let nodes = option.series[0].nodes
      let paramsData = params.data
      nodes && nodes.map((pointItem: any) => {
        if (paramsData.name == pointItem.name) {
          pointItem.symbol = "image://" + networkOn
        }
      })
      nodeChart.setOption(option, true);
    });

    //鼠标离开
    nodeChart.on('mouseout', function (params: any) {
      let nodes = option.series[0].nodes
      let paramsData = params.data
      nodes && nodes.map((pointItem: any) => {
        if (paramsData.name == pointItem.name) {
          pointItem.symbol = "image://" + (pointItem.isDefImg == 'topoNormal' ? topoNormal : networkDef)
        }
      })
      nodeChart.setOption(option, true);
    });

  };

  const initData = (coreEqpList: any[], distributionEqpList: any[], accessEqpList: any[], lineData: any[]) => {
    // [canvas最左侧值, canvas最右侧值]
    let xArray: any = [-245, 250];
    const layerHeight = (600 / 5)
    var minN = xArray[0];
    var maxN = xArray[1];
    // 拓扑最顶上网络标签
    let pointData: any = [{
      name: `Node`,
      label: {
        width: 128,
        height: 30,
        lineHeight: 30,
        align: 'center',
        position: ['50%', '50%'],
        backgroundColor: {
          image: topoTitleBg
        },
        rich: {
          labelMark: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'FZZDHJW',
            fontWeight: 0,
            fontSize: '16px',
            color: '#FFFFFF',
          }
        },
        formatter: '{labelMark|169骨干网}',
      },
      
      x: minN + (maxN - minN) / 2,
      y: -100,
      symbol: "image://" + topoHeader,
      symbolSize: [110, 63],
      isDefImg: 'topoHeader',
      data: {},
      fixed: true,
    }];
    let pointData1: any = [];
    let pointData2: any = [];
    let pointData3: any = [];
    let pointData4: any = [];
    // 100为计算某层最多值
    let x = (canvasWidth / 100);
    pointData1 = drawCircle('node1', [x, layerHeight * 0], 200, 0.15, new Array(0).fill(0), { width: 54, height: 68 })
    pointData2 = drawCircle('node2', [x, layerHeight * 0.7], 300, 0.15, coreEqpList)
    pointData3 = drawCircle('node3', [x, layerHeight * 2.7], 430, 0.18, distributionEqpList)
    pointData4 = drawCircle('node4', [x, layerHeight * 5], 560, 0.25, accessEqpList)
    drawChart([ ...pointData, ...pointData1, ...pointData2, ...pointData3, ...pointData4], lineData, 1)
  }

  const handleGetData = () => {
    const parames = {
      "provinceCode":"370000000000",          // 省份编码
      "eqpTypeId": "24000008",                // 网络拓扑编码: 24000008: 城域网(CR); 87770272: 智能城域网(MCR); 87770251: IPRAN(RSG); 
      "cityId":"350002000000000042767118"     // 地市编码
    }
    cityBackboneRoute(parames).then((res: any) => {
      if (res && res.code === '200' && res.data) {
        const { coreEqpList, distributionEqpList, accessEqpList, routeList } = res.data;
        const lineData = routeList.map((item: any) => {
          return {
            source: item.eqpIdA,
            target: item.eqpIdZ,
          }
        })
        // const coreEqpList = res.data.coreEqpList.map(item => )
        initData(coreEqpList, distributionEqpList, accessEqpList, lineData)
      }
    })
  }

  useEffect(() => {
    handleGetData()
  }, [])


  return (
    <Container>
      <Spin spinning={loading} tip='正在加载'>
        <div className={'metropolitan-area-network'}>
          <div className={'network-body'} ref={networkBody} style={{ height: canvasHeight, marginTop: 0, zoom: 1 / zoomVal}}></div>
          <div className={`${'hexinceng'} ${'three-dom'}`} style={{ zoom: 1 / zoomVal }}>核心层</div>
          <div className={`${'huijuceng'} ${'three-dom'}`} style={{ zoom: 1 / zoomVal }}>汇聚层</div>
          <div className={`${'jieruceng'} ${'three-dom'}`} style={{ zoom: 1 / zoomVal }}>接入层</div>
        </div>
      </Spin>
    </Container>
  );
}

export default NetworkIPRANTopology;

const Container = styled.div`
  width: 750px;
  height: 650px;
  .metropolitan-area-network {
    position: relative;
    .network-body {
        height: 600px;
        width: 750px;
        margin: auto;
        z-index: 10;
    }
    .three-dom {
        height: 22px;
        font-family: 'FZZDHJW', sans-serif;
        font-weight: 0;
        font-size: 18px;
        color: #00C5F5;
        position: absolute;
        text-align: center;
        width: 750px;
        margin: auto;
        z-index: 9;
    }
    .hexinceng{
        top: 80px;
        height: calc(600px/3);
        line-height: calc(600px/3);
        background: url(${oneLayer});
        background-position: center 80%;
        background-size: 388px 98px;
        background-repeat: no-repeat;
    }
    .huijuceng{
        top: calc(30px + 600px/3);
        height: calc(600px/3);
        line-height: calc(600px/3);
        background: url(${twoLayer});
        background-position: center 80%;
        background-size: 673px 165px;
        background-repeat: no-repeat;
    }
    .jieruceng{
        top: calc(600px/3 *2);
        height: calc(600px/3);
        line-height: calc(600px/3);
        background: url(${threeLayer});
        background-position: center 80%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

  }
`