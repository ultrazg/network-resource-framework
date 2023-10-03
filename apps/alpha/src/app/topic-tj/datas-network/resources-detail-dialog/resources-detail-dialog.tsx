import styles from './resources-detail-dialog.module.scss';
import Dialog from '../../components/dialog';
import routerIcon from '../../images/right-icon.png';
import bandIcon from '../../images/virtual-list-icon.png';
import { store } from '@alpha/store';
import { useState, useEffect } from 'react';
import {
  getCircuitList,
  getcircuitInfo,
} from '@alpha/app/topic-tj/api/datasNetwork';
import { Spin } from 'antd';

/* eslint-disable-next-line */
export interface ResourcesDetailDialogProps {
  showModel: boolean;
  handleCancel?: Function;
  hideModelContent?: boolean;
  provinceCode: string;
  positIdA?: string;
  positIdZ?: string;
}

const bandListConfig = [
  { label: '电路类型', key: 'circuitTypeName', value: 'IP中继' },
  { label: '流入带宽利用率', key: 'inputUsed', value: '65%' },
  { label: '带宽', key: 'circuitRate', value: '10M' },
  { label: '流出带宽利用率', key: 'outputUsed', value: '72%' },
];

export function ResourcesDetailDialog(props: ResourcesDetailDialogProps) {
  const [circuitList, setCircuitList] = useState<any>([]);
  const [circuitInfo, setCircuitInfo] = useState<{ [key: string]: any }>({});
  const [currentIndex, setIndex] = useState(0);
  const [activePhysicsIndex, setPhysicsIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loading1, setLoading1] = useState<boolean>(false);
  useEffect(() => {
    getCircuitData();
  }, [props.positIdA]);
  const getCircuitData = () => {
    const params = {
      provinceCode: props.provinceCode, // 省份编码
      positIdA: props.positIdA, // a端安置地点, 安置地点为机房时, 引用机房的roomId字段, 如果安置地点为室外时, 引用设备外发的positionId
      positIdZ: props.positIdZ,
    };
    getCircuitList(params).then((res) => {
      setLoading(true);

      if (res && res.code === '200' && res.data) {
        setLoading(false);
        if (res.data.physicPortList.length > 0) {
          res.data.ployPortList.unshift({
            portNum: res.data.physicPortList.length,
            portList: res.data.physicPortList,
          });
        }

        setCircuitList(res.data.ployPortList);
        if (res.data.ployPortList.length > 0) {
          getCircuitInfoData(res.data.physicPortList[0].circuitId);
        }
      }
    });
  };
  const physicsClick = (index: any) => {
    setPhysicsIndex(index);
    const id = circuitList[currentIndex].portList[activePhysicsIndex].circuitId;
    getCircuitInfoData(id);
    setLoading1(true);
  };
  const getCircuitInfoData = (id: any) => {
    const params = {
      provinceCode: props.provinceCode, // 省份编码
      circuitId: id, // 电路ID, 由路径列表接口获得
    };
    getcircuitInfo(params).then((res) => {
      setLoading1(false);
      if (res && res.data) {
        res.data.inputUsed = res.data.inputUsed + '%';
        res.data.outputUsed = res.data.outputUsed + '%';
        // console.log('电路详情请求结果', res);
        setCircuitInfo(res.data);
      }
    });
  };

  const childCompont = () => {
    return (
      <div>
        {loading ? (
          <Spin
            style={{ width: '100%', height: '100%', paddingTop: '50px' }}
            tip="正在加载"
          />
        ) : circuitList.length === 0 ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              color: 'silver',
              paddingTop: '50px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            暂无数据
          </div>
        ) : (
          <div>
            <div className={styles['routeBox']}>
              <div className={styles['routerItem']}>
                <span className={styles['title']}>聚合口</span>
                {/* <span className={`${styles['firstRouter']} ${styles['tree']}`}>
            路径1
          </span> */}
                {circuitList.map((item: any, index: any) => {
                  return (
                    <span
                      className={
                        currentIndex == index ? `${styles['firstRouter']}` : ''
                      }
                      onClick={() => {
                        setIndex(index);
                      }}
                      key={index}
                    >
                      {'路径' + (index + 1)}
                    </span>
                  );
                })}
              </div>
              <div className={styles['routerItem']}>
                <span className={styles['title']}>物理口</span>
                {/* <span className={styles['firstRouter']}>路径1</span>
          <span className={styles['treeItem']}>路径2</span>
          <span className={styles['treeItem']}>路径3</span>
          <span>路径4</span>   */}
                <div className={styles['tree']}>
                  {circuitList[currentIndex] &&
                    circuitList[currentIndex].portList.map(
                      (item: any, index: any) => {
                        return (
                          <span
                            onClick={() => {
                              physicsClick(index);
                            }}
                            className={`${
                              index == activePhysicsIndex
                                ? `${styles['activeItem']}`
                                : `${styles['treeItem']}`
                            } ${
                              circuitList[currentIndex].portList.length == 1
                                ? styles['treeItem']
                                : ''
                            }`}
                            key={index}
                          >
                            路径{index + 1}
                          </span>
                        );
                      }
                    )}
                </div>
              </div>
            </div>
            <div className={styles['line']}></div>
            <Spin spinning={loading1} tip="正在加载">
              <div className={styles['routerTitle']}>
                <img src={routerIcon} alt="" />
                <span>{circuitInfo['circuitName']}</span>
              </div>
              <div className={styles['bandList']}>
                <ul>
                  {bandListConfig.map((item, index) => {
                    return (
                      <li key={index}>
                        <img src={bandIcon} alt="" />
                        <span className={styles['label']}>{item.label}</span>
                        <span
                          className={
                            circuitInfo[item.key] &&
                            circuitInfo[item.key].indexOf('%') > -1
                              ? styles['percentage']
                              : ''
                          }
                        >
                          {circuitInfo[item.key]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className={styles['swBox']}>
                <div className={`${styles['swItem']} ${styles['swTree']}`}>
                  {/* <img src={swIcon} alt="" /> */}
                  <div className={styles['iconItem']}>
                    <span>{circuitInfo['resTypeNameA']}</span>
                  </div>
                  <div className={styles['infoContent']}>
                    <p title={circuitInfo['eqpNameA']}>
                      {circuitInfo['eqpNameA']}
                    </p>
                    <p
                      className={styles['portName']}
                      title={circuitInfo['portNameA']}
                    >
                      {circuitInfo['portNameA']}
                    </p>
                  </div>
                </div>
                <div className={styles['swItem']} style={{ marginTop: '40px' }}>
                  <div className={styles['iconItem']}>
                    <span>{circuitInfo['resTypeNameZ']}</span>
                  </div>
                  <div className={styles['infoContent']}>
                    <p title={circuitInfo['eqpNameZ']}>
                      {circuitInfo['eqpNameZ']}
                    </p>
                    <p
                      className={styles['portName']}
                      title={circuitInfo['portNameZ']}
                    >
                      {circuitInfo['portNameZ']}
                    </p>
                  </div>
                </div>
              </div>
            </Spin>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className={styles['container']}>
      {!props.hideModelContent ? (
        <Dialog
          modelVisible={props?.showModel}
          handleCancel={() => props?.handleCancel && props.handleCancel()}
          width="375px"
          bodyStyle={{ height: '430px' }}
        >
          {childCompont()}
        </Dialog>
      ) : (
        <>{childCompont()}</>
      )}
    </div>
  );
}

export default ResourcesDetailDialog;
