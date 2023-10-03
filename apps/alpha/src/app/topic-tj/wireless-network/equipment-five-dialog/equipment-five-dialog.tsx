import styles from './equipment-five-dialog.module.scss';
import Dialog from '@alpha/app/topic-tj/components/dialog';
import MapSearch, { FormItem } from '@alpha/app/topic-tj/components/map-view/map-search/map-search';
// import { VerticalAlignBottomOutlined } from '@ant-design/icons';
// import { getCityCode } from '@alpha/app/topic-tj/api/apiJson';
import { Tables } from '@alpha/app/topic-tj/components/tables/tables';
import { DownloadDialog } from '@alpha/app/topic-tj/components/download-dialog/download-dialog';
import { useEffect, useRef, useState } from 'react';
// import { opacity } from 'html2canvas/dist/types/css/property-descriptors/opacity';
import {
  getProvinceAndRegionInfo,
  getBbuPage,
  getStatistics,
  exportBbu
} from '@alpha/app/topic-tj/api/wirelessNetwork';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import message from '@alpha/app/message/message';

/* eslint-disable-next-line */
export interface EquipmentFiveDialogProps {
  showModel: boolean;
  handleCancel?: Function;
}

let defaultValue: any = {};
const formItems: FormItem[] = [
  {
    props: 'province',
    formType: 'select',
    label: '',
    span: 6,
    placeholder: '省份',
    options: []
  },
  {
    props: 'region',
    formType: 'select',
    label: '',
    span: 6,
    placeholder: '地市',
    options: []
  },
  {
    props: 'bbuName',
    formType: 'input',
    label: '',
    span: 6,
    placeholder: '请输入BBU名称'
  },
  {
    props: 'bearingEquipmentIsCircle',
    formType: 'select',
    label: '',
    span: 6,
    placeholder: '承载设备是否成环',
    options: [
      { label: '是', value: '是' },
      { label: '否', value: '否' }
    ]
  },
  {
    props: 'isBigCircle',
    formType: 'select',
    label: '',
    span: 6,
    placeholder: '是否属于大环',
    options: [
      { label: '是', value: '是' },
      { label: '否', value: '否' }
    ]
  },
  {
    props: 'isLongLink',
    formType: 'select',
    label: '',
    span: 6,
    placeholder: '是否属于长链',
    options: [
      { label: '是', value: '是' },
      { label: '否', value: '否' }
    ]
  }
];
const tableColumn = [
  {
    title: '省份',
    dataIndex: 'province',
    key: 'province',
    width: 100,
    render: (item: any) => item ? item : '-'
  },
  {
    title: '地市',
    dataIndex: 'region',
    key: 'region',
    width: 100,
    render: (item: any) => item ? item : '-'
  },
  {
    title: '网络',
    dataIndex: 'network5g4g',
    key: 'network5g4g',
    width: 90,
    render: (item: any) => item ? item : '-'
  },
  {
    title: 'BBU设备ID',
    dataIndex: 'bbuId',
    key: 'bbuId',
    width: 120,
    render: (item: any) => {
      if (item) {
        return <div
          style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={item}>{item}</div>;
      }

      return '-';
    }
  },
  {
    title: 'BBU设备名称',
    dataIndex: 'bbuName',
    key: 'bbuName',
    width: 200,
    render: (item: any) => {
      if (item) {
        return <div
          style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={item}>{item}</div>;
      }

      return '-';
    }
  },
  {
    title: '机房传输是否成环',
    dataIndex: 'isRoomCircle',
    key: 'isRoomCircle',
    width: 260,
    render: (item: any) => {
      if (item == '') {
        return '-';
      }

      if (item === '否') {
        return <span style={{ color: '#CA8912' }}>否</span>;
      } else {
        return <span style={{ color: '#3EDCAA' }}>{item}</span>;
      }
    }
  },
  {
    title: '承载设备类型',
    dataIndex: 'bearingEquipmentType',
    key: 'bearingEquipmentType',
    width: 140,
    render: (item: any) => item ? item : '-'
  },
  {
    title: '承载设备层次',
    dataIndex: 'bearingEquipmentLevel',
    key: 'bearingEquipmentLevel',
    width: 140,
    render: (item: any) => {
      switch (item) {
        case '接入层':
          return <span
            style={{
              padding: '5px',
              color: '#3EDCAA',
              backgroundImage: 'linear-gradient(90deg, rgba(67,255,196,0.00) 0%, rgba(67,255,196,0.20) 48%, rgba(67,255,196,0.00) 100%)'
            }}>{item}</span>;
        case '核心层':
          return <span
            style={{
              padding: '5px',
              color: '#2EB6FF',
              backgroundImage: 'linear-gradient(90deg, rgba(46,182,255,0.00) 0%, rgba(46,182,255,0.20) 48%, rgba(46,182,255,0.00) 100%)'
            }}>{item}</span>;
        case '汇聚层':
          return <span
            style={{
              padding: '5px',
              color: '#CD8832',
              backgroundImage: 'linear-gradient(90deg, rgba(253,179,86,0.00) 0%, rgba(253,179,86,0.20) 48%, rgba(253,179,86,0.00) 100%)'
            }}>{item}</span>;
        case '':
          return '-';
        default:
          return '-';
      }
    }
  },
  {
    title: '承载设备所在机房名称',
    dataIndex: 'bearingEquipmentRoom',
    key: 'bearingEquipmentRoom',
    width: 200,
    render: (item: any) => {
      if (item) {
        return <div
          style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={item}>{item}</div>;
      }

      return '-';
    }
  },
  {
    title: '承载设备是否成环',
    dataIndex: 'bearingEquipmentIsCircle',
    key: 'bearingEquipmentIsCircle',
    width: 180,
    render: (item: any) => {
      if (item == '') {
        return '-';
      }

      if (item === '否') {
        return <span style={{ color: '#CA8912' }}>否</span>;
      } else {
        return <span style={{ color: '#3EDCAA' }}>{item}</span>;
      }
    }
  },
  {
    title: '所属环名称',
    dataIndex: 'belongingRingName',
    key: 'belongingRingName',
    width: 200,
    render: (item: any) => {
      if (item) {
        return <div
          style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={item}>{item}</div>;
      }

      return '-';
    }
  },
  {
    title: '环路等级',
    dataIndex: 'circleLevel',
    key: 'circleLevel',
    width: 120,
    render: (item: any) => item ? item : '-'
  },
  {
    title: '所属链名称',
    dataIndex: 'linkName',
    key: 'linkName',
    width: 200,
    render: (item: any) => {
      if (item) {
        return <div
          style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={item}>{item}</div>;
      }

      return '-';
    }
  },
  {
    title: '是否属于大环',
    dataIndex: 'isBigCircle',
    key: 'isBigCircle',
    width: 170,
    render: (item: any) => {
      if (item == '') {
        return '-';
      }

      if (item === '否') {
        return <span style={{ color: '#CA8912' }}>否</span>;
      } else {
        return <span style={{ color: '#3EDCAA' }}>{item}</span>;
      }
    }
  },
  {
    title: '是否属于长链',
    dataIndex: 'isLongLink',
    key: 'isLongLink',
    width: 120,
    render: (item: any) => {
      if (item == '') {
        return '-';
      }

      if (item === '否') {
        return <span style={{ color: '#CA8912' }}>否</span>;
      } else {
        return <span style={{ color: '#3EDCAA' }}>{item}</span>;
      }
    }
  }
];

// const datas = [
//   {
//     province: '广东省',
//     region: '广州市',
//     network5g4g: '01079734324',
//     bbuId: '城乡贸易中心',
//     bbuName: '城乡贸易中心5层机房G网…',
//     isRoomCircle: '是（非大环）',
//     bearingEquipmentType: 'IPRAN',
//     bearingEquipmentLevel: '接入层',
//     bearingEquipmentRoom: '',
//     bearingEquipmentIsCircle: '是',
//     belongingRingName: '华南',
//     circleLevel: '大环',
//     linkName: '长链',
//     isBigCircle: '是',
//     isLongLink: '否'
//   }
// ];

interface params {
  province: string,
  region: string,
  bbuName: string,
  bearingEquipmentIsCircle: string,
  isBigCircle: string,
  isLongLink: string
}

export function EquipmentFiveDialog(props: EquipmentFiveDialogProps) {
  const [unLoadType, setUnLoadType] = useState(false);
  const mapSearchRef = useRef();
  const [showDownLoadModel, setShowDownModel] = useState(false);
  const [provinceAndRegionInfo, setProvinceAndRegionInfo] = useState([]);
  const [totalData, setTotalData] = useState<{ [key: string]: any }>({});
  const [bbuLists, setBbuLists] = useState([]);
  const [statisticsLoading, setStatisticsLoading] = useState<boolean>(true); // 统计 loading
  const [bbuListsLoading, setBbuListsLoading] = useState<boolean>(false); // bbu 列表 loading
  const [currentProvinceCode, setCurrentProvinceCode] = useState(''); // 当前选中的省
  const [exportParams, setExportParams] = useState<{ [key: string]: any }>({});
  const [searchParam, setSearchParam] = useState<params>({
    province: '',
    region: '',
    bbuName: '',
    bearingEquipmentIsCircle: '',
    isBigCircle: '',
    isLongLink: ''
  });

  const getProvinceAndRegionInfoData = (initProvinceCode?: string) => {
    getProvinceAndRegionInfo({}).then(res => {
      if (res.data.length > 0) {
        let list = res.data.map((item: any) => (
          {
            label: item.province,
            name: item.province,
            key: item.provinceCode
          }
        ));

        if (initProvinceCode) {
          const init = list.filter((item: any) => item.key == initProvinceCode);

          setCurrentProvinceCode(init[0].name);

          const initParam: params[] = {
            // @ts-ignore
            province: init[0].name,
            region: '',
            bbuName: '',
            bearingEquipmentIsCircle: '',
            isBigCircle: '',
            isLongLink: ''
          };

          getBbuPageData(initParam);
        }

        formItems[0].options = list;
        setProvinceAndRegionInfo(res.data);
      }
    });
  };

  /** 获取 bbu 列表 */
  const getBbuPageData = (params: any) => {
    setBbuLists([]);
    setBbuListsLoading(true);
    getBbuPage({
      pageNo: 1,
      pageSize: 20,
      data: {
        province: params.province,
        region: params.region,
        bbuName: params.bbuName,
        bearingEquipmentIsCircle: params.bearingEquipmentIsCircle,
        isBigCircle: params.isBigCircle,
        isLongLink: params.isLongLink
      }
    }).then(res => {
      setBbuListsLoading(false);
      // if (res.data.data.length > 0) {
      setBbuLists(res.data.data);
      // }
    });
  };

  /** 获取统计数据 */
  const getStatisticsData = () => {
    getStatistics({}).then(res => {
      if (res.data) {
        setTotalData(res.data);
      }
    });

    setStatisticsLoading(false);
  };

  /** 导出bbu */
  const exportBbuData = () => {
    exportBbu(exportParams).then(res => {
      if (res.code && res.code === '200') {
        message.success({ content: '导出成功' });
      }
      console.log('导出', res);
    });
  };

  // 搜索组件的搜索事件
  const handleSearch = (searchParams: any) => {
    console.log('点击了搜索', searchParams);

    getBbuPageData(searchParams);
  };

  const handleChange = (searchParams: any) => {
    // 获取省份对应索引
    setCurrentProvinceCode(searchParams.province);
    const provinceIndex: any = provinceAndRegionInfo.findIndex((item: any) => item.province === searchParams.province);
    // @ts-ignore
    let childrenList = provinceAndRegionInfo[provinceIndex].region.map((itm: any) => (
      {
        label: itm,
        name: itm,
        key: itm
      }
    ));

    if (currentProvinceCode != searchParams.province && formItems[0].options && provinceIndex !== -1 && formItems[0].options[provinceIndex]) {
      // 省份改变，地市选项清空
      defaultValue = {
        ...searchParams,
        region: undefined
      };

      (mapSearchRef?.current as any).onSearchDefault(defaultValue);
      // 赋值对应地市下拉框参数
      formItems[1].options = childrenList;
    }

    setExportParams(searchParams);

    // const provinceIndex: any = formItems[0].options?.findIndex((option: any) => {
    //   return option.id === searchParams.province;
    // });
    // if (defaultValue.province !== searchParams.province && formItems[0].options && provinceIndex !== -1 && formItems[0].options[provinceIndex]) {
    //   // 省份改变，地市选项清空
    //   defaultValue = {
    //     ...searchParams,
    //     region: undefined
    //   };
    //   (mapSearchRef?.current as any).onSearchDefault(defaultValue);
    //   // 赋值对应地市下拉框参数
    //   formItems[1].options = formItems[0].options[provinceIndex].children;
    // }
  };

  const downClick = (e: any) => {
    e.stopPropagation();
    console.log('下载专区点击');

    setShowDownModel(true);
  };

  const btnDom = () => {
    return (
      <div className={styles['formBtnBox']}>
        {/*<div className={styles['searchBtn']}>查询</div>*/}
        {/*<div className={styles['resetBtn']}>重置</div>*/}
        <div
          className={`${styles['exportBtn']} ${
            unLoadType ? styles['exportIcon'] : ''
          }`}
          onClick={() => {
            exportBbuData();
            setUnLoadType(true);
          }}
        >
          导出
          <span
            className={`iconFont tj-iconfont icon-xiazai2`}
            onClick={(e) => {
              downClick(e);
            }}
          />
        </div>
      </div>
    );
  };

  const reduxMapResource = useSelector(
    (state: any) => state.reduxMapResource
  );

  useEffect(() => {
    let initProvinceCode = reduxMapResource.mapSelect.areaCode;
    getProvinceAndRegionInfoData(initProvinceCode);
    // handleGetSelectProvince();
    getStatisticsData();
  }, [props.showModel]);

  // 获取省份、地市下拉框参数
  // const handleGetSelectProvince = () => {
  //   getCityCode().then((res: any) => {
  //     formItems[0].options = res;
  //   });
  // };

  return (
    <div className={styles['container']}>
      <Dialog
        modelVisible={props?.showModel}
        handleCancel={() => props?.handleCancel && props.handleCancel()}
        width='1200px'
        bodyStyle={{
          height: '740px'
        }}
        title='设备列表'
      >
        <div className={styles['searchRow']}>
          <MapSearch
            ref={mapSearchRef}
            formItems={formItems}
            defaultValue={defaultValue}
            handleSearch={handleSearch}
            handleChange={handleChange}
            formOptions={{
              gutter: 24,
              showResetBtn: false,
              showSearchBtn: true,
              btnDom: btnDom,
              searchMore: true
            }}
          />
        </div>
        <div className={styles['totalRow']}>
          {
            statisticsLoading
              ? <Spin tip='正在加载' style={{ width: '100%', paddingTop: '30px' }} />
              : <>
                <div className={styles['totalItem']}>
            <span
              className={`${styles['iconItem']} ${styles['ringIcon']}`}
            />
                  <div className={styles['textBox']}>
                    <div className={styles['title']}>5G成环数</div>
                    <span className={styles['value']}
                          title={totalData['circleCount'] ? totalData['circleCount'] : '-'}
                    >
                      {totalData['circleCount'] ? totalData['circleCount'] : '-'}
                    </span>
                  </div>
                </div>
                <div className={styles['totalItem']}>
            <span
              className={`${styles['iconItem']} ${styles['rateIcon']}`}
            />
                  <div className={styles['textBox']}>
                    <div className={styles['title']}>5G成环率</div>
                    <span
                      className={styles['value']}
                      title={totalData['circleRate'] ? totalData['circleRate'] + '%' : '-'}
                    >
                      {totalData['circleRate'] ? totalData['circleRate'] + '%' : '-'}
                    </span>
                  </div>
                </div>
                <div className={styles['totalItem']}>
            <span
              className={`${styles['iconItem']} ${styles['noRingIcon']}`}
            />
                  <div className={styles['textBox']}>
                    <div className={styles['title']}>5G不成环数</div>
                    <span
                      className={styles['value']}
                      title={totalData['nonCircleCount'] ? totalData['nonCircleCount'] : '-'}
                    >
                      {totalData['nonCircleCount'] ? totalData['nonCircleCount'] : '-'}
                    </span>
                  </div>
                </div>
                <div className={styles['totalItem']}>
            <span
              className={`${styles['iconItem']} ${styles['noRateIcon']}`}
            />
                  <div className={styles['textBox']}>
                    <div className={styles['title']}>5G不成环率</div>
                    <span
                      className={styles['value']}
                      title={totalData['nonCircleRate'] ? totalData['nonCircleRate'] + '%' : '-'}
                    >
                      {totalData['nonCircleRate'] ? totalData['nonCircleRate'] + '%' : '-'}
                    </span>
                  </div>
                </div>
              </>
          }
        </div>
        <div className={styles['tableBox']}>
          <Spin tip='正在加载' spinning={bbuListsLoading}>
            <Tables
              key={1}
              datas={bbuLists}
              pagination={{
                defaultCurrent: 1,
                pageSize: 5,
                size: 'small',
                showSizeChanger: false,
                showQuickJumper: false,
                showTitle: false
              }}
              column={tableColumn}
              scroll={{ x: 2000 }}
            />
          </Spin>
        </div>
      </Dialog>
      <DownloadDialog
        showModel={showDownLoadModel}
        bodyStyle={{
          height: '620px'
        }}
        style={{ top: '180px', background: '#000B27' }}
        handleCancel={() => {
          setShowDownModel(false);
        }}
      />
    </div>
  );
}

export default EquipmentFiveDialog;
