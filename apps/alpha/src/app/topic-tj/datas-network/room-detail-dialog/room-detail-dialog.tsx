import styles from './room-detail-dialog.module.scss';
import Dialog from '../../components/dialog';
import { getRoomDeviceInfo } from '../../api/datasNetwork';
import { store } from '@alpha/store';
import { useEffect, useState } from 'react';

/* eslint-disable-next-line */
export interface RoomDetailDialogProps {
  showModel: boolean;
  handleCancel?: Function;
  roomId?: string; //机房id
  roomName?: string; //机房名称
  hideModelContent?: boolean;
}

const totalListConfig = [
  { label: '设备总数', key: 'deviceCount', value: '60' },
  { label: '城域网设备', key: 'cityDeviceCount', value: '20' },
  { label: 'IPRAN设备', key: 'ipRanDeviceCount', value: '20' },
  { label: '智能城域网设备', key: 'mindDeviceCount', value: '20' }
];
const portListConfig = [
  { label: '端口总数', key: 'portCount', value: '100' },
  { label: '占用端口数', key: 'usePortCount', value: '75' },
  { label: '空闲端口数', key: 'unUsePortCount', value: '25' },
  { label: '端口占用率', key: 'usePortRate', value: '75%' },
  { label: '100G端口', key: 'protNum100G', value: '100' },
  { label: '10G端口', key: 'protNum10G', value: '100' },
  { label: 'GE端口', key: 'protNumGE', value: '100' },
  { label: '其他端口', key: 'protNumOther', value: '100' }
];

export function RoomDetailDialog(props: RoomDetailDialogProps) {
  const [roomDeviceData, setRoomDeviceData] = useState<{ [key: string]: any }>(
    {}
  );
  const getRoomDetail = () => {
    const state = store.getState();
    const params = {
      province: state.reduxMapResource.mapSelect.areaCode, //state.reduxMapResource.mapSelect.areaCode,
      roomId: props.roomId //props.roomId,
    };
    getRoomDeviceInfo(params).then((res) => {
      setRoomDeviceData(res.data);
    });
  };
  useEffect(() => {
    getRoomDetail();
  }, [props.showModel]);

  const childCompont = () => {
    return (
      <>
        <div className={styles['roomHeader']}>
          {/* <span className={styles['dayTitle']}>5日通</span> */}
          <span>{props.roomName}</span>
        </div>
        <div className={styles['totalList']}>
          {/* <i className={styles['listIcon']}></i> */}
          <ul>
            {totalListConfig.map((item, index) => {
              return (
                <li key={index}>
                  <span className={styles['listIcon']}></span>
                  <span className={styles['label']}>{item.label}</span>
                  <span>{roomDeviceData[item.key]}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles['portList']}>
          <p>资源容量</p>
          <ul>
            {portListConfig.map((item, index) => {
              // return (
              //   <li key={index}>
              //     <span className={styles['listIcon']}></span>
              //     <span className={styles['label']}>{item.label}</span>
              //     <span>{roomDeviceData[item.key]}</span>
              //   </li>
              // );

              if (roomDeviceData[item.key] * 1 == 0) {
                return null;
              } else {
                return (
                  <li key={index}>
                    <span className={styles['listIcon']}></span>
                    <span className={styles['label']}>{item.label}</span>
                    <span>{roomDeviceData[item.key]}</span>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </>
    );
  };
  return (
    <div className={styles['container']}>
      {!props.hideModelContent ? (
        <Dialog
          modelVisible={props?.showModel}
          handleCancel={() => props?.handleCancel && props.handleCancel()}
          width='380px'
          bodyStyle={{ height: '368px' }}
        >
          {childCompont()}
        </Dialog>
      ) : (
        <>{childCompont()}</>
      )}
    </div>
  );
}

export default RoomDetailDialog;
