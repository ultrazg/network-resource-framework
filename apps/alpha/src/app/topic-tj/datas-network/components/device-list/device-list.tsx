import { useState, useRef, useEffect } from 'react';
import styles from './device-list.module.scss';
import { ListItemProps } from '@alpha/app/topic-tj/datas-network/datas-mapView';
import {
  DATAS_DEVICE_TYPE
  // NET_TYPE
} from '@alpha/app/topic-tj/utils/constants';
import {
  queryDataNetworkDeviceList,
  queryDataNetworkDeviceTotal
} from '@alpha/app/topic-tj/api/datasNetwork';
import { PaginationView } from '@alpha/app/topic-tj/components/map-view/map-list/map-list';
import RightDetail from '@alpha/app/topic-tj/components/right-detail/right-detail';
import { SpinConten } from '@alpha/app/topic-tj/components/spin/spin';
import { Dialog } from '@alpha/app/topic-tj/components/dialog';
/* eslint-disable-next-line */

const NetList = (props: any) => {
  return (
    <div className={styles['netListContainer']}>
      {props.datas.map((data: any) => {
        if (data.id === 'GUGAN169_DEVICE_COUNT') {
          return null;
        }

        if (data.id === 'NONE_FLAG') {
          return <div className={styles['item']} key={data.id}></div>;
        }

        return (
          <div className={styles['item']} key={data.label}>
            <div className={styles['icon']}>
              <em className={`tj-iconfont ${data.icon}`} />
            </div>
            <div className={styles['info']}>
              <div className={styles['num']}>
                {data.value}
                {data.unit}
              </div>
              <div className={styles['name']}>{data.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const NetType = (props: any) => {
  return (
    <div className={styles['netTypeContainer']}>
      {props.datas.map((data: any) => {
        // @ts-ignore
        return props.totalDatas.map((item: any, index: number) => {
          if (item.id === data.key && item.value != 0) {
            return (
              <span
                className={`${styles['item']} ${
                  data.value === props.id && styles['active']
                }`}
                onClick={() => props.handleClick(data)}
                key={data.label}
              >
                <div>
                  <span className={styles['name']}>{data.label}</span>
                  <span className={styles['number']} key={index}>{item.value}</span>
                </div>
              </span>
            );
          }
        });
      })}
    </div>
  );
};

import MapSearch from '@alpha/app/topic-tj/components/map-view/map-search/map-search';
import deviceItemImg from '../../images/deviceItem.png';
import deviceItem2Img from '../../images/deviceItem2.png';

const DeviceItems = (props: any) => {
  const infoItems = [
    {
      id: 'ManageIpaddress',
      label: '设备IP'
    },
    {
      id: 'MNT_STATE_NAME',
      label: '维护状态',
      value: '可用'
    },
    {
      id: 'usedportrate',
      label: '端口占用率',
      unit: '%'
    }
  ];
  return (
    <SpinConten
      loading={props.loading}
      noData={props.datas.length === 0}
      className={styles['deviceItemsContainer']}
    >
      {props.datas && props.datas.map((data: any, index: number) => {
        return (
          <div
            className={`${styles['item']} ${
              props.id === data.EQP_ID && styles['active']
            }`}
            key={data.EQP_NAME + index}
            onClick={() => props.handleClick(data)}
          >
            <div className={styles['icon']}>
              <span>{data.res_type}</span>
              <img src={deviceItemImg} alt='' />
            </div>
            <div className={styles['info']}>
              <div className={styles['name']} title={data.EQP_NAME}>{data.EQP_NAME}</div>
              <div className={styles['infoItems']}>
                {infoItems.map((infoItem) => {
                  return (
                    <div className={styles['infoItem']} key={infoItem.id}>
                      <img src={deviceItem2Img} alt='' />
                      <div
                        className={styles['infoItemName']}
                        title={infoItem.label}
                      >
                        {infoItem.label}
                      </div>
                      <div
                        className={styles['infoItemVal']}
                        title={data[infoItem.id] || infoItem.value || ''}
                      >
                        {`${data[infoItem.id] || infoItem.value || ''}${infoItem.unit || ''}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </SpinConten>
  );
};

interface PageParame {
  pageNo: number | undefined;
  pageSize: number;
  total: number;
}

interface SearchParame {
  resTypeId: string;
  manageIpaddress: string;
  eqpName: string;
}

interface DeviceItem {
  EQP_ID: string;
  EQP_NAME: string;
  res_type: string;
  ManageIpaddress: string;
  BELONG_NETWORK?: string;
}

const DeviceSearchList = (props: {
  roomId: string;
  belongNetwork: string | null;
  handleClick: (item: DeviceItem) => void;
}) => {
  const formItems = [
    {
      span: 12,
      props: 'resTypeId',
      formType: 'select',
      options: DATAS_DEVICE_TYPE,
      placeholder: '设备类型'
    },
    {
      span: 12,
      props: 'eqpName',
      formType: 'input',
      placeholder: '请输入设备名称'
    },
    {
      span: 12,
      props: 'manageIpaddress',
      formType: 'input',
      placeholder: '请输入设备IP'
    }
  ];

  const [deviceList, setDeviceList] = useState<DeviceItem[]>([]);
  const [deviceIndex, setDeviceIndex] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<PageParame>({
    pageNo: undefined,
    pageSize: 10,
    total: 0
  });
  const [searchParames, setSearchParames] = useState<SearchParame>();
  let searchRef = useRef();
  useEffect(() => {
    return () => {
      setDeviceList([]);
    };
  }, []);
  useEffect(() => {
    if (searchParames) {
      handleQueryDataNetworkDeviceList();
    }
  }, [searchParames]);
  useEffect(() => {
    if (page.pageNo && page.pageSize) {
      handleQueryDataNetworkDeviceList();
    }
  }, [page.pageNo, page.pageSize]);
  useEffect(() => {
    // if (props.belongNetwork) {
    handleQueryDataNetworkDeviceList();
    // }
  }, [props.belongNetwork, props.roomId]);
  let listTime: any = null;
  const handleQueryDataNetworkDeviceList = (paramesValue = searchParames) => {
    const newTime_ = new Date();
    listTime = newTime_;
    const parames = {
      data: {
        belongNetwork: props.belongNetwork,
        resTypeId: paramesValue?.resTypeId,
        manageIpaddress: paramesValue?.manageIpaddress,
        eqpName: paramesValue?.eqpName,
        roomId: props.roomId
      },
      pageNo: page.pageNo || 1,
      pageSize: page.pageSize
    };
    // setDeviceList([]);
    setLoading(true);
    queryDataNetworkDeviceList(parames).then((res: any) => {
      if (listTime === newTime_ && res && res.code === '200') {
        const { data } = res;
        setDeviceList(data.data || []);
        setPage({
          ...page,
          total: data.total
        });
        setLoading(false);
      }
    });
  };
  const handleSearch = (parames: any) => {
    handleQueryDataNetworkDeviceList(parames);
  };
  const handleChange = (parames: SearchParame) => {
    setSearchParames(parames);
  };
  const handlePageChange = (pageNo: any, pageSize: number) => {
    setPage({
      ...page,
      pageNo: pageNo,
      pageSize: pageSize
    });
  };
  const handleClick = (item: DeviceItem) => {
    props.handleClick(item);
    setDeviceIndex(item.EQP_ID);
  };
  return (
    <div className={styles['searchListContainer']}>
      <MapSearch
        ref={searchRef}
        formOptions={{
          gutter: 20,
          showResetBtn: false,
          showSearchBtn: true,
          searchMore: true
        }}
        formItems={formItems}
        defaultValue={{
          resTypeId: undefined,
          eqpName: undefined,
          manageIpaddress: undefined
        }}
        handleSearch={handleSearch}
        handleChange={handleChange}
      />
      <DeviceItems
        datas={deviceList}
        id={deviceIndex}
        loading={loading}
        handleClick={handleClick}
      />
      {deviceList && deviceList.length > 0 && (
        <PaginationView
          pageSize={{
            total: page.total,
            pageNo: page.pageNo || 1,
            pageSize: page.pageSize,
            onChange: (page, pageSize) => handlePageChange(page, pageSize)
          }}
        />
      )}
    </div>
  );
};

export interface DeviceListProps {
  roomItem: ListItemProps['item'];
}

import DevListDialog from '@alpha/app/topic-tj/datas-network/dev-list-dialog/dev-list-dialog';

const NET_TYPE = [
  {
    label: '全部',
    key: 'DEVICE_COUNT',
    value: ''
  },
  {
    label: 'IPRAN',
    key: 'IPRAN_DEVICE_COUNT',
    value: '79653044'
  },
  {
    label: '城域网',
    key: 'CITYNET_DEVICE_COUNT',
    value: '79653045'
  },
  {
    label: '智能城域网',
    key: 'AICITYNET_DEVICE_COUNT',
    value: '79653066'
  },
  {
    label: '169骨干网',
    key: 'GUGAN169_DEVICE_COUNT',
    value: '79653024'
  }
];

export function DeviceList(props: DeviceListProps) {
  const initNetList = [
    {
      id: 'DEVICE_COUNT',
      label: '设备总数',
      icon: 'icon-shebei3',
      value: 0
    },
    {
      id: 'CIRCUIT_COUNT',
      label: '中继电路数',
      icon: 'icon-zhongjidianlu',
      value: 0
    },
    {
      id: 'NONE_FLAG'
    },
    {
      id: 'IPRAN_DEVICE_COUNT',
      label: 'IPRAN设备',
      icon: 'icon-chengyuwang',
      value: 0
    },
    {
      id: 'CITYNET_DEVICE_COUNT',
      label: '城域网设备',
      icon: 'icon-IPRAN',
      value: 0
    },
    {
      id: 'AICITYNET_DEVICE_COUNT',
      label: '智能城域网设备',
      icon: 'icon-zhinengchengyuwang',
      value: 0
    },
    {
      id: 'PORT_COUNT',
      label: '端口总数',
      icon: 'icon-duankouzongshu',
      value: 0
    },
    {
      id: 'USED_PORT_COUNT',
      label: '端口占用数',
      icon: 'icon-zhanyongshu',
      value: 0
    },
    {
      id: 'USED_PORT_RATE',
      label: '端口占用率',
      icon: 'icon-zhanyongshuai',
      value: 0,
      unit: '%'
    },
    {
      id: 'GUGAN169_DEVICE_COUNT',
      label: '169骨干网',
      icon: 'icon-duankouzongshu',
      value: 0
    }
  ];
  const [netList, setNetList] = useState(initNetList);
  const [netTypeId, setNetTypeId] = useState(NET_TYPE[0].value);
  const [isShow, SetIsShow] = useState(true);
  const hidePannel = (isShow: boolean) => {
    SetIsShow(!isShow);
  };
  useEffect(() => {
    return () => {
      handleCallBack();
      setNetList(initNetList);
    };
  }, []);
  useEffect(() => {
    handleGetInfo();
    setNetTypeId(NET_TYPE[0].value);
  }, [props.roomItem]);
  const handleNetTypeClick = (data: any) => {
    setNetTypeId(data.value);
  };
  const [eqpid, setEqpid] = useState<string>('');
  const [eqpName, setEqpName] = useState<string>('');
  const [belongNetworkId, setBelongNetworkId] = useState<string>('');
  const [deviceListShow, setDeviceListShow] = useState(false);
  // 选中设备
  const handleClick = (item: DeviceItem) => {
    // if (eqpid !== item.EQP_ID) {
    setEqpid(item.EQP_ID);
    setEqpName(item.EQP_NAME);
    setBelongNetworkId(item.BELONG_NETWORK || '');
    setDeviceListShow(true);
    // }
  };
  // 设备详情返回列表
  const handleCallBack = () => {
    setEqpid('');
  };
  let totalTime: any = null;
  const handleGetInfo = () => {
    const newTime_ = new Date();
    totalTime = newTime_;
    queryDataNetworkDeviceTotal({
      data: {
        roomId: props.roomItem.ROOM_ID
      },
      pageNo: 1,
      pageSize: 10
    }).then((res: any) => {
      if (totalTime === newTime_ && res && res.code === '200') {
        const netInfoList = [...netList];
        netInfoList.forEach((net) => {
          net.value = res.data.data[0][net.id];
        });
        setNetList(netInfoList);
      }
    });
  };
  // 关闭机房列表
  const handleDeviceListCancel = () => {
    setDeviceListShow(false);
  };
  return (
    <RightDetail style={{ width: '460px', height: '962px', maxHeight: '962px' }}>
      <div className={styles['room-name']} title={props.roomItem.china_name}>{props.roomItem.china_name}</div>
      <NetList datas={netList} />
      <NetType
        totalDatas={netList}
        datas={NET_TYPE}
        id={netTypeId}
        handleClick={handleNetTypeClick}
      />
      <DeviceSearchList
        belongNetwork={netTypeId}
        roomId={props.roomItem.ROOM_ID}
        handleClick={handleClick}
      />
      <Dialog
        modelVisible={deviceListShow && !!eqpid}
        title={props.roomItem.china_name}
        width='1200px'
        handleCancel={handleDeviceListCancel}
        footer={null}
        destroyOnClose={true}>
        <DevListDialog
          eqpId={eqpid}
          eqpName={eqpName}
          belongNetworkId={belongNetworkId}
          showModel={false}
          hideModelContent={true}
        />
      </Dialog>
    </RightDetail>
  );
}

export default DeviceList;
