import styles from './device-detail-dialog.module.scss';
import Dialog from '../../components/dialog';
import virtualIcon from '../../images/virtual-list-icon.png';
import { Spin } from 'antd';

import { getNeDetail } from '../../api/coreNetwork';
import { useEffect, useState } from 'react';

/* eslint-disable-next-line */
export interface DeviceDetailDialogProps {
  showModal: boolean;
  onClose: Function;
  eqpName: string;
  // provinceCode: string; // 省份编码
  eqpId: string;        // 设备ID
}

const baseInfoConfig = [
  { label: '设备名称', key: 'eqpName' },
  { label: '设备编码', key: 'eqpNo' },
  { label: '厂家', key: 'mfrName' },
  { label: '设备型号', key: 'modelName' },
  { label: '区域', key: 'regionName' },
  { label: '所属机房', key: 'roomName' },
  { label: '设备运维状态', key: 'mntStateName' },
  { label: '设备业务状态', key: 'oprStateName' },
  { label: '设备网管标识', key: 'origResId' },
  { label: '设备网管名称', key: 'origResName' }
];

export function DeviceDetailDialog(props: DeviceDetailDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [baseInfoObj, setBaseInfoObj] = useState<{ [key: string]: string }>({});
  const [personProsList, setPersonProsList] = useState<Array<any>>([]);

  useEffect(() => {
    setIsLoading(true);

    getNeDetail({
      // provinceCode: props.provinceCode,
      eqpId: props.eqpId
    }).then(res => {
      if (JSON.stringify(res?.data?.baseInfo) !== '{}') {
        setBaseInfoObj(res?.data?.baseInfo);
      }
      if (res?.data?.personPros.length > 0) {
        setPersonProsList(res?.data?.personPros);
      }

      setIsLoading(false);
    });
  }, [props.eqpId]);
  useEffect(() => {
    return () => {
      setIsLoading(false)
      setBaseInfoObj({})
      setPersonProsList([])
    }
  }, [])
  return (
    <div className={styles['container']}>
      <Dialog
        modelVisible={props?.showModal}
        handleCancel={props?.onClose}
        width='700px'
      >
        <p className={styles['header']}>信息列表</p>
        <p className={styles['deviceName']}>{props.eqpName ? props.eqpName : '-'}</p>
        <div className={styles['detailHeader']}>设备摘要</div>
        <div className={styles['detailList']}>
          <ul>
            {
              isLoading
                ? <Spin style={{ width: '100%' }} />
                : baseInfoConfig && baseInfoConfig.map((item, index: number) => (
                  <li key={index}>
                    <div className={styles['listIcon']}>
                      <img src={virtualIcon} alt='virtual-list-icon' />
                    </div>
                    <span className={styles['listLabel']}>{item.label}：</span>
                    <span
                      className={styles['listValue']}
                      title={baseInfoObj && baseInfoObj[item.key] ? baseInfoObj[item.key] : '-'}
                    >
                      {baseInfoObj && baseInfoObj[item.key] ? baseInfoObj[item.key] : '-'}
                    </span>
                  </li>
                )
              )
            }
          </ul>
        </div>
        <div className={styles['detailHeader']}>设备个性属性</div>
        <div className={styles['detailList']}>
          <ul>
            {
              isLoading
                ? <Spin style={{ width: '100%' }} />
                : personProsList && personProsList.map((item, index: number) => (
                  <li key={index}>
                    <div className={styles['listIcon']}>
                      <img src={virtualIcon} alt='virtual-list-icon' />
                    </div>
                    <span className={styles['listLabel']}>{item.proName}：</span>
                    <span className={styles['listValue']} title={item.proValue}>{item.proValue}</span>
                  </li>
                )
              )
            }
          </ul>
        </div>
      </Dialog>
    </div>
  );
}

export default DeviceDetailDialog;
