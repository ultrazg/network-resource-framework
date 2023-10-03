import { useViewport } from '@alpha/app/context/viewport-context';
import { Spin } from 'antd';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as _ from 'lodash';
import MACss from './metropolitan-area-network.module.scss';
import * as echarts from 'echarts';
import { drawCircle } from '../utils';
import { fetchStatesCodeList } from '@alpha/app/topic-tj/api/apiJson';
import { replaceProvince } from '@alpha/app/topic-tj/utils/commFunc';
import networkDef from '../../dev-list-dialog/assets/images/network-def.png';
import topoNormal from '../../images/topoNormal.png';
import topoHeader from '../../images/topoHeader.png';
import topoTitleBg from '../../images/topoTitleBg.png';
import topoNormalOn from '../../images/topoNormal-on.png';
import TopologicTab from '../topologic-tab'
import { cityBackboneRoute } from '@alpha/app/topic-tj/api/datasNetwork'

/* eslint-disable-next-line */
export interface MetropolitanAreaNetworkProps {
  gotoGisMap:  (provinceName: string, eqpName: string) => void;
  eqpTypeId: string;
  provinceCode: string;
  cityId: string;
  provinceName: string;
  citiesName: string;
  changeTab: (index: number)=> void;
  toggleCompHandle: any;
}
// 根据省份获取对应地市列表
const provinceCityList: { [propsName: string]: any } = {};
export function MetropolitanAreaNetwork(props: MetropolitanAreaNetworkProps) {
  const networkBody = useRef<HTMLDivElement>(null);
  const [widthWidth] = useViewport();
  const zoomVal = widthWidth / 1920;
  const canvasWidth = 750; // 默认宽度
  const allCanvasHeight = 750; // 默认高度
  // const [canvasHeight, setCanvasHeight] = useState(allCanvasHeight);
  // const [canvasMarginTop, setCanvasMarginTop] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [eqpTypeId, setEqpTypeId] = useState(props.eqpTypeId);    // 网络拓扑编码: 24000008: 城域网(CR); 87770272: 智能城域网(MCR); 87770251: IPRAN(RSG); 
  const [citiesItems, setCitiesItems] = useState<any[]>([])
  const [citiesItem, setCitiesItem] = useState<any>({
    name: props.citiesName.substring(props.citiesName.indexOf("省") + 1, props.citiesName.length),
    id: props.cityId
  })
  let nodeChart: any;
  const getLastValue = (value:any)=>{
    const  str = value.lastIndexOf("\/")
    return value.substring( str+1, value.length )
 }
  const drawChart = (pointData: any, lineData: any, zoom: number) => {
    const currentRef = (networkBody && networkBody.current) as any;
    if(!nodeChart) {
      nodeChart = echarts.init(currentRef);
    }
    let option: any = {
      title: {
        text: "",
      },
      tooltip: {
        formatter: (params:any) => {
          return params.data?.data?.eqpName || null
        }
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: "quinticInOut",
      animation: false,
      series: [
        {
          type: "graph",
          layout: "force",
          symbolSize: 50,
          bottom: 40,
          top: '10%',
          // zoom: zoom, // 当前视角的缩放比例。
          roam: false,// 是否开启鼠标缩放和平移漫游。
          // label: {
          //   show: true
          // },
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
          force: {
            repulsion: 100
          }
        },
      ],
    };
    nodeChart.setOption(option, true);
    nodeChart.off('click')
    nodeChart.off('mouseover')
    nodeChart.off('mouseout')
    // 鼠标移入事件
    nodeChart.on('mouseover', function (params: any) {
      let nodes = option.series[0].data
      let paramsData = params.data
      nodes && nodes.map((pointItem: any) => {
        if (pointItem.isDefImg !== 'topoHeader' && paramsData.name == pointItem.name) {
          pointItem.symbol = "image://" + topoNormalOn
        }
      })
      nodeChart.setOption(option, true);
    });

    //鼠标离开
    nodeChart.on('mouseout', function (params: any) {
      let nodes = option.series[0].data
      let paramsData = params.data
      nodes && nodes.map((pointItem: any) => {
        if (pointItem.isDefImg !== 'topoHeader' && paramsData.name == pointItem.name) {
          pointItem.symbol = "image://" + (pointItem.isDefImg == 'topoNormal' ? topoNormal : networkDef)
        }
      })
      nodeChart.setOption(option, true);
    });
    nodeChart.on('click', function (params: any) {
      props.gotoGisMap(props.citiesName, params.data.data.eqpName);
    });

  };
  let layerHeight = (allCanvasHeight / 6)

  const initData = (coreEqpList: any[], distributionEqpList: any[],swEqpList: any[], accessEqpList: any[], lineData: any[]) => {
    layerHeight = (allCanvasHeight / 7)
    let pointData1: any = [];
    let pointData2: any = [];
    let pointData3: any = [];
    let pointData4: any = [];
    let pointData5: any = [];
    let pointData6: any = [];
      // 拓扑最顶上网络标签
    let pointData: any = [{
      name: `start`,
      label: {
        show: true,
        width: 128,
        height: 30,
        lineHeight: 30,
        align: 'center',
        position: ['50%', 65],
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
      x: 750 / 2,
      y: -100,
      symbol: "image://" + topoHeader,
      symbolSize: [110, 63],
      isDefImg: 'topoHeader',
      data: {},
      fixed: true,
    }, {
      name: `start1`,
      label: {
        show: true,
        width: 128,
        height: 30,
        lineHeight: 30,
        align: 'center',
        position: ['50%', 65],
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
      x: 0,
      y: -100,
      symbol: "none",
      symbolSize: [110, 63],
      isDefImg: 'topoHeader',
      data: {},
      fixed: true,
    }, {
      name: `start2`,
      label: {
        show: true,
        width: 128,
        height: 30,
        lineHeight: 30,
        align: 'center',
        position: ['50%', 65],
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
      x: 750,
      y: -100,
      symbol: "none",
      symbolSize: [110, 63],
      isDefImg: 'topoHeader',
      data: {},
      fixed: true,
    }];
    // let lineData: any = [];
    let x = 750 / 2;
    pointData1 = drawCircle('node1', [x, layerHeight * 0], 200, 0.15, new Array(0).fill(0), { width: 54, height: 68 }) // 最上面 169骨干网
    pointData2 = drawCircle('coreEqpList', [x, layerHeight * 1], 200, 0.2, coreEqpList) // 核心层
    pointData3 = drawCircle('distributionEqpList', [x, layerHeight * 3], 350, 0.2, distributionEqpList) // 汇聚层
    pointData4 = drawCircle('swEqpList', [x, layerHeight * 5], 300, 0.2, swEqpList, { width: 54, height: 68 }) // 接入层 （SW1）
    pointData5 = drawCircle('accessEqpList', [x, layerHeight * 6], 420, 0.25, accessEqpList, { labelShow: false }) // 接入层 （SW2）
    pointData6 = drawCircle('node6', [x, layerHeight * 7], 400, 0.25, new Array(0).fill(0), { labelShow: false }) // 最后一层
    drawChart([ ...pointData, ...pointData1, ...pointData2, ...pointData3, ...pointData4, ...pointData5, ...pointData6], lineData, 1)
  }

  const initIPRANData = (coreEqpList: any[], distributionEqpList: any[], accessEqpList: any[], lineData: any[]) => {
    layerHeight = (allCanvasHeight / 6)
    let pointData1: any = [];
    let pointData2: any = [];
    let pointData3: any = [];
    let pointData4: any = [];
    let pointData5: any = [];
    // 拓扑最顶上网络标签
    let pointData: any = [{
      name: `ipranStart`,
      label: {
        show: true,
        width: 128,
        height: 30,
        lineHeight: 30,
        align: 'center',
        position: ['50%', 65],
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
      x: 750 / 2,
      y: -100,
      symbol: "image://" + topoHeader,
      symbolSize: [110, 63],
      isDefImg: 'topoHeader',
      data: {},
      fixed: true,
    }, {
      name: `ipranStart1`,
      label: {
        show: true,
        width: 128,
        height: 30,
        lineHeight: 30,
        align: 'center',
        position: ['50%', 65],
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
      x: 0,
      y: -100,
      symbol: "none",
      symbolSize: [110, 63],
      isDefImg: 'topoHeader',
      data: {},
      fixed: true,
    }, {
      name: `ipranStart2`,
      label: {
        show: true,
        width: 128,
        height: 30,
        lineHeight: 30,
        align: 'center',
        position: ['50%', 65],
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
      x: 750,
      y: -100,
      symbol: "none",
      symbolSize: [110, 63],
      isDefImg: 'topoHeader',
      data: {},
      fixed: true,
    }];
    // 100为计算某层最多值
    const dataArray = [coreEqpList.length, distributionEqpList.length, accessEqpList.length]
    let x = 750 / 2;
    pointData1 = drawCircle('ipranNode1', [x, layerHeight * 0], 200, 0.15, new Array(0).fill(0), { width: 54, height: 68 })
    pointData2 = drawCircle('coreEqpList', [x, layerHeight * 0.7], 200, 0.2, coreEqpList)
    pointData3 = drawCircle('distributionEqpList', [x, layerHeight * 2.7], 350, 0.2, distributionEqpList)
    pointData4 = drawCircle('accessEqpList', [x, layerHeight * 5], 420, 0.25, accessEqpList, { labelShow: false })
    pointData5 = drawCircle('ipranNode5', [x, layerHeight * 6], 400, 0.25, new Array(0).fill(0), { labelShow: false })
    drawChart([ ...pointData, ...pointData1, ...pointData2, ...pointData3, ...pointData4, ...pointData5], lineData, 1)
  }

  const handleGetData = _.debounce((parames) => {
    setLoading(true)
    cityBackboneRoute(parames).then((res: any) => {
      if (res && res.code === '200' && res.data) {
        let { coreEqpList, distributionEqpList, accessEqpList, routeList,swEqpList } = res.data;
        let lineData = routeList.map((item: any) => {
          return {
            source: item.eqpIdA,
            target: item.eqpIdZ,
          }
        })
        coreEqpList.forEach((element: any) => {
          lineData.push({
            source: 'start',
            target: element.eqpId,
          })
        });
        if(eqpTypeId === '24000008') { // 城域网(CR)
          if(!swEqpList) swEqpList = []
          initData(coreEqpList, distributionEqpList, swEqpList, accessEqpList, lineData)
        }else if(eqpTypeId === '87770272' || eqpTypeId === '87770251'){ // 智能城域网(MCR) || IPRAN(RSG)
          initIPRANData(coreEqpList || [], distributionEqpList || [], accessEqpList || [], lineData)
        }
      }
      setLoading(false)
    })
  }, 500)
  const debouceRequest = useCallback((data) => handleGetData(data), []);
  useEffect(() => {
    handleGetCities()
  }, [props.cityId])

  useEffect(() => {
    const parames = {
      "provinceCode": props.provinceCode,          // 省份编码
      "eqpTypeId": eqpTypeId,                // 网络拓扑编码: 24000008: 城域网(CR); 87770272: 智能城域网(MCR); 87770251: IPRAN(RSG); 
      "cityId": citiesItem.id     // 地市编码
    }
    debouceRequest(parames)
  }, [citiesItem, eqpTypeId])
  //选择类型切换
  const setEqpTypeIdHandle = (eqpTypeId: string) => {
    setEqpTypeId(eqpTypeId);
  }

  const handleSelectCities = (citisItem: any) => {
    console.log('citisItem', citisItem)
    setCitiesItem(citisItem)
  }

  const handleGetCities = () => {
    if( provinceCityList[props.provinceCode] ){
      return setCitiesItems(provinceCityList[props.provinceCode])
    }
    fetchStatesCodeList().then((res: any) => {
      let ref: any[] = [];
      const provinceIndex = res.findIndex((resData: any) => resData.value === `${props.provinceCode}`)
      if(provinceIndex !== -1 && res[provinceIndex]['children']) {
          res[provinceIndex]['children'].forEach((childItem: any) => {
              ref.push({ name: replaceProvince(childItem.text), id: childItem.value})
          })
          provinceCityList[props.provinceCode] = ref;
          setCitiesItems(ref)
      }
    })
  }
  return (
    <div className={MACss['container']}>
      <TopologicTab provinceName={props.provinceName}  changeTab={props.changeTab} setEqpTypeIdHandle={setEqpTypeIdHandle} toggleCompHandle={props.toggleCompHandle} style={{zIndex:100}} citiesName={`${replaceProvince(citiesItem.name)}市`} handleSelectCities={handleSelectCities} citiesItems={citiesItems}></TopologicTab>
      <Spin spinning={loading} tip='正在加载'>
        <div
          className={MACss['metropolitan-area-network']}
          style={{
            zoom: 1 / (zoomVal),
            transform: "scale("+(zoomVal)+")", 
            transformOrigin: "0% 0%", 
            width: (1/(zoomVal)) * 100 + "%" ,
            zIndex:10
          }}
        >
          <div
            className={MACss['network-body']}
            ref={networkBody}
            style={{
              width: canvasWidth,
              height: allCanvasHeight,
              marginTop: 0,
            }}
            >
          </div>
          <div className={`${MACss['hexinceng']} ${MACss['three-dom']}`} style={{ width: ( zoomVal) * 100 + "%" }}>核心层</div>
          <div className={`${MACss['huijuceng']} ${MACss['three-dom']}`} style={{ width: (zoomVal) * 100 + "%" }}>汇聚层</div>
          <div className={`${MACss['jieruceng']} ${MACss['three-dom']}`} style={{ width: (zoomVal) * 100 + "%" }}>接入层</div>
        </div>
      </Spin>
    </div>
  );
}

export default MetropolitanAreaNetwork;
