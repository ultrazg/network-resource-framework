import networkCss from './network-topology.module.scss';
import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';

import networkDef from '../assets/images/network-def.png';
import networkSelf from '../assets/images/network-self.png';
import networkOn from '../assets/images/network-on.png';
import tooltipBg from '../assets/images/tooltip-bg.png';
import devIcon from '../assets/images/dev-icon.png';
import { getNetworkTopologyVo } from '@alpha/app/topic-tj/api/datasNetwork'
import { useViewport } from '@alpha/app/context/viewport-context';
import { Spin } from 'antd';

/* eslint-disable-next-line */
export interface NetworkTopologyProps {
  eqpId: string;
  belongNetworkId: string;
  eqpName: string;
}

export function NetworkTopology(props: NetworkTopologyProps) {
  const networkBody = useRef<HTMLDivElement>(null);
  const [networkTopTitle, setNetworkTopTitle] = useState('');
  const canvasWidth = 750; // 默认宽度
  const allCanvasHeight = 526; // 默认高度
  const [canvasHeight, setCanvasHeight] = useState(allCanvasHeight);
  const [canvasMarginTop, setCanvasMarginTop] = useState(0);
  const [widthWidth] = useViewport();
  const zoomVal = widthWidth / 1920;
  const [loading, setLoading] = useState<boolean>(true);

  // 转译网络类型
  const translateBelongNetwork = (belongNetworkId: string) => {
    let label = '';
    switch (belongNetworkId) {
      case '79653024': label = 'CHINA169'
        break;
      case '79653045': label = '城域网'
        break;
      case '79653044': label = 'UTN'
        break;
      case '79653066': label = '智能城域网'
        break;
      default: label = '--'
    }
    setNetworkTopTitle(label)
  }

  const renderDom = (res: any) => {
    return (
      `
      <div className="chartTooltip"
        style='
          background: url(${tooltipBg});
          background-size: 100% 100%;
          // width: 252px;
          // height: 172px;
          // color: #fff;
          // position: absolute;
          // padding: 10px;
          // top: -6px;
          // left: -6px;
        '>
        <div class="dotTooltip" style="padding: 10px;">
          <div style="display: flex;
            justify-content: space-between;
            width: 232px;
            word-break: break-all;
            white-space: normal;">
            <div style="
              font-family: 'FZZDHJW', sans-serif;
              font-weight: 0;
              font-size: 12px;
              color: #00FCFF;
              letter-spacing: 0;
            "> ${res.data.eqpName || ''}</div>
            <div style="
              font-family: PingFangSC-Regular, sans-serif;
              font-weight: 400;
              font-size: 12px;
              color: #D5913A;
              letter-spacing: 0;
              line-height: 20px;
              width: 36px;
            ">  ${res.data && res.data.status || '在用'} </div>
          </div>
          <div class="textTooltip"><img src=${devIcon} alt='' />
            <span style="color: rgba(2, 186, 255, 1);
              font-size: 12px;
              font-face: PingFangSC;
              font-weight: 400;
              line-height: 0;
              letter-spacing: 0;
              paragraph-spacing: 0;
              text-align: left;">
              所属区域:
            </span>
            ${res.data && res.data.region || ''}
          </div>
          <div class="textTooltip" style=" word-wrap: break-word;  width: 232px; word-break: break-all;  white-space: normal; ">
            <img src=${devIcon} alt='' />
            <span style="color: rgba(2, 186, 255, 1);
              font-size: 12px;
              font-face: PingFangSC;
              font-weight: 400;
              line-height: 0;
              letter-spacing: 0;
              paragraph-spacing: 0;
              text-align: left;">
              机房名称:
            </span>
            ${res.data && res.data.chinaName || ''}
          </div>
          <div class="textTooltip"><img src=${devIcon} alt='' />
            <span style="color: rgba(2, 186, 255, 1);
              font-size: 12px;
              font-face: PingFangSC;
              font-weight: 400;
              line-height: 0;
              letter-spacing: 0;
              paragraph-spacing: 0;
              text-align: left;">
              设备IP:
            </span>
            ${res.data && res.data.ipAddress || ''}
          </div>
          <div class="textTooltip"><img src=${devIcon} alt='' />
            <span style="color: rgba(2, 186, 255, 1);
              font-size: 12px;
              font-face: PingFangSC;
              font-weight: 400;
              line-height: 0;
              letter-spacing: 0;
              paragraph-spacing: 0;
              text-align: left;">
              设备类型:
            </span>
            ${res.data && res.data.deviceType || ''}
          </div>
          <div class="textTooltip"><img src=${devIcon} alt='' />
            <span style="color: rgba(2, 186, 255, 1);
              font-size: 12px;
              font-face: PingFangSC;
              font-weight: 400;
              line-height: 0;
              letter-spacing: 0;
              paragraph-spacing: 0;
              text-align: left;">
              厂家:
            </span>
            ${res.data && res.data.mfrName || ''}
          </div>
          <div class="textTooltip"><img src=${devIcon} alt='' />
            <span style="color: rgba(2, 186, 255, 1);
              font-size: 12px;
              font-face: PingFangSC;
              font-weight: 400;
              line-height: 0;
              letter-spacing: 0;
              paragraph-spacing: 0;
              text-align: left;">
              设备型号:
            </span>
            ${res.data && res.data.eqpModel || ''}
          </div>
        </div>
      </div>
    `
    )
  }

  const drawChart = (pointData: any, lineData: any, zoom: number) => {
    const currentRef = (networkBody && networkBody.current) as any;
    const nodeChart = echarts.init(currentRef);
    let option: any = {
      title: {
        text: "",
      },
      tooltip: {
        show: true,
        confine: true,
        extraCssText: 'padding: 0px; background-color: inherit;color: #fff;border: none;width: 252px;',
        formatter: function (params: any) {
          if (params.dataType == "node") { // 是节点的时候，才显示浮窗
            let res: any = {}; //变量一个res
            res = { ...params.data }; //res等于params下的数据
            return renderDom(res);
          } else { // 连接线的时候，不需要显示
            return '';
          }
        },
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
          zoom: zoom, // 当前视角的缩放比例。
          roam: false,// 是否开启鼠标缩放和平移漫游。
          label: {
            show: true,
            color:'#ffffff'
          },
          edgeSymbol: ["none", "none"],
          edgeLabel: {
            fontSize: 20,
          },
          nodes: [
            ...pointData,
          ],
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
      let nodes = option.series[0].nodes
      let paramsData = params.data
      nodes.map((pointItem: any) => {
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
      nodes.map((pointItem: any) => {
        if (paramsData.name == pointItem.name) {
          pointItem.symbol = "image://" + (pointItem.isDefImg == 'networkSelf' ? networkSelf : networkDef)
        }
      })
      nodeChart.setOption(option, true);
    });

  };

  const sysHX = (data: any) => {
    let hexinArr: any[] = [], huijuArr: any[] = [], jieruArr: any[] = [];
    // 判断自己在哪一个层
    if (data.sysLevelName === "核心层") { // 第一层
      let selfObj = {
        name: data.eqpId,
        label: {
          position: ['30%', '40%'],
          formatter: function (params: any) {
            return params.data.data.deviceType + '\n\n\n\n' + props.eqpName
          }
        },
        x: canvasWidth / 2,
        y: 0,
        symbol: "image://" + networkSelf,
        isDefImg: 'networkSelf',
        data,
        fixed: true,
      };
      hexinArr.push(selfObj)
    }

    if (data.sysLevelName === "汇聚层") { // 第二层
      let selfObj = {
        name: data.eqpId,
        label: {
          position: ['30%', '40%'],
          formatter: function (params: any) {
            return params.data.data.deviceType + '\n\n\n\n' + props.eqpName
          }
        },
        x: canvasWidth / 2,
        y: 200,
        symbol: "image://" + networkSelf,
        isDefImg: 'networkSelf',
        data,
        fixed: true,
      };
      huijuArr.push(selfObj)
    }

    if (data.sysLevelName === "接入层") { // 第三层
      let selfObj = {
        name: data.eqpId,
        label: {
          position: ['30%', '40%'],
          formatter: function (params: any) {
            return params.data.data.deviceType + '\n\n\n\n' + props.eqpName
          }
        },
        x: canvasWidth / 2,
        y: 526,
        symbol: "image://" + networkSelf,
        isDefImg: 'networkSelf',
        data,
        fixed: true,
      };
      jieruArr.push(selfObj)
    }
    return {
      hexinArr,
      huijuArr,
      jieruArr
    }
  }

  const layeredArr = (data: any) => {
    // 把每层的数据拿出来，放到对应层的数组里面 （分层）
    let oneArr: any[] = [], twoArr: any[] = [], three: any[] = []
    if (data.hasOwnProperty('parentList')) {
      let parentList = data.parentList
      parentList.forEach((parent: any, index: number) => {
        if (parent.sysLevelName == '核心层') {
          oneArr.push(parent)
        } else if (parent.sysLevelName == '汇聚层') {
          twoArr.push(parent)
        } else if (parent.sysLevelName == '接入层') {
          three.push(parent)
        }
      });
    }
    if (data.hasOwnProperty('subsList')) {
      let subsList = data.subsList
      subsList.forEach((parent: any, index: number) => {
        if (parent.sysLevelName == '核心层') {
          oneArr.push(parent)
        } else if (parent.sysLevelName == '汇聚层') {
          twoArr.push(parent)
        } else if (parent.sysLevelName == '接入层') {
          three.push(parent)
        }
      });
    }
    if (data.hasOwnProperty('broList')) {
      let broList = data.broList
      broList.forEach((parent: any, index: number) => {
        if (parent.sysLevelName == '核心层') {
          oneArr.push(parent)
        } else if (parent.sysLevelName == '汇聚层') {
          twoArr.push(parent)
        } else if (parent.sysLevelName == '接入层') {
          three.push(parent)
        }
      });
    }
    return {
      oneArr,
      twoArr,
      three
    }
  }
  const handleCanvasHeight = ({ hexinArr, huijuArr, jieruArr }: any) => {
    // 算出一层的高度
    let eachLayer = allCanvasHeight / 3;
    if (hexinArr.length > 0 && huijuArr.length > 0 && jieruArr.length > 0) { // 三层都有数据
      setCanvasHeight(eachLayer * 3)
    } else if ((hexinArr.length > 0 && huijuArr.length > 0) || (huijuArr.length > 0 && jieruArr.length > 0)) { // 其中两层有数据
      setCanvasHeight(eachLayer * 2 - 50) // 多减掉了50，因为太下去了，把高度变小了一点
      if (hexinArr.length > 0 && huijuArr.length > 0) { // 前两层有数据
        // setCanvasMarginTop(0)
        hexinArr.forEach((hexin: any) => {
          hexin.y = eachLayer; // 直接拿一层的高度（显示在最下面）
          if(hexinArr.length>1 && hexin.isDefImg === 'networkSelf') { // 如果同层包含了最外层的自己，那么就把自己变成第0位的坐标
            hexin.x = 0;
          }
        })
        huijuArr.forEach((huiju: any) => {
          huiju.y = eachLayer * 2 - 50; // 第二层的高度（显示在最下面）
          if(huijuArr.length>1 && huiju.isDefImg === 'networkSelf') { // 如果同层包含了最外层的自己，那么就把自己变成第0位的坐标
            huiju.x = 0;
          }
        })
      } else { // 后两层有数据
        setCanvasMarginTop(eachLayer)
        huijuArr.forEach((huiju: any) => {
          huiju.y = eachLayer; // 直接拿一层的高度（显示在最下面）
          if(hexinArr.length>1 && huiju.isDefImg === 'networkSelf') { // 如果同层包含了最外层的自己，那么就把自己变成第0位的坐标
            huiju.x = 0;
          }
        })
        jieruArr.forEach((jieru: any) => {
          jieru.y = eachLayer * 2 - 50; // 第二层的高度（显示在最下面）
          if(jieruArr.length>1 && jieru.isDefImg === 'networkSelf') { // 如果同层包含了最外层的自己，那么就把自己变成第0位的坐标
            jieru.x = 0;
          }
        })
      }
    } else { // 只有一层有数据
      setCanvasHeight(eachLayer * 1 + 80)
      if (hexinArr.length > 0) { // 第一层有数据
        // setCanvasMarginTop(0)
        hexinArr.forEach((hexin: any) => {
          if(hexin.isDefImg !== 'networkSelf') hexin.y = eachLayer; // 直接拿一层的高度（显示在最下面）
        })
      } else if (huijuArr.length > 0) { // 第二层有数据
        setCanvasMarginTop(eachLayer)
        huijuArr.forEach((huiju: any) => {
          if(huiju.isDefImg !== 'networkSelf') huiju.y = eachLayer; // 直接拿一层的高度（显示在最下面）
        })
      } else { // 第三层有数据
        setCanvasMarginTop(eachLayer * 2)
        jieruArr.forEach((jieru: any) => {
          if(jieru.isDefImg !== 'networkSelf') jieru.y = eachLayer; // 直接拿一层的高度（显示在最下面）
        })
      }
    }

    return {
      hexinArr,
      huijuArr,
      jieruArr
    }
  }
  const networkTopologyVo = (eqpId: string) => {
    getNetworkTopologyVo({ eqpId: eqpId }).then((res: any) => {
      const { data, code } = res;
      let pointData: any[] = [], lineData: any[] = [];

      const { hexinArr, huijuArr, jieruArr } = sysHX(data)

      const { oneArr, twoArr, three } = layeredArr(data)
      oneArr.forEach((parent: any, index: number) => {// 如果有核心层 (第一层)
        let oneArrLength = oneArr.length, isSelfNum = 0, unitPosition = 1;
        if (index === 0) { // 如果进来了，说明第一层是有数据的
          // 先判断自己当前设备在不在选中的数据里面
          if (hexinArr.length > 0) { // 在里面
            isSelfNum = 1; // 如果自己选中的设备也在里面，那么就把长度加一个，后面计算位置的时候用到
          }
          oneArrLength = oneArrLength + isSelfNum;
        }
        unitPosition = canvasWidth / oneArrLength; // 画布的宽度 / 数组的长度，算出每一个多长
        if (isSelfNum > 0 && oneArrLength > 1) { // 如果最外层包含自己并且还有相同的层级，那么第一个就显示自己的坐标在最左边为0
          hexinArr[0].x = unitPosition * 0
        } else if (isSelfNum > 0) { // 如果包含自己，那么第一个就显示自己
          hexinArr[0].x = unitPosition * 1
        }

        let selfObj = {
          name: parent.eqpId,
          label: {
            position: ['30%', '40%'],
            formatter: function (params: any) {
              return params.data.data.deviceType + '\n\n\n\n' + params.data.data.eqpName
            }
          },
          x: unitPosition * (index + isSelfNum), // 每个位置的长度*（第几个 + 一个是否包含自己的值）
          y: 0,
          symbol: "image://" + networkDef,
          isDefImg: 'networkDef',
          data: parent,
          fixed: true,
        };
        hexinArr.push(selfObj)
      });

      twoArr.forEach((parent: any, index: number) => {// 如果有汇聚层 (第二层)
        let twoArrLength = twoArr.length, isSelfNum = 0, unitPosition = 1;
        if (index === 0) { // 如果进来了，说明第一层是有数据的
          // 先判断自己当前设备在不在选中的数据里面
          if (huijuArr.length > 0) { // 在里面
            isSelfNum = 1; // 如果自己选中的设备也在里面，那么就把长度加一个，后面计算位置的时候用到
          }
          twoArrLength = twoArrLength + isSelfNum;
        }
        unitPosition = canvasWidth / twoArrLength; // 画布的宽度 / 数组的长度，算出每一个多长
        if (isSelfNum > 0 && twoArrLength > 1) { // 如果最外层包含自己并且还有相同的层级，那么第一个就显示自己的坐标在最左边为0
          huijuArr[0].x = unitPosition * 0
        } else if (isSelfNum > 0) { // 如果包含自己，那么第一个就显示自己
          huijuArr[0].x = unitPosition * 1
        }
        let selfObj = {
          name: parent.eqpId,
          label: {
            position: ['30%', '40%'],
            formatter: function (params: any) {
              return params.data.data.deviceType + '\n\n\n\n' + params.data.data.eqpName
            }
          },
          x: unitPosition * (index + isSelfNum), // 每个位置的长度*（第几个 + 一个是否包含自己的值）
          y: 200,
          symbol: "image://" + networkDef,
          isDefImg: 'networkDef',
          data: parent,
          fixed: true,
        };
        huijuArr.push(selfObj)
      });

      three.forEach((parent: any, index: number) => {// 如果有接入层 (第三层)
        let threeArrLength = three.length, isSelfNum = 0, unitPosition = 1;
        if (index === 0) { // 如果进来了，说明第一层是有数据的
          // 先判断自己当前设备在不在选中的数据里面
          if (jieruArr.length > 0) { // 在里面
            isSelfNum = 1; // 如果自己选中的设备也在里面，那么就把长度加一个，后面计算位置的时候用到
          }
          threeArrLength = threeArrLength + isSelfNum;
        }
        unitPosition = canvasWidth / threeArrLength; // 画布的宽度 / 数组的长度，算出每一个多长
        if (isSelfNum > 0 && threeArrLength > 1) { // 如果最外层包含自己并且还有相同的层级，那么第一个就显示自己的坐标在最左边为0
          jieruArr[0].x = unitPosition * 0
        } else if (isSelfNum > 0) { // 如果包含自己，那么第一个就显示自己
          jieruArr[0].x = unitPosition * 1
        }
        let selfObj = {
          name: parent.eqpId,
          label: {
            position: ['30%', '40%'],
            formatter: function (params: any) {
              console.log('接入层',params);
              return params.data.data.deviceType
            }
          },
          x: unitPosition * (index + isSelfNum), // 每个位置的长度*（第几个 + 一个是否包含自己的值）
          y: 526,
          symbol: "image://" + networkDef,
          isDefImg: 'networkDef',
          data: parent,
          fixed: true,
        };
        jieruArr.push(selfObj)
      });
      let threeLayerData =  handleCanvasHeight({ hexinArr, huijuArr, jieruArr })
      pointData = [...threeLayerData.hexinArr, ...threeLayerData.huijuArr, ...threeLayerData.jieruArr]

      let oneLine: any = []; // 第一层跟第二层的连接线
      hexinArr.forEach((hexin: any, index:number) => { // 核心层的点，要跟汇聚层的连接起来
        if(hexinArr.length>1 && index<hexinArr.length-1) { // 同层相连
          oneLine.push({
            source: hexinArr[index].name,
            target: hexinArr[index+1].name,
          })
        }
        huijuArr.forEach((huiju: any) => { // 汇聚层的点
          oneLine.push({
            source: hexin.name,
            target: huiju.name,
          })
        })
      })

      let twoLine: any = []; // 第二层跟第三层的连接线
      huijuArr.forEach((huiju: any, index:number) => { // 核心层的点，要跟汇聚层的连接起来
        if(huijuArr.length>1 && index<huijuArr.length-1) { // 同层相连
          twoLine.push({
            source: huijuArr[index].name,
            target: huijuArr[index+1].name,
          })
        }
        jieruArr.forEach((jieru: any) => { // 汇聚层的点，要跟接入层连接起来
          twoLine.push({
            source: huiju.name,
            target: jieru.name,
            select: { disabled: false }
          })
        })
      })

      let threeLine: any = []; // 第三层的连接线
      jieruArr.forEach((jieru: any, index:number) => { // 接入层的点。平层相连
        if(jieruArr.length>1 && index<jieruArr.length-1) { // 同层相连
          threeLine.push({
            source: jieruArr[index].name,
            target: jieruArr[index+1].name,
          })
        }
      })
      lineData = [...oneLine, ...twoLine, ...threeLine]
      let zoom = 1
      if(hexinArr.length>4 || huijuArr.length>4 || jieruArr.length>4) {
        zoom = 0.7
        if(hexinArr.length>6 || huijuArr.length>6 || jieruArr.length>6) {
          zoom = 0.66
        }
      }
      drawChart(pointData, lineData, zoom)

      setLoading(false);
    })
  }
  useEffect(() => {
    networkTopologyVo(props.eqpId)
  }, [props.eqpId]);

  useEffect(() => {
    translateBelongNetwork(props.belongNetworkId)
  }, [props.belongNetworkId]);


  return (
    <div className={networkCss['container']}>
      <Spin spinning={loading} tip='正在加载'>
        <div className={networkCss['metropolitan-area-network']}>
          <div className={networkCss['network-top-title']}> {networkTopTitle} </div>
          <div className={networkCss['network-body']} ref={networkBody} style={{ height: canvasHeight, marginTop: canvasMarginTop, zoom: 1 / zoomVal }}></div>
          <div className={`${networkCss['hexinceng']} ${networkCss['three-dom']}`} style={{ zoom: 1 / zoomVal }}>核心层</div>
          <div className={`${networkCss['huijuceng']} ${networkCss['three-dom']}`} style={{ zoom: 1 / zoomVal }}>汇聚层</div>
          <div className={`${networkCss['jieruceng']} ${networkCss['three-dom']}`} style={{ zoom: 1 / zoomVal }}>接入层</div>
        </div>
      </Spin>
    </div>
  );
}

export default NetworkTopology;
