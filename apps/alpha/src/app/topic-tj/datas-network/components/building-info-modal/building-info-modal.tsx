import styles from './building-info-modal.module.scss';
import CloseIcon from '../../images/Xx.png';
import DeviceIcon from '../../images/deviceItem2.png';
import { Spin } from 'antd';

import { getBldgDetail } from '../../../api/datasNetwork';
import { useEffect, useMemo, useState } from 'react';

/* eslint-disable-next-line */
export interface BuildingInfoModalProps {
  isShow: boolean;
  onCloseFunc?: Function;
  location?: { // 位置
    x: string,
    y: string,
  };
  provinceCode: string, // 省份编码
  bldgId: string,       // 楼宇ID
}

interface resType {
  'bldgName'?: string,     // 楼宇名称
  'address'?: string,      // 楼宇地址
  'districtName'?: string, // 所属行政区域名称
  'bldgTypeName'?: string, // 建筑物类型名称
  'bldType'?: string,      // 楼宇分类
  'openDate'?: string,     // 开通时限
  'manLink'?: string,      // 楼长姓名
  'manLinkPhone'?: string, // 楼长电话
  'busiTypeList'?: []      // 可开通业务列表
}

export function BuildingInfoModal(props: BuildingInfoModalProps) {
  const [data, setData] = useState<resType>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [position, setPosition] = useState<Array<string>>(['', '']);

  const point = useMemo(() => {
    if (props.location) {
      return new window.BMapGL.Point(props.location.x, props.location.y);
    }
    return null;
  }, [props.location]);

  const getDetail = () => {
    setLoading(true);
    setData({});
    const { provinceCode, bldgId } = props;

    getBldgDetail({
      provinceCode: provinceCode || window.mapView.province,
      bldgId
    }).then(res => {
      res.data && setData(res.data);
      setLoading(false);
    });
  };

  // 计算屏幕坐标
  const getPosition = () => {
    if (!point) return;
    // 根据点获取屏幕坐标
    const pot = window.mapView.map.pointToOverlayPixel(point);
    // 赋值
    setPosition([pot.x, pot.y]);
  };

  useEffect(() => {
    getDetail();
    getPosition();
  }, [props.bldgId]);

  useEffect(() => {
    //
    // const map = window.mapView.map;

    const getPosition_ = function() {
      getPosition();
    };

    createMapChange(getPosition_);

    getPosition();

    return function() {
      clearMapChange(getPosition_);
    };
  }, [props.bldgId]);

  // 监听地图变化
  const createMapChange = function(fn: Function) {
    // clearMapChange();
    window.mapView.map?.addEventListener('moving', fn);
    window.mapView.map?.addEventListener('zooming', fn);
  };

  // 清除地图变化事件
  const clearMapChange = function(fn: Function) {
    window.mapView.map?.removeEventListener('moving', fn);
    window.mapView.map?.removeEventListener('zooming', fn);
  };

  return (
    props.isShow
      ? <>
        <div className={styles['container']}
             style={{ left: position[0] + 'px', top: position[1] + 'px' }}>
          <div className={styles['close-btn']} onClick={() => {
            props.onCloseFunc && props.onCloseFunc();
          }}>
            <img src={CloseIcon} alt='close-btn-img' />
          </div>
          <div className={styles['info-content']}>
            {
              loading
                ? <Spin tip='正在加载' style={{ width: '100%', paddingTop: '50px' }} />
                : <>
                  <div className={styles['info-title']}>
                    <div className={styles['info-title-flag']}>{data.openDate}</div>
                    <div className={styles['info-title-text']}>{data.bldgName}</div>
                  </div>
                  <div className={styles['info-list']}>
                    <div className={styles['info-icon']}>
                      <img src={DeviceIcon} alt='info-icon' />
                    </div>
                    <div className={styles['info-title']}>
                      区域
                    </div>
                    <div className={styles['info-text']}>
                      {data.districtName ? data.districtName : '-'}
                    </div>
                  </div>

                  <div className={styles['info-list']}>
                    <div className={styles['info-icon']}>
                      <img src={DeviceIcon} alt='info-icon' />
                    </div>
                    <div className={styles['info-title']}>
                      楼宇地址
                    </div>
                    <div className={styles['info-text']}>
                      {data.address ? data.address : '-'}
                    </div>
                  </div>

                  <div className={styles['info-list']}>
                    <div className={styles['info-icon']}>
                      <img src={DeviceIcon} alt='info-icon' />
                    </div>
                    <div className={styles['info-title']}>
                      建筑物类型
                    </div>
                    <div className={styles['info-text']}>
                      {data.bldgTypeName ? data.bldgTypeName : '-'}
                    </div>
                  </div>

                  <div className={styles['info-list']}>
                    <div className={styles['info-icon']}>
                      <img src={DeviceIcon} alt='info-icon' />
                    </div>
                    <div className={styles['info-title']}>
                      覆盖等级
                    </div>
                    <div className={styles['info-text-ff']}>
                      {data.bldType ? data.bldType : '-'}
                    </div>
                  </div>

                  <div className={styles['info-list']}>
                    <div className={styles['info-icon']}>
                      <img src={DeviceIcon} alt='info-icon' />
                    </div>
                    <div className={styles['info-title']}>
                      楼长姓名
                    </div>
                    <div className={styles['info-text']}>
                      {data.manLink ? data.manLink : '-'}
                    </div>
                  </div>

                  <div className={styles['info-list']}>
                    <div className={styles['info-icon']}>
                      <img src={DeviceIcon} alt='info-icon' />
                    </div>
                    <div className={styles['info-title']}>
                      联系电话
                    </div>
                    <div className={styles['info-text']}>
                      {data.manLinkPhone ? data.manLinkPhone : '-'}
                    </div>
                  </div>

                  <div className={styles['info-list']}>
                    <div className={styles['info-icon']}>
                      <img src={DeviceIcon} alt='info-icon' />
                    </div>
                    <div className={styles['info-title']}>
                      支持开通业务
                    </div>
                    <div className={styles['info-text-ff']}>
                      {
                        data.busiTypeList && data.busiTypeList.map((item: any, index: number) => (
                          <span key={index} style={{ padding: '0 5px' }}>{item.busiType}</span>
                        ))
                      }
                    </div>
                  </div>
                </>
            }
          </div>
        </div>
      </>
      : null
  );
}

export default BuildingInfoModal;
