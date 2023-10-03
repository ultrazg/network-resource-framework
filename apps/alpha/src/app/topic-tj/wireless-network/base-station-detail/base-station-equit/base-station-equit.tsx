import baseEquit from './base-station-equit.module.scss';
import { useEffect, useRef, useState } from 'react';
import { getEqpList } from '@alpha/app/topic-tj/api/wireless';
import { MapObject } from '../../../components/map-view/mapUtil/mapObject';
import MapListView from '../../../components/map-view/map-list/map-list';

/* eslint-disable-next-line */
export interface BaseStationEquitProps {
  roomId: string;
  defaultValue: {};
  mapObj: MapObject | null,
  activeIndex: string,
}

interface ListItemProps {
  item: {
    eqpId: string;
    eqpName: string;
    netGeneration: string;
    wgs84X: string;
    wgs84Y: string;

    roomID: string;
    roomName: string;
    netWorks: string;
    roomLoopFlag: number;
    address: string;
  },
  newText: string;
  roomID: string;
  index: number;
  listIndex: number;
  showhighLight: (item: any, index: number) => void
}

const ListItem = (props: ListItemProps) => {
  const item = props.item
  return (
    <div className={baseEquit['itemContainer'] + ' ' + `${props.listIndex === props.index ? baseEquit['bgcStyle'] : ''}`}
      key={item.eqpId}
      onClick={() => props.showhighLight(item, props.index)}>
      <div>
        <div className={baseEquit['item-left']}></div>
        <div className={baseEquit['item-left-text']} style={{ marginLeft: '1px', color: ' #ffffff' }}>
          {props.newText}
        </div>
      </div>
      <div className={baseEquit['item-right']}>
        <div className={baseEquit['item-topBox']}>
          <span className={baseEquit['topBox-name']} title={item.eqpName}>{item.eqpName}
          </span>
          <span className={baseEquit['topBox-level']}>{item.netGeneration}</span>
        </div>
        <div className={baseEquit['item-middle']}>
          <div className={baseEquit['middletext']}>经度：<span className={baseEquit['lng']}>{item.wgs84X ? item.wgs84X : '暂无信息'}</span></div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className={baseEquit['middletext']}>纬度：<span className={baseEquit['lat']}>{item.wgs84Y ? item.wgs84Y : '暂无信息'}</span></div>
        </div>
        <div className={baseEquit['item-address']}>
          <span className={baseEquit['addresstext']}>地址：</span>{item.address ? item.address : '暂无信息'}
        </div>
      </div>
    </div>
  )
}

export function BaseStationEquit(props: BaseStationEquitProps) {
  const [equitList, setEquitList] = useState([]); // 列表数据
  const [searchOver, SetSearchOver] = useState(true)
  const [listIndex, setListIndex] = useState(-1); // 选中的下表索引
  const roomTypeList = [
    { label: 'RRU', value: 'RRU' },
    { label: 'BBU', value: 'BBU' },
    { label: '基站', value: 'GM' },
  ] // 设备的网络类型
  const [network, setNetWork] = useState(roomTypeList[0].value); // 设备的网络类型选中的值
  const [newText, setNewText] = useState(roomTypeList[0].label); // 设备的网络类型选中的值

  const baseEquitListRef = useRef();
  const [formItems, setFormItems] = useState([{
    span: 12,
    showResetBtn: false,
    props: 'network',
    formType: 'select',
    options: [
      { label: 'RRU', value: 'RRU' },
      { label: 'BBU', value: 'BBU' },
      { label: '基站', value: 'GM' },
    ],
    placeholder: '网络类型'
  }])
  const [defaultValue] = useState({
    network: roomTypeList[0].value,
  })

  const onchangeRoomTypeList = (e: any) => {
    setNetWork(e.network)
    roomTypeList.forEach((item) => {
      if (item.value === e.network) setNewText(item.label)
    })
  }
  const showhighLight = (item: any, index: number) => {
    if (props.mapObj && item) {
      props.mapObj.clear('xuanzhongEquit');
      let points: any[] = [];
      // 创建打点
      points.push(setPoint({ x: item.wgs84X, y: item.wgs84Y, attr: item }));
      props.mapObj.setPoints(points, 'xuanzhongEquit')
    }
    // console.log(item)
    setListIndex(index)
  }

  // 地图打点 (资源上图)
  const setPoint = ({ x, y, attr }: any) => {
    const icon = require('../../../images/icons/xuanzhongwangluoleixing.png');
    return {
      x,
      y,
      icon,
      attr,
      width: 28,
      height: 26,
    };
  }

  // 数据获取
  const getBaseEqpList = (roomID: string, network: string) => {
    SetSearchOver(true)
    getEqpList(roomID, network).then((res) => {
      SetSearchOver(false)
      setEquitList(res.data)
    });
  };

  useEffect(() => {
    getBaseEqpList(props.roomId, network)
  }, [props.roomId, network])

  useEffect(() => {
    return () => {
      if (props.mapObj) {
        props.mapObj.clear('xuanzhongEquit');
        // setListIndex(-1)
      }
    }
  }, [])

  return (
    <div className={baseEquit['coverStation']}>
      <MapListView
        ref={baseEquitListRef}
        isShow={true}
        searchOver={searchOver}
        listItem={
          equitList.map((item: ListItemProps['item'], index: number) => {
            return (
              <ListItem
                key={item.eqpId}
                item={item}
                roomID={item.roomID}
                showhighLight={(item) => showhighLight(item, index)}
                index={index}
                listIndex={listIndex}
                newText={newText}
              />
            )
          })
        }
        listSearch={{
          formItems: formItems,
          defaultValue: defaultValue,
          formOptions: {
            gutter: 20,
            showResetBtn: false,
          },
          handleSearch: (parames) => onchangeRoomTypeList(parames),
          handleChange: (parames) => onchangeRoomTypeList(parames),
        }}
      />
    </div>
  );
}

export default BaseStationEquit;

