import baseLoopCss from './base-station-looping.module.scss';
import { MapObject } from '../../components/map-view/mapUtil/mapObject';
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { ConfigProvider, Pagination } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import jizhanIcon from './assets/jizhan-icon.png';
import { queryBaseStationLoopListByRoomID2, queryBaseStationLoopInfo } from '@alpha/app/topic-tj/api/wireless';
import { MapFnObject } from '@alpha/app/topic-tj/components/map-view/map-view'
import { useSelector } from 'react-redux';
import LoopingList from './looping-list/looping-list';
import DevListDialog from '../dev-list-dialog/dev-list-dialog';

/* eslint-disable-next-line */
export interface BaseStationLoopingProps {
  mapObj: MapObject | null;
  mapFnObject?: MapFnObject;
  roomName: string;
  roomID: string;
  topic: number;
  ref?: any
}

export function BaseStationLooping(props: BaseStationLoopingProps, ref?: any) {

  const [mapFnObject] = useState(props.mapFnObject)
  const [isShow, SetIsShow] = useState(true)
  const [roomName, SetRoomName] = useState('')
  const [searchOver, SetSearchOver] = useState(true)
  const [siteDetailsList, SetSiteDetailsList] = useState([])
  const [listIndex, SetListIndex] = useState('') // 选中的id

  let tid: NodeJS.Timeout;
  const reduxMapResource = useSelector(
    (state: any) => state.reduxMapResource
  );
  const [changeLoopList, SetChangeLoopList] = useState(0)
  
  const [details, SetDetails] = useState(0)

  const paginationChange = (value: any) => {
    // paginationChange
  }
  const [showModel, setShowModel] = useState(false)
  const showModelCilck = (data: any) => {
    setRoomId(data.deviceId)
    setShowModel(true)
  }
  const hiddenModelClick = () => { 
    setShowModel(false) 
    
  }
  const [currentRoomId, setRoomId] = useState('')
  const [pagination, SetPagination] = useState({
    total: 0,
    pageNo: 1,
    pageSize: 100,
  })

  // 右侧基站列表
  const getQueryBaseStationLoopListByRoomID = (roomId: string) => {
    SetSearchOver(true)
    let param = {
      "data": {
        "cityCode": "",
        "dataType": 1,
        "roomId": roomId,
        "isLoop": "",
        "name": "",
        "networkType": "",
        "provinceCode": reduxMapResource.mapSelect.areaCode,
        "type": 1
      },
      "pageNo": pagination.pageNo,
      "pageSize": pagination.pageSize,
    }
    queryBaseStationLoopListByRoomID2(param).then((res) => {
      const { data, code } = res;
      if (code == "200") {
        SetSearchOver(false)
        SetSiteDetailsList(data.data)
        if (data.data && data.data.length > 0) {
          showBaseStationLoop(data.data[0])
        }

      }
      return res;
    })
  }

  const getQueryBaseStationLoopInfo = (roomId: string, mfrEqpId: string, selectDeviceObj: any) => {
    queryBaseStationLoopInfo({
      "bbuNum": 0,
      "cityCode": "",
      "deviceType": 2,
      "isLoop": 0,
      "name": "",
      "networkType": 0,
      provinceName: reduxMapResource.mapSelect.provinceName,
      deviceId: roomId,
      mfrEqpId: mfrEqpId,
      dataType: 2,
      provinceCode: reduxMapResource.mapSelect.areaCode,
      type: 1, // 1.环类型, 2.链类型;
    }).then((res: any) => {
      if (res.code != "200") {
        return // console.log("数据获取失败！");
      }
      SetDetails(res.data)
      console.timeEnd("设置设备完成");
      getBaseStationLoopInfo(res.data, selectDeviceObj)
      console.timeEnd("绘制路线完成");
    })
  }

  const getBaseStationLoopInfo = (allDataObj: any, selectDeviceObj: any) => {
    // 清除线
    clearLine()
    // 清理画的环上的点
    clearPoint()
    // 隐藏浮窗
    mapFnObject?.hideWindow()

    // 清除地图上原来的图层（右侧列表的机房列表）
    props.mapObj?.clear('pointLayer');
    // 清除地图上原来的图层（右侧列表的机房列表 -- 高亮）
   props.mapObj?.clear('heightPointLayer');


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
        linedata.push(handleSetLine(it.startX, it.startY, it.endX, it.endY, it.deviceSideType == "MAR" ? "#8856D9" : "#E9AE0B", "solid"));
      }

      props.mapObj?.setLines(linedata, "jizhanchenghuanLine");
    }

    // 显示基站成环圈上的设备点
    for (var i = 0; i < loopData.deviceList.length; i++) {
      it = loopData.deviceList[i];
      it.jifangType = 'idc'
      // 绘制点
      datas.push(handleSetPoint({ ...it, keyName: it.deviceId, iconName: 'IDCjifang' }))
    }

    // 显示外部基站
    for (var i = 0; i < loopData.relationStaionList.length; i++) {
      it = loopData.relationStaionList[i];
      it.jifangType = 'relationStaionList'
      // 绘制点
      datas.push(handleSetPoint({ ...it, keyName: it.deviceId, iconName: 'jifang4' }));
      // 绘制线
    }

    if (loopData.selfDeviceInfo) {
      // 绘制当前选中的点链接线
      it = loopData.selfDeviceInfo;
      it.jifangType = 'selfDeviceInfo'
      // 绘制点
      datas.push(handleSetPoint({ ...it, keyName: it.deviceId, iconName: 'xuanzhongjifang' }))
      // 绘制线之前首先要根据mfrEqpIdCzsb 获取到对应的设备链接
      // 绘制线

      // 显示弹框
      mapFnObject?.showWindow(
        [selectDeviceObj.longitude, selectDeviceObj.latitude],
        `承载设备所属环名称：${selectDeviceObj.loopName}`,
        [{ name: "承载设备管理IP", value: selectDeviceObj.mfrEqpIp }, { name: '环路等级', value: selectDeviceObj.loopGrade }],
        showLoopingList
      )
    }
    const mapObj = props.mapObj;
    const pointshe: Array<any> = [];
    datas.forEach((e)=>{ return pointshe.push(e.points[0]) });
    mapObj?.setPoints(pointshe, "jizhanchenghuanPoint"); // 环打点
    // debugger
    const labelPointsShe: Array<any> = [];
    datas.forEach((e)=>{ return labelPointsShe.push(e.labelPoints[0]) });

    mapFnObject?.showTitles(labelPointsShe.map((e)=>{ return {point: [e.x, e.y], title: e.text, datas: e.attr, /*dom: <div> 自定义内容 </div>*/} }), ()=>{
      console.log("被点击了")
    });
      mapObj?.setViewport(labelPointsShe); // 定位到环视图

  }

  const showLoopingList = () => {
    SetChangeLoopList(1)
  }

  // 画线的方法
  const handleSetLine = (parentX: string, parentY: string, x: string, y: string, strokeColor = "#1AE0CD", lineType = "solid") => {
    return { points: [[parentX, parentY], [x, y]], attr: {}, color: strokeColor, width: 3 };
  }

  // 画点的方法
  const handleSetPoint = (baseStationLoopObj: any) => {
    console.time("handleSetPoint");
    let points: any[] = [], labelPoints: any[] = [];
    if (props.mapObj && baseStationLoopObj) {
      // 创建打点
      points.push(setPoint({
        x: baseStationLoopObj.longitude,
        y: baseStationLoopObj.latitude,
        iconName: baseStationLoopObj.iconName,
        attr: baseStationLoopObj,
      }));

      labelPoints.push(setLabelPoint({
        x: baseStationLoopObj.longitude,
        y: (baseStationLoopObj.latitude * 1 + 0.000),
        attr: baseStationLoopObj,
        text: baseStationLoopObj.roomName,
      }));
    }
    console.timeEnd("handleSetPoint");
    return { points, labelPoints }
  }

  // 地图打点 (基站成环，环上面的点)
  const setPoint = ({ x, y, iconName, attr, text }: any) => {
    const icon = require(`../../images/icons/${iconName}.png`);
    return {
      x,
      y,
      icon,
      attr,
      // text,
      width: 28,
      height: 26,
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

  const checkTypeName1 = (loopingObj: any) => loopingObj.isBigLoop != 1 && loopingObj.isLongChain == 1
  const checkTypeName2 = (loopingObj: any) => loopingObj.isBigLoop != 1 && loopingObj.isLongChain != 1 && loopingObj.isLoopChain == 1
  const checkTypeName3 = (loopingObj: any) => loopingObj.isBigLoop != 1 && loopingObj.isLongChain != 1 && loopingObj.isLoopChain == 2
  const checkTypeName4 = (loopingObj: any) => loopingObj.isBigLoop == 0 && loopingObj.isLongChain == 0 && loopingObj.isLoopChain == 8

  // 判断是否成环的label显示
  const isLoopingTpye = (loopingObj: any) => {
    let loopingTpyenName = "";
    if (loopingObj.isBigLoop == 1) { // 成大环
      loopingTpyenName = "成大环";
    } else if (checkTypeName1(loopingObj)) { // 成长链
      loopingTpyenName = "成长链";
    } else if (checkTypeName2(loopingObj)) { // 成环
      loopingTpyenName = "成环";
    } else if (checkTypeName3(loopingObj)) { // 成链
      loopingTpyenName = "成链";
    } else if (checkTypeName4(loopingObj)) { // 未成环
      loopingTpyenName = "不成环";
    } else { // 不成环也不成链
      loopingTpyenName = "不成环";
    }
    return loopingTpyenName;
  }

  const showBaseStationLoop = (deviceObj: any) => {
    console.time("整个点击事件完成----------");
    console.time("修改标签完成");
    console.time("设置设备完成");
    console.time("绘制路线完成");
    SetListIndex(deviceObj.deviceId)
    console.timeEnd("修改标签完成");
    if (isLoopingTpye(deviceObj) == '不成环') return;
    getQueryBaseStationLoopInfo(deviceObj.deviceId, deviceObj.mfrEqpId, deviceObj)

    console.timeEnd("整个点击事件完成----------");


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

  const hidePannel = (isShow: boolean) => {
    SetIsShow(!isShow)
  }

  useEffect(() => {
    SetRoomName(props.roomName)
  }, [props.roomName])

  useEffect(() => {
    return (() => {
      // console.log("销毁了loop")
      clearLine()
      clearPoint()
      clearTimeout(tid);
      mapFnObject?.hideWindow()
    })
  }, [])

  useEffect(() => {
    if (!props.roomID) return;
    // 先隐藏
    mapFnObject?.hideTitle()
    SetChangeLoopList(0)
    getQueryBaseStationLoopListByRoomID(props.roomID)
  }, [props.roomID])

  useImperativeHandle(ref, () => ({ // 暴露给父组件的方法
    clearPointAndLine: () => {
      clearLine()
      clearPoint()
      mapFnObject?.hideWindow()
    }
  }))

  useEffect(() => {
    if (props.mapObj) {
      props.mapObj?.onclick((e: any) => {
        if (e.attr.jifangType == 'idc') {
          showModelCilck(e.attr)

        }
      })
    }
  }, [props.mapObj])

  return (
    <div className={baseLoopCss['baseStationLoop']}>
      <div className={baseLoopCss['siteDetailsList'] + ' ' + `${!isShow || changeLoopList === 1 ? baseLoopCss['listHide'] : ''}`} >
        <div className={baseLoopCss['siteDrtails']}>
          <div className={baseLoopCss['roomName']} title={roomName}>
            {roomName}
          </div>
        </div>

        <div className={baseLoopCss['list']}>
          {/* 显示总数 */}
          <div className={baseLoopCss['countRoom']}> {searchOver ? '加载中...' : '数据列表'}</div>

          {/* 列表数据展示 */}
          <div className={`${baseLoopCss['listContent']} ${baseLoopCss['myScrollbar']}`}>
            {
              (siteDetailsList && siteDetailsList.length > 0) && siteDetailsList.map((item: any) => {
                return (
                  <div
                    className={baseLoopCss['siteDetailsItem'] + ' ' + `${listIndex == item.deviceId ? baseLoopCss['bgcStyle'] : ''}`}
                    key={item.deviceId}
                    onClick={() => showBaseStationLoop(item)}
                  >
                    <div className={baseLoopCss['left']}>
                      <img src={jizhanIcon} alt='baseStationImg' />
                      <div className={baseLoopCss['left-middle']}>
                        <div className={baseLoopCss['left-middle-title']}>
                          <div className={baseLoopCss['name']} title={item.name}>
                            {item.name}
                          </div>
                        </div>
                        <div className={baseLoopCss['left-middle-item']} v-show='showJZLX==0'>
                          <div className={baseLoopCss['']}>{isLoopingTpye(item)}</div>
                        </div>
                      </div>

                    </div>
                    <div className={baseLoopCss['right']}>
                      {item.networkLayer}
                    </div>
                  </div>
                )
              })
            }


          </div>
          {/* 翻页功能 */}
          <ConfigProvider locale={zhCN}>
            <Pagination
              className={baseLoopCss['pagination']}
              size="small"
              showSizeChanger
              defaultCurrent={1}
              current={pagination.pageNo}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={paginationChange}
            />
          </ConfigProvider>
        </div>
      </div>

      <LoopingList
        details={details}
        changeLoopList={changeLoopList}
        isShow={isShow}
        rightBackZhanzhi={rightBackZhanzhi}
        mapObj={props.mapObj}
        mapFnObject={mapFnObject}
      />

      {/* 收起/展开 */}
      < div className={baseLoopCss['disappear'] + ' ' + `${isShow ? '' : baseLoopCss['disappears']}`} onClick={() => hidePannel(isShow)}>
        <div className={baseLoopCss['arrow']}>
          <div className={`${isShow ? baseLoopCss['hide'] : baseLoopCss['inner']}`}></div>
        </div >
      </div >
      <DevListDialog
        showModel={showModel}
        handleCancel={hiddenModelClick}
        roomID={currentRoomId}
      ></DevListDialog>
      </div >
    );
}

export default forwardRef(BaseStationLooping);
