import { useEffect, useState } from 'react';
import rightDetails from './right-details-view.module.scss';
import { MapObject } from '../../components/map-view/mapUtil/mapObject';
import rightDefLeft from './image/tab-def-left.png'
import rightDefRight from './image/tab-def-right.png'
import rightOnLeft from './image/tab-on-left.png'
import rightOnRight from './image/tab-on-right.png'
import EssentialInfo from './essential-info/essential-info';
import WirelessDevice from './wireless-device/wireless-device';
import { MapFnObject } from '../../components/map-view/map-view';

/* eslint-disable-next-line */
export interface RightDetailsViewProps {
  setLengendType: (devType: string) => void;
  rightDetailsDef: {
    tabVal:  string;
    selectEqpId: string;
    roomDevType: string;
  };
  mapFnObject: MapFnObject;
  roomName: string,
  roomID: string,
  map: MapObject | null,
  topic: number;
  left: string;
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
    <div className={rightDetails['tab-item'] + ' ' + `${props.activeIndex === props.tab.id ? rightDetails['active'] : ''}`} key={props.tab.id} onClick={() => props.handleTab(props.tab.id)}>
      <img src={props.activeIndex === props.tab.id ? rightOnLeft : rightDefLeft} alt='' />
      <span> {props.tab.name} </span>
      <img src={props.activeIndex === props.tab.id ? rightOnRight : rightDefRight} alt='' />
    </div>
  )
}

export function RightDetailsView(props: RightDetailsViewProps) {
  const [isShow, SetIsShow] = useState(true)
  const [roomName, SetRoomName] = useState('')
  const [activeIndex, SetActiveIndex] = useState('1')
  const tabList = [
    {
      name: "基本信息",
      id: "1",
    },
    {
      name: "无线设备",
      id: "2",
    },
  ]
  
  const basicList = [
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
  ]

  const handleTab = (selectId: string) => {
    SetActiveIndex(selectId)
  }
  const hidePannel = (isShow: boolean) => {
    SetIsShow(!isShow)
  }

  const [defaultValue] = useState({
    roomDevType: props.rightDetailsDef.roomDevType,
    selectEqpId: props.rightDetailsDef.selectEqpId
  })

  useEffect(() => {
    SetRoomName(props.roomName)
  }, [props.roomName])

  useEffect(() => {
    SetActiveIndex(props.rightDetailsDef.tabVal)
  }, [props.rightDetailsDef.tabVal])

  return (
    <div className={rightDetails['container']}>
      <div className={rightDetails['list'] + ' ' + `${!isShow ? rightDetails['listHide'] : ''}`} >

        {/* tab栏切换 */}
        <div className={rightDetails['tabList']}>
          {
            tabList.map((tab) => {
              return (
                <TabItem
                  key={tab.id}
                  activeIndex={activeIndex}
                  tab={tab}
                  handleTab={(tab) => { handleTab(tab); }}
                />
              )
            })
          }
        </div>

        <div className={rightDetails['right-body']}>
          <div className={rightDetails['title']}> {roomName} </div>

          {
            activeIndex === '1' && <EssentialInfo
              basicList={basicList}
              roomId={props.roomID}
            />
          }

          {
            activeIndex === '2' && <WirelessDevice
              defaultValue={defaultValue}
              roomId={props.roomID}
              mapObj={props.map}
              mapFnObject={props.mapFnObject}
              left={props.left}
              setLengendType={props.setLengendType}
            />
          }
        </div>


        {/* {activeIndex === '1' && <BaseStationDetailInfoView
            basicList={basicList}
            roomId={props.roomID}
            activeIndex={activeIndex}
          />}
          {activeIndex === '2' && <BaseStationEquitView
            defaultValue={defaultValue}
            roomId={props.roomID}
            mapObj={props.map}
            activeIndex={activeIndex}
          />} */}

      </div >
      {/* 收起/展开 */}
      <div className={rightDetails['disappear'] + ' ' + `${isShow ? '' : rightDetails['disappears']}`} onClick={() => hidePannel(isShow)}>
        <div className={rightDetails['arrow']}>
          <div className={`${isShow ? rightDetails['hide'] : rightDetails['inner']}`}></div>
        </div >
      </div >
    </div >
  );
}

export default RightDetailsView;
