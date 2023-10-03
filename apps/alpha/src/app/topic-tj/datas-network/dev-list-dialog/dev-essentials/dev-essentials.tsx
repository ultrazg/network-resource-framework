import { useEffect, useState } from 'react';
import devEssenCss from './dev-essentials.module.scss';
import DevNameView from '../dev-name/dev-name';
import {
  queryDataNetworkDeviceInfo,
  queryPortListByEqpId
} from '@alpha/app/topic-tj/api/datasNetwork';
import { Spin } from 'antd';
import devIcon from '../assets/images/dev-icon.png';

/* eslint-disable-next-line */
export interface DevEssentialsProps {
  eqpId: string;
  eqpName: string;
}

interface portArr {
  SUPER_RES_ID: string;
  MNT_STATE_ID: number;
  OPR_STATE_NAME: string;
  PORT_RATE: number;
  PORT_TYPE: number;
  PORT_TYPE_NAME: string;
  POSITION: number;
  SUPER_RES_TYPE: number;
  PORT_NO: string;
  PORT_ID: string;
  PORT_TYPE_ID: number;
  OPR_STATE_ID: number;
  PORT_NAME: string;
  RES_TYPE_ID: number;
  PORT_TYPE_ID_NAME: string;
}

export function DevEssentials(props: DevEssentialsProps) {
  const [deviceInfo, setDeviceInfo] = useState<any>({});
  const [opticalPortArr, setOpticalPortArr] = useState<any>([]);
  const [electricalPortArr, setElectricalPortArr] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [portlist, setPortlist] = useState<any>([]);
  const [portDetail, setPortDetail] = useState<{ [key: string]: any }>({});
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  const [devicePortInfoNum, setDevicePortInfoNum] = useState<any>({
    PORTTotal: 0,
    USEDPORTTotal: 0,
    Occupancy: 0
  });

  // 转译网络类型
  const translateBelongNetwork = (belongNetworkId: string) => {
    let label = '';
    switch (belongNetworkId) {
      case '79653024':
        label = 'CHINA169';
        break;
      case '79653045':
        label = '城域网';
        break;
      case '79653044':
        label = 'UTN';
        break;
      case '79653066':
        label = '智能城域网';
        break;
      default:
        label = '--';
    }
    return label;
  };

  // 转译网络层次
  const translateNetLevel = (netLevel: number) => {
    let label = '';
    switch (netLevel) {
      case 10011801:
        label = '骨干层';
        break;
      case 10011804:
        label = '核心层';
        break;
      case 10011802:
        label = '汇聚层';
        break;
      case 10011803:
        label = '接入层';
        break;
      default:
        label = '--';
    }
    return label;
  };

  // 获取 设备信息
  const getQueryDataNetworkDeviceInfo = (eqpId: string) => {
    const params = {
      data: {
        manageIpaddress: '',
        eqpName: '',
        eqpId: eqpId
      },
      pageNo: 1,
      pageSize: 100
    };
    queryDataNetworkDeviceInfo(params).then((res: any) => {
      if (res && res.code === '200') {
        const { data, code } = res;
        setDeviceInfo(data.data && data.data.length > 0 ? data.data[0] : {});
      }

      setLoading(false);
    });
  };

  // 获取 设备端口信息
  const getQueryPortListByEqpId = (eqpId: string) => {
    const params = {
      data: {
        manageIpaddress: '',
        eqpName: '',
        eqpId: eqpId
      },
      pageNo: 1,
      pageSize: 100
    };
    queryPortListByEqpId(params).then((res: any) => {
      if (res && res.code === '200') {
        const { data, code } = res;
        const { portlist, statistics } = data;

        if (statistics && statistics.length > 0) {
          setDevicePortInfoNum({ ...statistics[0] });
        }
        // handlePortList(portlist ? portlist : []);

        setPortlist(portlist ? portlist : []);
      }
    });
  };

  const handlePortList = (portlist: any) => {
    if (portlist.length > 0) {
      let opticalArr: any = [],
        electrical: any = [];
      portlist.forEach((item: portArr) => {
        if (item.PORT_TYPE_ID_NAME === '电端口') {
          // 电口
          opticalArr.push(item);
        } else if (item.PORT_TYPE_ID_NAME === '光端口') {
          // 光口
          electrical.push(item);
        }
      });
      setOpticalPortArr(opticalArr); // 电口
      setElectricalPortArr(electrical); // 光口
    }
  };

  // 光电口详情弹窗
  const portDetailView = () => {
    return (
      <div
        className={devEssenCss['port-detail-view']}
        // style={{ left: 20, top: 20 }}
        style={{ left: x, top: y, display: x == 0 ? 'none' : 'block' }}
      >
        <div className={devEssenCss['port-detail-content']}>
          <div className={devEssenCss['port-name']}>
            {portDetail['PORT_NAME'] ? portDetail['PORT_NAME'] : '-'}
          </div>
          <div className={devEssenCss['port-detail-list']}>
            <div className={devEssenCss['port-detail-list-icon']}>
              <img src={devIcon} alt='dev-icon' />
            </div>
            <span className={devEssenCss['port-detail-title']}>端口类型</span>
            <span className={devEssenCss['port-detail-text']}>
              {
                portDetail['PORT_TYPE_ID_NAME'] && portDetail['PORT_TYPE_ID_NAME'] == '电端口'
                  ? '电口'
                  : '光口'
              }
            </span>
          </div>
          <div className={devEssenCss['port-detail-list']}>
            <div className={devEssenCss['port-detail-list-icon']}>
              <img src={devIcon} alt='dev-icon' />
            </div>
            <span className={devEssenCss['port-detail-title']}>端口状态</span>
            <span
              className={
                portDetail['OPR_STATE_ID'] === '170002' ||
                portDetail['OPR_STATE_ID'] === '170003' ||
                portDetail['OPR_STATE_ID'] === '170005' ||
                portDetail['OPR_STATE_ID'] === '170030'||
                portDetail['OPR_STATE_ID'] === '170187'
              ? 
              devEssenCss['port-detail-text-occupy'] 
              : 
              devEssenCss['port-detail-text-free']}
            >
              {
                portDetail['OPR_STATE_NAME']
                  ? portDetail['OPR_STATE_NAME']
                  : '-'
              }
            </span>
          </div>

          {/*如果占用，则显示有的中继客户电路*/}
          {/*CIRCUIT_NO   电路编码*/}
          {/*CUST_NAME  客户名称*/}
          {
            portDetail['OPR_STATE_ID'] === '170002' ||
            portDetail['OPR_STATE_ID'] === '170003' ||
            portDetail['OPR_STATE_ID'] === '170005' ||
            portDetail['OPR_STATE_ID'] === '170030'||
            portDetail['OPR_STATE_ID'] === '170187'
              ? portDetail['CIRCUIT_NO']
                ? <>
                  <div className={devEssenCss['port-detail-list']}>
                    <div className={devEssenCss['port-detail-list-icon']}>
                      <img src={devIcon} alt='dev-icon' />
                    </div>
                    <span className={devEssenCss['port-detail-title']}>电路编码</span>
                    <span className={devEssenCss['port-detail-text']}>{portDetail['CIRCUIT_NO']}</span>
                  </div>
                </>
                : null
              : null
          }
          {
            portDetail['OPR_STATE_ID'] === '170002' ||
            portDetail['OPR_STATE_ID'] === '170003' ||
            portDetail['OPR_STATE_ID'] === '170005' ||
            portDetail['OPR_STATE_ID'] === '170030'||
            portDetail['OPR_STATE_ID'] === '170187'
              ? portDetail['CUST_NAME']
                ? <>
                  <div className={devEssenCss['port-detail-list']}>
                    <div className={devEssenCss['port-detail-list-icon']}>
                      <img src={devIcon} alt='dev-icon' />
                    </div>
                    <span className={devEssenCss['port-detail-title']}>客户名称</span>
                    <span className={devEssenCss['port-detail-text']}>{portDetail['CUST_NAME']}</span>
                  </div>
                </>
                : null
              : null
          }


        </div>
      </div>
    );
  };

  const showPortDetail = (x: number, y: number, portDetail: any) => {
    setX(x);
    setY(y);
    setPortDetail(portDetail);
  };

  useEffect(() => {
    getQueryDataNetworkDeviceInfo(props.eqpId);
    getQueryPortListByEqpId(props.eqpId);
  }, [props.eqpId]);
  return (
    <>
      {
        portDetailView()
      }
      <div className={devEssenCss['container']}>
        <Spin spinning={loading} tip='正在加载'>
          <DevNameView devName={props.eqpName} />
          <div className={devEssenCss['dev-info']}>
            <div className={devEssenCss['dev-item-title']}>
              <div>设备信息</div>
              <div className={devEssenCss['dev-title-line']}></div>
            </div>
            <div className={devEssenCss['dev-info-row']}>
              <div className={devEssenCss['dev-info-item']}>
                所属区域：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.region_name}
                >
                {deviceInfo?.region_name}
              </span>
              </div>
              <div className={devEssenCss['dev-info-item']}>
                设备名称：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.EQP_NAME}
                >
                {deviceInfo?.EQP_NAME}
              </span>
              </div>
              <div className={devEssenCss['dev-info-item']}>
                设备网管IP：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.ManageIpaddress}
                >
                {deviceInfo?.ManageIpaddress}
              </span>
              </div>
              <div className={devEssenCss['dev-info-item']}>
                所属网络：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.BELONG_NETWORK_NAME}
                >
                {deviceInfo?.BELONG_NETWORK_NAME}
              </span>
                {/* {translateBelongNetwork(deviceInfo?.BELONG_NETWORK)} */}
              </div>
            </div>
            <div className={devEssenCss['dev-info-row']}>
              <div className={devEssenCss['dev-info-item']}>
                网络层次：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.NET_LEVEL_NAME}
                >
                {/* {translateNetLevel(deviceInfo?.NET_LEVEL)} */}
                  {deviceInfo?.NET_LEVEL_NAME}
              </span>
              </div>
              <div className={devEssenCss['dev-info-item']}>
                设备类型：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.res_type}
                >
                {deviceInfo?.res_type}
              </span>
              </div>
              <div className={devEssenCss['dev-info-item']}>
                厂家：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.mfr}
                >
                {deviceInfo?.mfr}
              </span>
              </div>
              <div className={devEssenCss['dev-info-item']}>
                设备型号：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.eqpModelName}
                >
                {deviceInfo?.eqpModelName}
              </span>
              </div>
            </div>
            <div className={devEssenCss['dev-info-row']}>
              <div className={devEssenCss['dev-info-item']}>
                维护状态：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.MNT_STATE_NAME}
                >
                {deviceInfo?.MNT_STATE_NAME}
              </span>
              </div>
              <div
                className={
                  devEssenCss['dev-info-item'] +
                  ' ' +
                  devEssenCss['dev-info-itemLast']
                }
              >
                所属机房：
                <span
                  className={devEssenCss['dev-item-value']}
                  title={deviceInfo?.CHINA_NAME}
                >
                {deviceInfo?.CHINA_NAME}
              </span>
              </div>
            </div>
          </div>
          <div className={devEssenCss['dev-port-info']}>
            <div className={devEssenCss['dev-item-title']}>
              <div>设备端口信息</div>
              <div className={devEssenCss['dev-title-line']}></div>

              <div className={devEssenCss['right-lenged']}>
                <span>空闲</span>
                <span>占用</span>
              </div>
            </div>
            <div className={devEssenCss['dev-port-content']}>
              <div className={devEssenCss['content-left']}>
                <div className={devEssenCss['content-lef-top']}>
                  <div className={devEssenCss['port-item']}>
                    <em
                      className={`icon tj-iconfont icon-duankouzongshu ${devEssenCss['icon-pub-jianbian']}`}
                    ></em>
                    <div>
                      <div className={devEssenCss['port-item-label']}>
                        端口总数
                      </div>
                      <div className={devEssenCss['port-item-value']}>
                        {devicePortInfoNum.PORTTotal}
                      </div>
                    </div>
                  </div>
                  <div className={devEssenCss['port-item']}>
                    <em
                      className={`icon tj-iconfont icon-zhanyongshu ${devEssenCss['icon-pub-jianbian']}`}
                    ></em>
                    <div>
                      <div className={devEssenCss['port-item-label']}>
                        端口占用数
                      </div>
                      <div className={devEssenCss['port-item-value']}>
                        {devicePortInfoNum.USEDPORTTotal}
                      </div>
                    </div>
                  </div>
                  <div className={devEssenCss['port-item']}>
                    <em
                      className={`icon tj-iconfont icon-zhanyongshuai ${devEssenCss['icon-pub-jianbian']}`}
                    ></em>
                    <div>
                      <div className={devEssenCss['port-item-label']}>
                        端口占用率
                      </div>
                      <div className={devEssenCss['port-item-value']}>
                        {devicePortInfoNum.TOTALrate || 0}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className={devEssenCss['left-lenged']}>
                  <span>已使用端口</span>
                  <span>未使用端口</span>
                </div>
                <div className={devEssenCss['content-lef-body']}>
                  <div className={devEssenCss['port-list-box']}>
                    <div>
                    <span className={devEssenCss['port-list-type']}>
                      <em
                        className={`icon tj-iconfont icon-zhanyongshu ${devEssenCss['port-list-icon']}`}
                      ></em>
                    </span>
                      <span className={devEssenCss['port-list-num']}>
                      <span className={devEssenCss['port-list-value']}>

                        {devicePortInfoNum.G100PORTTotal || 0}
                      </span>
                      <br />
                      <span> 100G端口 </span>
                    </span>
                    </div>
                    <div className={devEssenCss['port-list-progress']}>
                      <div className={devEssenCss['port-list-count']}>
                      <span className={devEssenCss['port-list-left']}>

                        {devicePortInfoNum.G100USEDPORTTotal || 0}
                      </span>
                        <span className={devEssenCss['port-list-right']}>
                        {devicePortInfoNum.G100PORTTotal == undefined &&
                        devicePortInfoNum.G100USEDPORTTotal == undefined
                          ? 0
                          : devicePortInfoNum.G100PORTTotal -
                          devicePortInfoNum.G100USEDPORTTotal}
                      </span>
                      </div>
                      <div className={devEssenCss['port-list-line']}>
                        <div
                          className={devEssenCss['lineInner']}
                          style={
                            devicePortInfoNum.G100rate * 1 == 0
                              ? { width: '0px' }
                              : { width: devicePortInfoNum.G100rate * 1 + '%' }
                          }
                        ></div>
                      </div>
                    </div>
                    <span className='port-list-num port-list-l-num'>

                    {devicePortInfoNum.G100rate || 0} %
                  </span>
                  </div>
                  <div className={devEssenCss['port-list-box']}>
                    <div>
                    <span className={devEssenCss['port-list-type']}>
                      <em
                        className={`icon tj-iconfont icon-zhanyongshu ${devEssenCss['port-list-icon']}`}
                      ></em>
                    </span>
                      <span className={devEssenCss['port-list-num']}>
                      <span className={devEssenCss['port-list-value']}>

                        {devicePortInfoNum.G10PORTTotal || 0}
                      </span>
                      <br />
                      <span> 10G端口 </span>
                    </span>
                    </div>
                    <div className={devEssenCss['port-list-progress']}>
                      <div className={devEssenCss['port-list-count']}>
                      <span className={devEssenCss['port-list-left']}>

                        {devicePortInfoNum.G10USEDPORTTotal || 0}
                      </span>
                        <span className={devEssenCss['port-list-right']}>
                        {devicePortInfoNum.G10PORTTotal == undefined &&
                        devicePortInfoNum.G10USEDPORTTotal == undefined
                          ? 0
                          : devicePortInfoNum.G10PORTTotal -
                          devicePortInfoNum.G10USEDPORTTotal}
                      </span>
                      </div>
                      <div className={devEssenCss['port-list-line']}>
                        <div
                          className={devEssenCss['lineInner']}
                          style={
                            devicePortInfoNum.G10rate * 1 == 0
                              ? { width: '0px' }
                              : { width: devicePortInfoNum.G10rate * 1 + '%' }
                          }
                        ></div>
                      </div>
                    </div>
                    <span className='port-list-num port-list-l-num'>

                    {devicePortInfoNum.G10rate || 0} %
                  </span>
                  </div>
                  <div className={devEssenCss['port-list-box']}>
                    <div>
                    <span className={devEssenCss['port-list-type']}>
                      <em
                        className={`icon tj-iconfont icon-zhanyongshu ${devEssenCss['port-list-icon']}`}
                      ></em>
                    </span>
                      <span className={devEssenCss['port-list-num']}>
                      <span className={devEssenCss['port-list-value']}>

                        {devicePortInfoNum.GEPORTTotal || 0}
                      </span>
                      <br />
                      <span> GE端口 </span>
                    </span>
                    </div>
                    <div className={devEssenCss['port-list-progress']}>
                      <div className={devEssenCss['port-list-count']}>
                      <span className={devEssenCss['port-list-left']}>

                        {devicePortInfoNum.GEUSEDPORTTotal || 0}
                      </span>
                        <span className={devEssenCss['port-list-right']}>
                        {devicePortInfoNum.GEPORTTotal == undefined &&
                        devicePortInfoNum.GEUSEDPORTTotal == undefined
                          ? 0
                          : devicePortInfoNum.GEPORTTotal -
                          devicePortInfoNum.GEUSEDPORTTotal}
                      </span>
                      </div>
                      <div className={devEssenCss['port-list-line']}>
                        <div
                          className={devEssenCss['lineInner']}
                          style={
                            devicePortInfoNum.GErate * 1 == 0
                              ? { width: '0px' }
                              : { width: devicePortInfoNum.GErate * 1 + '%' }
                          }
                        ></div>
                      </div>
                    </div>
                    <span className='port-list-num port-list-l-num'>

                    {devicePortInfoNum.GErate || 0} %
                  </span>
                  </div>
                  <div className={devEssenCss['port-list-box']}>
                    <div>
                    <span className={devEssenCss['port-list-type']}>
                      <em
                        className={`icon tj-iconfont icon-zhanyongshu ${devEssenCss['port-list-icon']}`}
                      ></em>
                    </span>
                      <span className={devEssenCss['port-list-num']}>
                      <span className={devEssenCss['port-list-value']}>

                        {devicePortInfoNum.OTHERPORTTotal || 0}
                      </span>
                      <br />
                      <span> 其他端口 </span>
                    </span>
                    </div>
                    <div className={devEssenCss['port-list-progress']}>
                      <div className={devEssenCss['port-list-count']}>
                      <span className={devEssenCss['port-list-left']}>

                        {devicePortInfoNum.OTHERUSEDPORTTotal || 0}
                      </span>
                        <span className={devEssenCss['port-list-right']}>
                        {devicePortInfoNum.OTHERPORTTotal == undefined &&
                        devicePortInfoNum.OTHERUSEDPORTTotal == undefined
                          ? 0
                          : devicePortInfoNum.OTHERPORTTotal -
                          devicePortInfoNum.OTHERUSEDPORTTotal}
                      </span>
                      </div>
                      <div className={devEssenCss['port-list-line']}>
                        <div
                          className={devEssenCss['lineInner']}
                          style={
                            devicePortInfoNum.otherrate * 1 == 0
                              ? { width: '0px' }
                              : { width: devicePortInfoNum.otherrate * 1 + '%' }
                          }
                        ></div>
                      </div>
                    </div>
                    <span className='port-list-num port-list-l-num'>

                    {devicePortInfoNum.otherrate || 0} %
                  </span>
                  </div>
                </div>
              </div>

              <div className={devEssenCss['content-middel']}></div>

              <div className={devEssenCss['content-right']}>
                <div className={devEssenCss['content-right-body']}>
                  <div className={devEssenCss['content-right-item']}>
                    {/*<div className={devEssenCss['item-title']}>光口</div>*/}
                    <div className={devEssenCss['item-list']}>
                      <div
                        className={`dev-port-content ${devEssenCss['item-body']}`}
                      >
                        {
                          portlist.length === 0
                            ? <Spin tip='正在加载' style={{ width: '100%', paddingTop: '90px' }} />
                            : portlist?.map((item: any) => {
                              return (
                                <em
                                  onMouseEnter={(e) => {
                                    let x = e.currentTarget.getBoundingClientRect().left - 320;
                                    let y = e.currentTarget.getBoundingClientRect().top - 50;

                                    if (e.currentTarget.getBoundingClientRect().left > 1250) {
                                      x = e.currentTarget.getBoundingClientRect().left - 610;
                                    }

                                    if (e.currentTarget.getBoundingClientRect().top > 600) {
                                      y = e.currentTarget.getBoundingClientRect().top - 210;
                                    }

                                    showPortDetail(x, y, item);
                                  }}
                                  onMouseLeave={() => {
                                    showPortDetail(0, 0, {});
                                  }}
                                  className={`${devEssenCss['item-col']} ${
                                    devEssenCss[
                                      item.OPR_STATE_ID == '170002' ||
                                      item.OPR_STATE_ID == '170003' ||
                                      item.OPR_STATE_ID == '170005' ||
                                      item.OPR_STATE_ID == '170030' ||
                                      item.OPR_STATE_ID == '170187' 
                                        ? 'occupy'
                                        : 'free'
                                      ]
                                  }`}
                                  key={item.PORT_ID}
                                  // title={item.PORT_NAME + ' ' + item.OPR_STATE_NAME}
                                />
                              );
                            })
                        }
                      </div>
                    </div>
                  </div>

                  {/*<div className={devEssenCss['content-right-item']}>*/}
                  {/*  <div className={devEssenCss['item-title']}>电口</div>*/}
                  {/*  <div className={devEssenCss['item-list']}>*/}
                  {/*    <div*/}
                  {/*      className={`dev-port-content ${devEssenCss['item-body']}`}*/}
                  {/*    >*/}
                  {/*      {electricalPortArr?.map((item: any) => {*/}
                  {/*        return (*/}
                  {/*          <em*/}
                  {/*            className={`${devEssenCss['item-col']} ${*/}
                  {/*              devEssenCss[*/}
                  {/*                item.OPR_STATE_NAME == '占用'*/}
                  {/*                  ? 'occupy'*/}
                  {/*                  : 'free'*/}
                  {/*              ]*/}
                  {/*            }`}*/}
                  {/*            key={item.PORT_ID}*/}
                  {/*            title={item.PORT_NAME + ' ' + item.OPR_STATE_NAME}*/}
                  {/*          />*/}
                  {/*        );*/}
                  {/*      })}*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
                <div className={devEssenCss['content-right-footer']}></div>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </>
  );
}

export default DevEssentials;
