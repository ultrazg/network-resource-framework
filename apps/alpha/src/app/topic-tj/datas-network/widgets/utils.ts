interface NodeParame {
    width?: number;
    height?: number;
    labelShow?: boolean;
  }
// 画圆
// name:节点名称 dot:圆心 r:半径 compression:压缩比例 data:数据集合
// nodeParame： { width: 节点宽度 height: 节点高度 }
import topoNormal from '../images/topoNormal.png';

export const drawCircle = (name: string, dot: any, r: any, compression: number, data: any, nodeParame?: NodeParame ) => {
    let arrNumber = data.length;
    let dataLength = Math.ceil(arrNumber / 10)
    let dataInterval = (dataLength < 2 ? 20 : (10 * dataLength))
    let iconWidth = (nodeParame?.width || 65) - (Math.ceil(arrNumber - 5) / 5) * 10;
    let iconHeight = (nodeParame?.height || 86) - (Math.ceil(arrNumber - 5) / 5) * 10;
    let controlInterval = dataInterval - (2 * (dataLength - 1))
    let symbolSize: any = iconWidth > 0 ? [iconWidth, iconHeight] : [16, 30]
    let dataValue: any[] = [{
      name: `${name} -1`,
      x: dot[0],
      y: dot[1],
      symbol: "image://" + topoNormal,
      symbolSize: 0,
      data: -1,
      fixed: true,
    }];
    const piNumber = arrNumber < 10 ? (10 * arrNumber) : arrNumber
    for(let i = 0; i < data.length; i ++) {
      let rad = (i * controlInterval) * Math.PI / piNumber;
      let cur = [r * Math.cos(rad) + dot[0], compression * (r * Math.sin(rad)) + dot[1]]
      dataValue.push({
        name: `${data[i].eqpId || (name + i)}`,
        label: {
          show: nodeParame?.labelShow !== undefined ? nodeParame?.labelShow : true,
          position: 'insideTop',
          formatter: function (params: any) {
            return `{label|${params.data?.data?.eqpTypeName}}`
          },
          rich: {
            label: {
              fontFamily: 'FZZDHJW',
              fontWeight: 0,
              fontSize: '18px',
              color: '#FFFFFF',
              textShadow: '0 2px 6px rgba(0,0,0,0.54)'
            }
          },
        },
        x: cur[0],
        y: cur[1],
        symbol: "image://" + topoNormal,
        symbolSize: symbolSize,
        isDefImg: 'topoNormal',
        data: data[i],
        fixed: true,
      })
    }
    return dataValue
  }