import styles from './core-detail-dialog.module.scss';
import Dialog from '../../components/dialog';
// import frameImg from '../../images/core-frame.png'
import titleIcon from '../../images/dialog-title-icon.png';
import listIcon from '../../images/virtual-list-icon.png';
import { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { getRackInsideInfo } from '../../api/coreNetwork';

/* eslint-disable-next-line */
export interface CoreDetailDialogProps {
  showDetailModel: boolean;
  handleHiddenModel?: Function;
  list?: any;
  listItem?: any; //机架列表信息，从外面传进来
  handleVirtualCilck?: (item: any) => void;
}

const listConfig = [
  { label: '实例名', key: 'instName' },
  { label: '内存', key: 'bkMem' },
  { label: '状态', key: 'cuBaseStatus' },
  { label: 'CPU型号', key: 'bkCpuModule' },
  { label: '生产厂商', key: 'cuBaseVendor' },
  { label: 'U位', key: 'cuBaseUPosition' },
  { label: 'CPU数', key: 'cuBaseCpuCount' },
  { label: 'CPU物理核心数', key: 'cuBaseCpuPhysicalCores' },
  { label: '网络分区', key: 'cuNetcfgNetworkArea' },
  { label: '磁盘容量', key: 'bkDisk' },
  { label: '资源地', key: 'cuBaseCloudPlatform' },
  { label: '维护管理', key: 'cuBaseConfigAdmin' },
  { label: '带外管理ip', key: 'cuNetcfgManageIp' },
  { label: '主板序列号', key: 'cuBaseMotherboardSn' },
  { label: '交付配置信息', key: 'cuBaseHardwareInfoDetail' },
  { label: '管理IP', key: 'cuNetcfgManageGatewayIp' },
];

const machineConfig = [
  { label: '机架ID', key: 'rackId' },
  { label: '机架型号', key: 'rackTypeName' },
  { label: '机架U数', key: 'unum' },
  { label: '占用U数', key: 'useUNum' },
];

export function CoreDetailDialog(props: CoreDetailDialogProps) {
  const [showNetWorkModel, updateShowModel] = useState<{
    show: boolean
    datas: Array<any>
    title: string
    rackName: string
  }>({ show: false, datas: [], title: "",rackName: "" });
  // const [showNetWorkModelDialogFull, setShowNetWorkModelDialogFull] = useState<{ show: boolean, datas: Array<any> }>({show: false, datas: []});

  const [topVal, setTop] = useState(0);
  const [leftVal, setLeft] = useState(0);
  const [currentIndex, setActiveIndex] = useState(0);
  const [machineDtoList, setDetailData] = useState<any>([]);
  const [hoverIndex, setHoverIndex] = useState(0);
  const [activeMachine, setActiveMachine] = useState<{ [key: string]: any }>(
    {}
  );
  const showDetailTip = (e: any, index: number) => {
    const dom = e.currentTarget;
    setTop(dom.offsetTop);
    setLeft(dom.offsetLeft);
    setHoverIndex(index);
  };

  useEffect(() => {
    if (props.list.length) {
      setDetailData(props.list);
      setActiveMachine(props.list[0]);
    }
  }, [props.list]);
  useEffect(() => {
    setActiveMachine(props.list[currentIndex]);
  }, [currentIndex]);
  return (
    <div className={styles['container']}>
      <div className="testLaiow"></div>
      <Dialog
        modelVisible={props.showDetailModel}
        handleCancel={() => {
          updateShowModel({ show: false, datas: [], title: "", rackName: "" });
          props.handleHiddenModel && props.handleHiddenModel();
        }}
        width="1100px"
        bodyStyle={{ height: '800px' }}
        style={{ left: '-45px' }}
      >
        <div className={styles['detailBox']}>
          <div className={styles['leftDetail']}>
            {/* 机架信息 */}
            <div className={styles['frameMsg']}>
              <div
                className={styles['title']}
                title={props.listItem ? props.listItem['rackName'] : ''}
              >
                {props.listItem ? props.listItem['rackName'] : ''}
              </div>
              <ul>
                {machineConfig.map((item, index) => {
                  return (
                    <li key={index}>
                      <img src={listIcon} alt="" />
                      <span className={styles['label']}>{item.label}：</span>
                      <span className={styles['rackId']} title={props.listItem ? props.listItem[item.key] : '--'}>
                        {props.listItem ? props.listItem[item.key] : '--'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              className={
                machineDtoList.length > 5
                  ? `${styles['iconList']} ${styles['moreIcon']}`
                  : `${styles['iconList']}`
              }
            >
              {machineDtoList.map((item: any, index: number) => {
                return (
                  <span
                    key={index}
                    className={`${styles['networkIcon']} ${
                      currentIndex === index ? styles['activeIcon'] : ''
                    }`}
                    onMouseEnter={(e) => {
                      showDetailTip(e, index);
                    }}
                    onMouseLeave={() => {
                      setLeft(0);
                      setTop(0);
                    }}
                    onClick={() => {
                      setActiveIndex(index);
                    }}
                  ></span>
                );
              })}
              <div
                style={{
                  position: 'absolute',
                  top: topVal,
                  left: leftVal,
                  display: `${topVal == 0 ? 'none' : 'block'}`,
                  pointerEvents: 'none',
                }}
                className={styles['tipBox']}
              >
                <p className={styles['tipTitle']}>物理机名称</p>
                <p>
                  {machineDtoList[hoverIndex]
                    ? machineDtoList[hoverIndex]['instName']
                    : '--'}
                </p>
              </div>
            </div>
          </div>

          <div className={styles['detailRight']}>
            <div className={styles['frameDetail']}>
              <div className={styles['boxHeader']}>
                <img
                  src={titleIcon}
                  style={{ marginRight: '8px', width: '22px', height: '18px' }}
                />
                <span>
                  {machineDtoList[currentIndex]
                    ? machineDtoList[currentIndex]['instName']
                    : ''}
                </span>
              </div>
              <div className={styles['detail-list']}>
                <ul>
                  {listConfig.map((item: any, index) => {
                    return (
                      <li key={index}>
                        <img src={listIcon} alt="" />
                        <span className={styles['label']}>{item.label}：</span>
                        <span>{activeMachine[item.key] || '--'}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {!showNetWorkModel.show && (
              <div className={styles['virtualBox']}>
                <span className={styles['boxHeader']}>
                  <img
                    src={titleIcon}
                    style={{
                      marginRight: '8px',
                      width: '22px',
                      height: '18px',
                    }}
                  />
                  <span>
                    NFV虚拟机
                    {activeMachine['vmAndVnfInfoList']
                      ? activeMachine['vmAndVnfInfoList'].length + '台'
                      : ''}
                  </span>
                </span>
                <div className={styles['virtualBox-content']}>
                  {activeMachine['vmAndVnfInfoList'] ? (
                    activeMachine['vmAndVnfInfoList'].map(
                      (item: any, index: number) => {
                        return (
                          <div className={styles['virtualItem']} key={index}>
                            <div className={styles['itemLeft']}>
                              <span className={styles['itemIcon']}></span>
                              <span
                                className={styles['itemLabel']}
                                title={item['vmName']}
                              >
                                {item['vmName']}
                              </span>
                            </div>
                            <div className={styles['itemLine']}></div>
                            <div
                              className={styles['itemRight']}
                              onClick={() => {
                                updateShowModel({ show: true, datas: item, title: item.vnfName, rackName: (props.listItem ? props.listItem.rackName : "") });
                              }}
                            >
                              <span className={styles['rightLabel']}>VNF</span>
                              <span
                                className={styles['rightValue']}
                                title={item['vnfName'] || ''}
                              >
                                {item['vnfName'] || '--'}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className={styles['notData']}>暂无数据</div>
                  )}
                </div>

                {/* <div className={styles['virtualItem']}>
                <div className={styles['itemLeft']}>
                  <span className={styles['itemIcon']}></span>
                  <span className={styles['itemLabel']}>
                    GD_GD_GZ_AMF80O_C_HW_ PBU_C-A1_9
                  </span>
                </div>
                <div className={styles['itemLine']}></div>
                <div className={styles['itemRight']}>
                  <span className={styles['rightLabel']}>VNF</span>
                  <span>GD_ FJ_ FZ_ ISCSCF51_ C_ ZX</span>
                </div>
              </div>
              <div className={styles['virtualItem']}>
                <div className={styles['itemLeft']}>
                  <span className={styles['itemIcon']}></span>
                  <span className={styles['itemLabel']}>
                    GD_GD_GZ_AMF80O_C_HW_ PBU_C-A1_9
                  </span>
                </div>
                <div className={styles['itemLine']}></div>
                <div className={styles['itemRight']}>
                  <span className={styles['rightLabel']}>VNF</span>
                  <span>GD_ FJ_ FZ_ ISCSCF51_ C_ ZX</span>
                </div>
              </div> */}
              </div>
            )}

            {/* <div
              className={`${styles['networkBox']} ${
                showNetWorkModel ? styles['networkBox'] : styles['hiddenBox']
              }`}
            >
              <div className={styles['closeBox']}>
                <CloseOutlined
                  style={{ fontSize: '16px', color: '#00FEFF' }}
                  onClick={() => {
                    updateShowModel(false);
                  }}
                />
              </div>
              <div className={styles['leftList']}>
                <span>网元</span>
                <span>虚拟机</span>
                <span>物理机</span>
              </div>
            </div> */}
            {showNetWorkModel.show && (
              <CoreDeviceTreeBox
                tabs={CoreDeviceTreeBox_tabs}
                treeDatas={[
                  CoreDeviceTreeBox_treeDatas(showNetWorkModel.datas, showNetWorkModel.rackName),
                ]}
                title={showNetWorkModel.title}
                rackName={showNetWorkModel.rackName}
                treeClick={(a: any) => {}}
                index={CoreDeviceTreeBox_tabs[0].name}
                callBack={() => {
                  // showNetWorkModel.show = false;
                  // showNetWorkModel.datas = [];
                  // updateShowModel(showNetWorkModel);
                  updateShowModel({ show: false, datas: [], title: "", rackName: "" });
                }}
                fullBack={() => {
                  // showNetWorkModelDialogFull.show = true;
                  // showNetWorkModelDialogFull.datas = showNetWorkModel.datas;
                  // setShowNetWorkModelDialogFull(showNetWorkModelDialogFull);
                }}
              ></CoreDeviceTreeBox>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

const CoreDeviceTreeBox_tabs = [
  { name: '网元', value: '网元' },
  { name: '虚拟机', value: '虚拟机' },
  { name: '物理机', value: '物理机' },
  { name: '机架', value: '机架' },
];

import bg from '../components/core-deviceTree/images/bg.png';
import bg2 from '../components/core-deviceTree/images/bg2.png';
import bg3 from '../components/core-deviceTree/images/bg3.png'; //"./images/bg3.png"
import CoreDeviceTreeBox, {
  Tree,
} from '../components/core-deviceTree/core-deviceTree';

const CoreDeviceTreeBox_treeDatas = function (datas: any, title: string) {
  return {
    name: datas.vmName,
    data: [datas].map((datas: any) => {
      datas.name = title || "";
      datas.icon = bg2;
      datas.child = datas.hostList
        ? datas.hostList.map((hostList: any) => {
            return {
              ...hostList,
              name: hostList.bkInstName,
              icon: bg3,
              child: hostList.vmDetailInfoDtoList.map(
                (vmDetailInfoDtoList: any) => {
                  return {
                    ...vmDetailInfoDtoList,
                    name: vmDetailInfoDtoList.vmName,
                    icon: bg,
                    child: [],
                  };
                }
              ), //.splice(0,3)
            };
          })
        : [];
      return datas;
    }),
  };
};

export default CoreDetailDialog;
