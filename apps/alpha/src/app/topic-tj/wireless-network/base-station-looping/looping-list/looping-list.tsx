import loopListCss from './looping-list.module.scss';
import { useEffect, useState, lazy } from 'react';
import detailTitle3 from '../assets/detailTitle3.png';
import detailTitle4 from '../assets/detailTitle4.png';
// 基站成环-设备信息弹窗
import DeviceInfoView from '@alpha/app/topic-tj/wireless-network/device-info/device-info';
/* eslint-disable-next-line */
export interface LoopingListProps {
  mapFnObject: any;
  mapObj: any;
  rightBackZhanzhi(): void;
  details: any,
  changeLoopList: number,
  isShow: boolean,
}

export function LoopingList(props: LoopingListProps) {
  const [fitlerIndex, SetFitlerIndex] = useState(0)
  let activeLoopObj: any = {}
  const [activeLoop, SetActiveLoop] = useState(activeLoopObj)
  const [loopList, SetLoopList] = useState([])
  const [deviceInfoShow, setDeviceInfoShow] = useState<boolean>(false)
  const [deviceInfo, setDeviceInfo] = useState<{id: string, name: string}>({
    id: '',
    name: ''
  })
  const handleDeviceInfoCancel = () => {
    setDeviceInfoShow(false)
  }
  const changeTab = (index: number) => {
    SetFitlerIndex(index) // tab切换选中
    changeValue(index) // 切换的值
    SetActiveLoop(activeLoopObj) // 切换时把选中状态干掉
  }

  const changeValue = (index: number) => {
    console.time("lwz");
    if (index === 0) {
      SetLoopList(props.details.relationRoomList)
    } else {
      SetLoopList(props.details.deviceList)
    }
    console.timeEnd("lwz");
  }
  const clickItem = (item: any, devType: string) => {
    SetActiveLoop(item)
    if(devType === 'deviceName'){ // 显示设备弹窗
      setDeviceInfo({
        id: item.mfrEqpIdCzsb,
        name: item.deviceName
      })
    }else{ // 高亮打点地图上的点
      clearJizhanshebeixuanzhongPoint()
      handleSetPoint(item)
    }
    // // console.log(" 点击名称，或者点击所属机房，才有选中的效果，点击所属机房就打点，点击设备名称，弹设备的信息弹框", item)
  }

  // 画点的方法
  const handleSetPoint = (devObj: any)=>{
    if (props.mapObj && devObj) {
      let points: any[] = [];
      // 创建打点
      points.push(setPoint({ x: devObj.longitude, y: devObj.latitude, attr: devObj }));
      props.mapObj.setPoints(points, 'jizhanshebeixuanzhongPoint')
      props.mapFnObject?.showTitle([devObj.longitude, devObj.latitude], devObj.deviceName)
    }
  }
  
  // 地图打点 (基站成环，环上设备亮选中)
  const setPoint = ({x, y, attr}: any) => {
    const icon = require('../../../images/icons/jizhanshebeixuanzhong.png');
    return {
      x,
      y,
      icon,
      attr,
      width: 28,
      height: 26,
    };
  }
  const clearJizhanshebeixuanzhongPoint = ()=> {
    props.mapObj && props.mapObj.clear('jizhanshebeixuanzhongPoint');
  }

  useEffect(() => {
    return(()=>{
      clearJizhanshebeixuanzhongPoint()
    })
  }, [])

  useEffect(() => {
    if(deviceInfo.id && deviceInfo.name) {
      setDeviceInfoShow(true)
    }
  }, [deviceInfo])
  
  useEffect(() => {
    // console.log(props.details)
    changeValue(fitlerIndex)
  }, [props.details])

  if (props.changeLoopList === 1) {
    return (
      <div className={loopListCss['wirelessDetailLoop'] + ' ' + `${!props.isShow && loopListCss['listHide']}`} >
        <div className={loopListCss['siteDetailsBack']}>
            <div onClick={()=> props.rightBackZhanzhi()}> ＜ 返回列表</div>
        </div>
        <div className={loopListCss['wirelessDetailDetail']}>
          <div className={`${loopListCss['flexRow']} ${loopListCss['title']}`}>
            <em className={loopListCss['iconfont icon-huan']} />
            {props.details.looName || ''}
          </div>
          <div className={`${loopListCss['flexRow']} ${loopListCss['detailItems']}`}>
            <div
              className={loopListCss['detailItem'] + ' ' + `${fitlerIndex == 0 && loopListCss['active']}`}
              onClick={() => changeTab(0)}>
              <span>承载基站</span>
              <span>{props.details.loopNodeNum || 0}</span>
            </div>

            <div
              className={loopListCss['detailItem'] + ' ' + `${fitlerIndex == 1 && loopListCss['active']}`}
              onClick={() => changeTab(1)}>
              <span>环路设备</span>
              <span>{props.details.deviceNum || 0}</span>
            </div>
            <div className={loopListCss['detailItem']}>
              <span>环路等级</span>
              <span>{props.details.loopGrade || 0}</span>
            </div>
          </div>

        </div>

        <div className={loopListCss['list']}>
          <div className={loopListCss['countRoom']}>共 {loopList && loopList.length} 条数据</div>
          <div className={`${loopListCss['listContent']} ${loopListCss['myScrollbar']}`}>
            {
              loopList && loopList.map((it: any, index: number) => {
                return (
                  <div key={index}>
                    {
                      fitlerIndex === 1 ?
                        <div className={loopListCss['listContentBox'] + ' ' + `${activeLoop.deviceId && activeLoop.deviceId === it.deviceId ? loopListCss['bgcStyle'] : ''}`}>
                          <div className={loopListCss['left'] + ' ' + `${fitlerIndex === 1 && loopListCss['huanlushebei']}`}>
                            <div className={loopListCss['left-label']}>
                              <img src={detailTitle4} alt='' className={loopListCss['icon']} />
                            </div>
                          </div>

                          <div className={`${loopListCss['center']} ${loopListCss['flexColumn']} ${loopListCss['mainDevice']}`}>
                            <div className={`${loopListCss['flexRow']} ${loopListCss['mainTitle']}`} onClick={() => clickItem(it, 'deviceName')}>
                              <span className={loopListCss['mainTitleInfo']} title={it.deviceName}> {it.deviceName} </span>
                            </div>
                            <div className={`${loopListCss['flexColumn']} ${loopListCss['mainNumber']}`}>
                              <div className={loopListCss['numberItem']} onClick={() => clickItem(it, 'roomName')}>所属机房：{it.roomName}</div>
                              <div className={loopListCss['numberItem']}>地址：{it.cityName}</div>
                            </div>
                          </div>
                        </div>
                        :
                        <div className={loopListCss['listContentBox'] + ' ' + `${(activeLoop.deviceId && activeLoop.deviceId === it.deviceId) && loopListCss['bgcStyle']}`}>

                          <div className={`${loopListCss['center']} ${loopListCss['flexColumn']} ${loopListCss['main']}`} title={it.name}>
                            <div className={`${loopListCss['flexRow']} ${loopListCss['mainTitle']}`}>
                              <span className={loopListCss['mainTitleInfo']}> {it.name} </span>
                            </div>
                          </div>
                          <div className={loopListCss['right']}>
                            成环基站：{it.loopQuantity}
                          </div>
                        </div>
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
        <DeviceInfoView
          id={deviceInfo.id}
          name={deviceInfo.name}
          modelVisible={deviceInfoShow}
          handleCancel={handleDeviceInfoCancel}
        />
      </div>
    );
  } else {
    return null;
  }

}

export default LoopingList;
