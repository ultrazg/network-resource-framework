import { getEqpList, queryBaseStationLoopInfo, queryBaseStationLoopListByRoomID2, queryRRUByBBUEqpId } from '@alpha/app/topic-tj/api/wireless';
import { MapFnObject } from '@alpha/app/topic-tj/components/map-view/map-view';
import { MapObject } from '@alpha/app/topic-tj/components/map-view/mapUtil/mapObject';
import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import LoopingList from '../../base-station-looping/looping-list/looping-list';
import wirelessDevCss from './wireless-device.module.scss';


interface TabItem {
  label: string,
  value: string,
}

interface TabObj {
  activeIndex: string,
  tab: TabItem,
  handleTab: (tab: any) => void
}

const TabItem = (props: TabObj) => {
  return (
    <div className={wirelessDevCss['tab-item'] + ' ' + `${props.activeIndex === props.tab.value ? wirelessDevCss['active'] : ''}`} key={props.tab.value} onClick={() => props.handleTab(props.tab)}>
      <span> {props.tab.label} </span>
    </div>
  )
}

interface ListItemProps {
  item: {
    eqpId: string;
    eqpName?: string;
    netGeneration: string;
    wgs84X?: string;
    wgs84Y?: string;

    deviceId?: string;
    name?: string;
    longitude?: string;
    latitude?: string;

    roomID: string;
    roomName: string;
    netWorks: string;
    roomLoopFlag: number;
    address: string;
  },
  newText: string;
  roomID: string;
  index: number;
  selectEqpId: string;
  showhighLight: (item: any) => void
}

const ListItem = (props: ListItemProps) => {
  const item = props.item
  return (
    <div className={wirelessDevCss['item-container'] + ' ' + `${props.selectEqpId === (item.eqpId || item.deviceId) ? wirelessDevCss['bgcStyle'] : ''}`}
      key={item.eqpId}
      onClick={() => props.showhighLight(item)}>
      <div>
        <div className={wirelessDevCss['item-left']}></div>
        <div className={wirelessDevCss['item-left-text']} style={{ marginLeft: '1px', color: ' #ffffff' }}>
          {props.newText}
        </div>
      </div>
      <div className={wirelessDevCss['item-right']}>
        <div className={wirelessDevCss['item-topBox']}>
          <span className={wirelessDevCss['topBox-name']} title={item.eqpName || item.name}>{item.eqpName || item.name}</span>
          <span className={wirelessDevCss['topBox-level']}>{item.netGeneration}</span>
        </div>
        <div className={wirelessDevCss['item-middle']}>
          <div className={wirelessDevCss['middletext']}>经度：<span className={wirelessDevCss['lng']}>{(item.wgs84X || item.longitude) ? (item.wgs84X || item.longitude) : '暂无信息'}</span></div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className={wirelessDevCss['middletext']}>纬度：<span className={wirelessDevCss['lat']}>{(item.wgs84Y || item.latitude) ? (item.wgs84Y || item.latitude)  : '暂无信息'}</span></div>
        </div>
        <div className={wirelessDevCss['item-address']}>
          <span className={wirelessDevCss['addresstext']}>地址：</span>
          <span title={item.address ? item.address : ''}>{item.address ? item.address : '暂无信息'}</span>
        </div>
      </div>
    </div>
  )
}

/* eslint-disable-next-line */
export interface WirelessDeviceProps {
  roomId: string;
  defaultValue: {
    selectEqpId: string;
    roomDevType: string;
  };
  mapObj: MapObject | null;
  mapFnObject: MapFnObject;
  left: string;
  setLengendType: (devType: string) => void;
}

export function WirelessDevice(props: WirelessDeviceProps) {
  const [isShow, SetIsShow] = useState(true)
  const [isShowClear, SetIsShowClear] = useState(false)
  const [mapFnObject] = useState(props.mapFnObject)
  const [equitList, setEquitList] = useState([]); // 列表数据
  const [loading, setLoading] = useState<boolean>(true);
  const [selectEqpId, setSelectEqpId] = useState(''); // 选中的下标ID
  const roomDevTypeList = [
    { label: 'BBU', value: 'BBU' },
    { label: 'RRU', value: 'RRU' },
    { label: '基站', value: 'GM' },
  ] // 设备的网络类型
  const [network, setNetWork] = useState(roomDevTypeList[0].value); // 设备的网络类型选中的值
  const [newText, setNewText] = useState(roomDevTypeList[0].label); // 设备的网络类型选中的值
  const reduxMapResource = useSelector((state: any) => state.reduxMapResource);
  const [details, SetDetails] = useState(0)
  const [changeLoopList, SetChangeLoopList] = useState(0)

  const handleTab = (selectTabObj: any) => {
    setNetWork(selectTabObj.value)
    setNewText(selectTabObj.label)
    setSelectEqpId('') // 清除选中列表状态
    clearBaseStation() // 清除环画的点、线、浮窗
  }

  const showhighLight = (deviceObj: any) => {
    setSelectEqpId(deviceObj.eqpId || deviceObj.deviceId) // 选中效果
    if(network === 'BBU') {
      getQueryRRUByBBUEqpId(deviceObj.eqpId, deviceObj)
    }else if(network === 'RRU'){
      rruPoint(deviceObj)
    }else{// 基站
      getQueryBaseStationLoopInfo(deviceObj.deviceId, deviceObj.eqpId, deviceObj)
    }
  }

  // RRU直接打点
  const rruPoint = (item: any)=>{
    if (props.mapObj && item) {
      props.mapObj.clear('xuanzhongRRU');
      let points: any[] = [];
      // 创建打点
      points.push(setPoint({ x: item.wgs84X, y: item.wgs84Y,iconName: 'RRU-on', attr: item }));
      props.mapObj.setPoints(points, 'xuanzhongRRU')
      props.mapObj?.setViewport(points); // 定位到视图
      mapFnObject?.showTitles(points.map((e) => { return { point: [e.x, e.y], title: e.attr.eqpName, datas: e.attr, /*dom: <div> 自定义内容 </div>*/ } }), () => {
        console.log('被点击了')
      });
      
      props.setLengendType('RRU') // 设置RRU的图例
    }
  }

  // 获取列表数据
  const getBaseEqpList = (roomID: string, network: string) => {
    if (network === 'GM') {
      getQueryBaseStationLoopListByRoomID(roomID)
    } else {
      getEqpList(roomID, network).then((res) => {
        setLoading(false)
        setEquitList(res.data)
        simulateClick(res.data) // 模拟默认点击一次（选中效果）
      });
    }
  };

  // 获取BBU的环
  const getQueryRRUByBBUEqpId = (eqpId: string, selectDeviceObj: any) => {
    clearBaseStation() // 清除环画的点、线、浮窗
    queryRRUByBBUEqpId(eqpId).then((res: any) => {
      if (res.code != '200') {
        return // console.log('数据获取失败！');
      }
      console.timeEnd('设置设备完成');
      bbuDrawRing(res.data, selectDeviceObj)
      console.timeEnd('绘制路线完成');
    })
  }

  // BBU画环
  const bbuDrawRing = (BBUData:any, selectDeviceObj: any) =>{
    // 显示基站成环的线
    if (BBUData && BBUData.length > 0) {
      SetIsShowClear(true)// 显示清除按钮
      props.setLengendType('BBU') // 设置BBU的图例
      const mapObj = props.mapObj;
      let it;
      const pointshe: Array<any> = [];
      const labelPointsArr: Array<any> = [];
      const datas = [];
      const linedata = [];
      // 绘制点
      datas.push(handleSetPoint({ ...selectDeviceObj, keyName: selectDeviceObj.eqpId, iconName: 'BBU' }))
      selectDeviceObj.x = selectDeviceObj.wgs84X
      selectDeviceObj.y = selectDeviceObj.wgs84Y

      for (var i = 0; i < BBUData.length; i++) {
        it = BBUData[i];
        it.x = it.wgs84X
        it.y = it.wgs84Y
        // 绘制线
        linedata.push(handleSetLine(selectDeviceObj.wgs84X, selectDeviceObj.wgs84Y, it.wgs84X, it.wgs84Y, '#8F6EFF', 'solid'));
        // 绘制点
        datas.push(handleSetPoint({ ...it, keyName: it.eqpId, iconName: 'RRU' }))
      }
      mapObj?.setLines(linedata, 'jizhanchenghuanLine');
      datas.forEach((e) => { return pointshe.push(e.points[0]) });
      mapObj?.setPoints(pointshe, 'jizhanchenghuanPoint'); // 环打点
      datas.forEach((e) => { return labelPointsArr.push(e.labelPoints[0]) });
      mapFnObject?.showTitles(labelPointsArr.map((e) => { return { point: [e.x, e.y], title: e.text, datas: e.attr, /*dom: <div> 自定义内容 </div>*/ } }), () => {
        console.log('被点击了')
      });
      mapObj?.setViewport(labelPointsArr); // 定位到环视图
    }
  }

  // 获取基站的环
  const getQueryBaseStationLoopInfo = (roomId: string, eqpId: string, selectDeviceObj: any) => {
    clearBaseStation() // 清除环画的点、线、浮窗
    queryBaseStationLoopInfo({
      bbuNum: 0,
      cityCode: '',
      deviceType: 2,
      isLoop: 0,
      name: '',
      networkType: 0,
      provinceName: reduxMapResource.mapSelect.provinceName,
      deviceId: roomId,
      mfrEqpId: eqpId,
      dataType: 2,
      provinceCode: reduxMapResource.mapSelect.areaCode,
      type: 1, // 1.环类型, 2.链类型;
    }).then((res: any) => {
      if (res.code != '200') {
        return // console.log('数据获取失败！');
      }
      SetDetails(res.data) // 值给到下一个列表
      getBaseStationLoopInfo(res.data, selectDeviceObj)
      SetIsShowClear(true) // 显示清除拓扑的按钮
    })
  }

  const getBaseStationLoopInfo = (allDataObj: any, selectDeviceObj: any) => {
    drawRing(allDataObj, selectDeviceObj);
  }

  // 遍历环的数据
  const drawRing = (loopData: any, selectDeviceObj: any) => {
    const datas = [];
    let it;
    // 显示基站成环的线
    if (loopData.baseStationLoopLineVo && loopData.baseStationLoopLineVo.length > 0) {
      const linedata = [];
      for (var i = 0; i < loopData.baseStationLoopLineVo.length; i++) {
        it = loopData.baseStationLoopLineVo[i];
        // 绘制线
        linedata.push(handleSetLine(it.startX, it.startY, it.endX, it.endY, it.deviceSideType == 'MAR' ? '#8856D9' : '#E9AE0B', 'solid'));
      }

      props.mapObj?.setLines(linedata, 'jizhanchenghuanLine');
    }

    // 显示基站成环圈上的设备点
    for (var i = 0; i < loopData.deviceList.length; i++) {
      it = loopData.deviceList[i];
      it.jifangType = 'idc'
      // 绘制点
      datas.push(handleSetPoint({ ...it, keyName: it.deviceId, iconName: 'BNMR' })) // 承载机房
    }

    // 显示外部基站
    for (var i = 0; i < loopData.relationStaionList.length; i++) {
      it = loopData.relationStaionList[i];
      it.jifangType = 'relationStaionList'
      // 绘制点
      datas.push(handleSetPoint({ ...it, keyName: it.deviceId, iconName: 'huijujifang' }));
      // 绘制线
    }

    if (loopData.selfDeviceInfo) {
      // 绘制当前选中的点链接线
      it = loopData.selfDeviceInfo;
      it.jifangType = 'selfDeviceInfo'
      // 绘制点
      datas.push(handleSetPoint({ ...it, keyName: it.deviceId, iconName: 'huijujifang-on' }))
      // 绘制线之前首先要根据mfrEqpIdCzsb 获取到对应的设备链接
      // 绘制线

      // 显示弹框
      mapFnObject?.showWindow(
        [selectDeviceObj.longitude, selectDeviceObj.latitude],
        `承载设备所属环名称：${selectDeviceObj.loopName}`,
        [{ name: '承载设备管理IP', value: selectDeviceObj.mfrEqpIp }, { name: '环路等级', value: selectDeviceObj.loopGrade }],
        showLoopingList
      )
    }
    const mapObj = props.mapObj;
    const pointshe: Array<any> = [];
    datas.forEach((e) => { return pointshe.push(e.points[0]) });
    mapObj?.setPoints(pointshe, 'jizhanchenghuanPoint'); // 环打点
    // debugger
    const labelPointsShe: Array<any> = [];
    datas.forEach((e) => { return labelPointsShe.push(e.labelPoints[0]) });

    mapFnObject?.showTitles(labelPointsShe.map((e) => { return { point: [e.x, e.y], title: e.text, datas: e.attr, /*dom: <div> 自定义内容 </div>*/ } }), () => {
      console.log('被点击了')
    });
    mapObj?.setViewport(labelPointsShe); // 定位到环视图

    props.setLengendType('基站') // 设置基站的图例
  }
  const showLoopingList = () => {
    SetChangeLoopList(1)
  }
  // 画线的方法
  const handleSetLine = (parentX: string, parentY: string, x: string, y: string, strokeColor = '#1AE0CD', lineType = 'solid') => {
    return { points: [[parentX, parentY], [x, y]], attr: {}, color: strokeColor, width: 3 };
  }

  // 画点的方法
  const handleSetPoint = (baseStationLoopObj: any) => {
    console.time('handleSetPoint');
    let points: any[] = [], labelPoints: any[] = [];
    if (props.mapObj && baseStationLoopObj) {
      // 创建打点
      points.push(setPoint({
        x: baseStationLoopObj.longitude || baseStationLoopObj.wgs84X,
        y: baseStationLoopObj.latitude || baseStationLoopObj.wgs84Y,
        iconName: baseStationLoopObj.iconName,
        attr: baseStationLoopObj,
      }));

      labelPoints.push(setLabelPoint({
        x: baseStationLoopObj.longitude || baseStationLoopObj.wgs84X,
        y: ((baseStationLoopObj.latitude || baseStationLoopObj.wgs84Y) * 1),
        attr: baseStationLoopObj,
        text: baseStationLoopObj.roomName || baseStationLoopObj.eqpName,
      }));
    }
    console.timeEnd('handleSetPoint');
    return { points, labelPoints }
  }

  // 地图打点 (基站成环，环上面的点)
  const setPoint = ({ x, y, iconName, attr }: any) => {
    const icon = require(`../../../images/icons/${iconName}.png`);
    return {
      x,
      y,
      icon,
      attr,
      width: 40,
      height: 40,
    };
  }

  // 地图打点 (基站成环，环上面的Label)
  const setLabelPoint = ({ x, y, attr, text, typeText }: any) => {
    return {
      x,
      y,
      attr,
      text,
      typeText
    };
  }

  // 返回列表
  const rightBackZhanzhi = () => {
    SetChangeLoopList(0)
  }

  // 清除线方法
  const clearLine = () => {
    props.mapObj?.clear('jizhanchenghuanLine');
  }
  // 清除点
  const clearPoint = () => {
    props.mapObj?.clear('jizhanchenghuanPoint');
    props.mapObj?.clear('jizhanchenghuanLabelPoint');
  }

  // 清除环画的点、线、浮窗
  const clearBaseStation = ()=> {
    // 清除线
    clearLine()
    // 清理画的环上的点
    clearPoint()
    // 隐藏浮窗
    mapFnObject?.hideWindow()

    //隐藏环上面的名称
    mapFnObject?.hideTitle();

    // 清除地图上原来的图层（右侧列表的机房列表）
    // props.mapObj?.clear('pointLayer');
    // 清除地图上原来的图层（右侧列表的机房列表 -- 高亮）
    props.mapObj?.clear('heightPointLayer');
    // 清除RRU的打点
    props.mapObj?.clear('xuanzhongRRU');
    // 隐藏清除拓扑的按钮
    SetIsShowClear(false)

    props.setLengendType('默认图例')
  }
  // 右侧基站列表
  const getQueryBaseStationLoopListByRoomID = (roomId: string) => {
    let param = {
      'data': {
        'cityCode': '',
        'dataType': 1,
        'roomId': roomId,
        'isLoop': '',
        'name': '',
        'networkType': '',
        'provinceCode': reduxMapResource.mapSelect.areaCode,
        'type': 1
      },
      'pageNo': 1,
      'pageSize': 100,
    }
    queryBaseStationLoopListByRoomID2(param).then((res) => {
      const { data, code } = res;
      setLoading(false)
      if (code == '200') {
        setEquitList(data.data)
        simulateClick(data.data)
      }
      return res;
    })
  }

  // 模拟一次点击事件（选中状态）
  const simulateClick = (data: any) =>{
    if(selectEqpId && selectEqpId != '') {
      data.forEach((item: any)=>{
        if(selectEqpId === item.deviceId || selectEqpId === item.eqpId) {
          showhighLight(item)
        }
      })
    }
  }

  useEffect(() => {
    setLoading(true)
    getBaseEqpList(props.roomId, network)
  }, [props.roomId, network])
  
  useEffect(() => {
    setSelectEqpId(props.defaultValue.selectEqpId)
    setNetWork(props.defaultValue.roomDevType)
    roomDevTypeList.forEach((item: any)=>{
      if(item.value == props.defaultValue.roomDevType){
        setNewText(item.label)
      }
    })
  }, [props.defaultValue.selectEqpId , props.defaultValue.roomDevType])

  useEffect(() => {
    return () => {
      if (props.mapObj) {
        // props.mapObj.clear('xuanzhongRRU');
        // setSelectEqpId(-1)
        clearBaseStation()
      }
    }
  }, [])

  return (
    <div className={wirelessDevCss['container']}>
      <div 
        className={wirelessDevCss['clear-dom']} 
        onClick={() => clearBaseStation()}
        style={{ left: props.left, display: isShowClear?'block':'none'}}
      > 清除拓扑 </div>
      <div className={wirelessDevCss['wireless-dev-tab']}>
        {
          roomDevTypeList.map((tab) => {
            return (
              <TabItem
                key={tab.value}
                activeIndex={network}
                tab={tab}
                handleTab={(tab) => { handleTab(tab); }}
              />
            )
          })
        }
      </div>
      <div className={wirelessDevCss['wireless-dev-item']}>

        <Spin spinning={loading} tip='正在加载'>
          {
            equitList.map((item: ListItemProps['item'], index: number) => {
              return (
                <ListItem
                  key={item.eqpId || item.deviceId}
                  item={item}
                  roomID={item.roomID}
                  showhighLight={(item) => showhighLight(item)}
                  index={index}
                  selectEqpId={selectEqpId}
                  newText={newText}
                />
              )
            })
          }
        </Spin>
      </div>

      <LoopingList
        details={details}
        changeLoopList={changeLoopList}
        isShow={isShow}
        rightBackZhanzhi={rightBackZhanzhi}
        mapObj={props.mapObj}
        mapFnObject={mapFnObject}
      />
    </div>
  );
}

export default WirelessDevice;
