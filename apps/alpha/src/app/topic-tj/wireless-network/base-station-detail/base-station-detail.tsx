import { useEffect, useState } from 'react';
import baseCss from './base-station-detail.module.scss';
import { MapObject } from '../../components/map-view/mapUtil/mapObject';
// 基本信息
import BaseStationDetailInfoView from './base-station-detail-info/base-station-detail-info';
// 无线设备
import BaseStationEquitView from './base-station-equit/base-station-equit';

/* eslint-disable-next-line */
export interface BaseStationDetailProps {
  roomName: string,
  roomID: string,
  map: MapObject | null,
  topic: number,
}

interface TabItem {
  name: string,
  id: string,
}
interface TabObj {
  activeIndex: string,
  tab: TabItem,
  handleTab: (tabId: string) => void
}

const TabItem = (props: TabObj) => {
  return (
    <div className={baseCss['btn'] + ' ' + `${props.activeIndex === props.tab.id ? baseCss['active'] : ''}`} key={props.tab.id} onClick={() => props.handleTab(props.tab.id)}>
      {props.tab.name}
    </div>
  )
}

export function BaseStationDetail(props: BaseStationDetailProps) {
  const [isShow, SetIsShow] = useState(true)
  const [activeIndex, SetActiveIndex] = useState('1')
  const [roomName, SetRoomName] = useState('')
  const [tabList, SetTabList] = useState([
    {
      name: "基本信息",
      id: "1",
    },
    {
      name: "无线设备",
      id: "2",
    },
  ])
  const [basicList, SetBasicList] = useState([
    {
      "text": "机房名称",
      "key": "roomName"
    },
    {
      "text": "机房编号",
      "key": "roomNo"
    },
    {
      "text": "经度",
      "key": "y"
    },
    {
      "text": "纬度",
      "key": "x"
    },
    {
      "text": "是否共享",
      "key": "isShare"
    },
    {
      "text": "共享单位",
      "key": "shareUnit"
    },
    {
      "text": "地址",
      "key": "address"
    },
    {
      "text": "所属行政区域",
      "key": "regionName"
    }
  ])
  const hidePannel = (isShow: boolean) => {
    SetIsShow(!isShow)
  }
  const handleTab = (selectId: string) => {
    SetActiveIndex(selectId)
  }
  const [defaultValue] = useState({
    network: '',
  })

  useEffect(() => {
    SetRoomName(props.roomName)
  }, [props.roomName])

  return (
    <div className={baseCss['baseStationDetail']}>
      <div className={baseCss['list'] + ' ' + `${!isShow ? baseCss['listHide'] : ''}`} >
        
        <div className={baseCss['title']}> {roomName} </div>

        {/* tab栏切换 */}
        <div className={baseCss['tabList']}>
          {
            tabList.map((tab) => {
              return (
                <TabItem 
                  key={tab.id}
                  activeIndex={activeIndex} 
                  tab={tab}
                  handleTab={(tab)=>{handleTab(tab);}}
                />
              )
            })
          }
        </div>


        {activeIndex === '1' && <BaseStationDetailInfoView
          basicList={basicList}
          roomId={props.roomID}
          activeIndex={activeIndex}
        />}
        {activeIndex === '2' && <BaseStationEquitView
          defaultValue={defaultValue}
          roomId={props.roomID}
          mapObj={props.map}
          activeIndex={activeIndex}
        />}

      </div >
      {/* 收起/展开 */}
      <div className={baseCss['disappear'] + ' ' + `${isShow ? '' : baseCss['disappears']}`} onClick={() => hidePannel(isShow)}>
        <div className={baseCss['arrow']}>
          <div className={`${isShow ? baseCss['hide'] : baseCss['inner']}`}></div>
        </div >
      </div >
    </div >
  );

}

export default BaseStationDetail;

