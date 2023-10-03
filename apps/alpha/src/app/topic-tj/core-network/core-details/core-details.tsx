import { useEffect, useState } from 'react';
import coreCss from './core-details.module.scss';
import NetworkElementList from './network-element-list/network-element-list';
import RackList from './rack-list/rack-list';
import {
  roomNeList,
  getRoomRackInfo,
} from '@alpha/app/topic-tj/api/coreNetwork';
import RightDetail from '@alpha/app/topic-tj/components/right-detail/right-detail';

/* eslint-disable-next-line */
export interface CoreDetailsProps {
  coreDetails: {
    roomId: string; // 机房ID
    roomName: string; // 机房名称
    roomNo: string; // 机房编号
    roomType: string; // 机房类型
    roomDeviceType: string; // 包含设备类型
    address: string; // 地址
    bigTypeId: string; // 机房类型 bigTypeId === '5' 云枢纽机房
  };
}

export function CoreDetails(props: CoreDetailsProps) {
  const [isShow, SetIsShow] = useState(true);
  const [isShowList, SetIsShowList] = useState(1); // 选中的tab下表索引
  const [roomNeListData, setRoomNeListData] = useState<any>([]);
  const [roomRackInfoData, setRoomRackInfoData] = useState<any>({});
  const [roomNeListLoading, setRoomNeListLoading] = useState<boolean>(true);
  const [roomRackInfoLoading, setRoomRackInfoLoading] = useState<boolean>(true);

  const hidePannel = (isShow: boolean) => {
    SetIsShow(!isShow);
  };

  const tabChange = (index: number) => {
    SetIsShowList(index);
  };

  // 获取 设备列表信息
  const getRoomNeList = (roomId: string) => {
    const params = {
      roomId: roomId, // 机房ID
    };
    roomNeList(params).then((res: any) => {
      if (res && res.code === '200') {
        const { data, code } = res;
        console.log('data', data);
        setRoomNeListData(data ? data.roomNeList : []);
      }
      setRoomNeListLoading(false);
    });
  };

  // 获取 设备端口信息
  const getRoomRackInfoData = (roomId: string) => {
    const params = {
      roomId: roomId,
    };
    getRoomRackInfo(params).then((res: any) => {
      if (res && res.code === '200') {
        const { data, code } = res;
        console.log('data', data);
        setRoomRackInfoData(data);
      }
      setRoomRackInfoLoading(false);
    });
  };

  useEffect(() => {
    setRoomNeListLoading(true)
    setRoomRackInfoLoading(true)
    getRoomNeList(props.coreDetails.roomId);
    getRoomRackInfoData(props.coreDetails.roomId);
    tabChange(1)
    if (isShow === false) {
      SetIsShow(true);
    }
  }, [props.coreDetails.roomId]);

  // useEffect(() => {
  //   // 云枢纽机房：默认机架视图   普通机房：默认网元视图
  //   if(props.coreDetails.bigTypeId === '5') { // '5' 云枢纽机房
  //     tabChange(0)
  //   }else{
  //     tabChange(1)
  //   }
  // }, [props.coreDetails.bigTypeId]);
  

  return (
    <RightDetail style={{ width: '460px', height: '962px', maxHeight: '962px' }}>
        <div className={coreCss['core-details-title']} title={props.coreDetails.roomName}>
          {props.coreDetails.roomName}
        </div>
        <ul className={coreCss['core-details-ul']}>
          <li className={coreCss['core-details-item']}>
            <span>机房编号：</span> {roomRackInfoData.roomNo}
          </li>
          <li className={coreCss['core-details-item']}>
            <span>机房类型：</span> {props.coreDetails.roomType}
          </li>
          <li className={coreCss['core-details-item']}>
            <span>包含设备类型：</span>
            <span
              style={{ color: '#fff' }}
              title={roomRackInfoData.roomDeviceType}
            >
              {roomRackInfoData.roomDeviceType}
            </span>
          </li>
          <li className={coreCss['core-details-item']}>
            <span>地址：</span> {props.coreDetails.address}
          </li>
        </ul>

        { (roomRackInfoData?.rackNum > 0 || props.coreDetails.bigTypeId === '5') && <div className={coreCss['core-details-tab']}>
          <div
            className={
              coreCss['core-details-tab-item'] +
              ' ' +
              `${isShowList === 0 ? coreCss['active'] : ''}`
            }
            onClick={() => tabChange(0)}
          >
            机架视图
          </div>
          <div
            className={
              coreCss['core-details-tab-item'] +
              ' ' +
              `${isShowList === 1 ? coreCss['active'] : ''}`
            }
            onClick={() => tabChange(1)}
          >
            网元视图
          </div>
        </div>}

        {isShowList == 1 ? (
          <NetworkElementList
            roomId={props.coreDetails.roomId}
            roomNeListData={roomNeListData}
            roomRackInfoLoading={roomRackInfoLoading}
          />
        ) : (
          <RackList
            roomId={props.coreDetails.roomId}
            roomRackInfoData={roomRackInfoData}
            roomNeListLoading={roomNeListLoading}
          />
        )}
    </RightDetail>
  );
}

export default CoreDetails;
