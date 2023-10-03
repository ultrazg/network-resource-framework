import { useEffect, useState, useRef, useCallback, useMemo, EffectCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import { getPageNetworkRoomCircuitList } from '@alpha/app/topic-tj/api/wireless';
import { getCityCode } from '@alpha/app/topic-tj/api/apiJson';
import { replaceProvinceName } from '@alpha/app/topic-tj/utils/commFunc';
import { setMapSelect, setMapSelectTopic } from '@alpha/app/redux/map.slice';
import { PointSetData } from '../components/map-view/mapUtil/mapLayer';
import { MapObject } from '../components/map-view/mapUtil/mapObject';
import { zCity } from '@alpha/app/topic-tj/utils/constants';
import wuxianItemLogo from './images/wuxianItemLogo.png';
import css from './wireless-mapView.module.scss';

import png from '../components/images/marker.png';
import { Eventer } from '../components/map-view/mapUtil/event';

// 引入地图插件
import MapView from '../components/map-view/map-view';
// 搜索列表
import MapListView from '../components/map-view/map-list/map-list';
// 主题选择
import MapSelectView from '../components/map-view/map-select/map-select';
// 需要显示的图例
import LegendSelectView from '../components/legend-view/legend-view';
// 资源上图右边浮窗详情
import RightBaseStationDetailView from './base-station-detail/base-station-detail';
// 基站成环右边浮窗详情
import RightBaseStationLoopinglView from './base-station-looping/base-station-looping';
import RightDetailsView from './right-details-view/right-details-view';

import { MapSummary, MapSummaryArray } from '../components/map-view/map-plugin/comp/map-summary/Summary';
import { getCountBaseStationInfo } from '../api/wirelessNetwork';
import { FormItem } from '../components/map-view/map-search/map-search';
import { LastInterface } from '../components/map-view/mapUtil/util';
import EquipmentFiveDialog from './equipment-five-dialog/equipment-five-dialog';

interface ListItemProps {
  item: {
    roomID: string;
    roomName: string;
    netWorks: string;
    roomLoopFlag: number;
    x: string;
    y: string;
    address: string;
  },
  activeId: string;
  handClick?: (item: any) => void;
  height?: number;
}

const ListItem = (props: ListItemProps) => {
  const item = props.item;
  return (
    <div className={`${css['itemContainer']} ${props.activeId == item.roomID && css['bgcStyle']}`}
         onClick={() => props.handClick && props.handClick(item)}>
      <div className={css['item-left']}>
        <img src={wuxianItemLogo} alt='' />
        {item.netWorks && <span className={css['topBox-level']}>{item.netWorks}</span>}
      </div>
      <div className={css['item-right']}>
        <div className={css['item-topBox']}>
          <span className={css['topBox-name']}>
            {item.roomName}
          </span>
          {item.roomLoopFlag >= 1 && <span className={css['topBox-level']}>{item.roomLoopFlag >= 1 ? '成环' : ''
          }</span>}
        </div>
        <div className={css['item-middle']}>
          <div className={css['middletext']}>经度：<span className='lng'>{item.x}</span></div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div className={css['middletext']}>纬度：<span className='lat'>{item.y}</span></div>
        </div>
        <div className={css['item-address']}>
          <span className={css['addresstext']}>地址：</span>{item.address}
        </div>
      </div>
    </div>
  );
};

export interface WirelessMapViewProps {
  provinceName?: string;
  rightDetailsDef: {
    tabVal: string;
    selectEqpId: string;
    roomDevType: string;
    roomID?: string;
  };
}

interface SearchParame {
  searchValue?: string;
  city?: string;
  nowRoomType?: number[];
  loopBBUNum?: string;
}

interface PageParame {
  pageNo: number | undefined;
  pageSize: number;
  total: number;
}

let mapFnObject: any;
let map: MapObject | null;
let currentTopic: number;
let currentRoomItem: ListItemProps['item'] | null;
let currentCityPicker: any;
let currentAreaCode: any;
let currentCityCode: string;

export function WirelessMapView(props: WirelessMapViewProps, state: any) {
  const mapListRef = useRef();
  const [showModel, setShowModel] = useState(false);
  const legendSvg = (type: number, isHeight = false) => {
    let types: any = {
      // 室外放置点
      1: 'OPP',
      // 机房
      2: 'huijujifang',
      // BBU
      3: 'BBU',
      // RRU
      4: 'RRU',
      // 承载机房
      5: 'BNMR'
    };

    return require(`../images/icons/${types[type as number]}${isHeight ? '-on' : ''}.svg`).default;
  };

  const topicList = [
    {
      label: '默认图例',
      value: 1,
      iconList: [
        {
          imgStyle: {
            src: legendSvg(1)
          },
          legendName: '室外放置点',
          type: 'svg'
        },
        {
          imgStyle: {
            src: legendSvg(2)
          },
          legendName: '机房',
          type: 'svg'
        }
      ]
    },
    {
      label: 'BBU',
      value: 1,
      iconList: [
        {
          imgStyle: {
            src: legendSvg(3)
          },
          legendName: '室外放置点',
          type: 'svg'
        },
        {
          imgStyle: {
            src: legendSvg(2)
          },
          legendName: '机房',
          type: 'svg'
        },
        {
          imgStyle: {
            src: legendSvg(3)
          },
          legendName: 'BBU',
          type: 'svg'
        },
        {
          imgStyle: {
            src: legendSvg(4)
          },
          legendName: 'RRU',
          type: 'svg'
        }
      ]
    },
    {
      label: 'RRU',
      value: 1,
      iconList: [
        {
          imgStyle: {
            src: legendSvg(3)
          },
          legendName: '室外放置点',
          type: 'svg'
        },
        {
          imgStyle: {
            src: legendSvg(2)
          },
          legendName: '机房',
          type: 'svg'
        },
        {
          imgStyle: {
            src: legendSvg(4)
          },
          legendName: 'RRU',
          type: 'svg'
        }
      ]
    },
    {
      label: '基站',
      value: 1,
      iconList: [
        {
          imgStyle: {
            src: legendSvg(3)
          },
          legendName: '室外放置点',
          type: 'svg'
        },
        {
          imgStyle: {
            src: legendSvg(2)
          },
          legendName: '机房',
          type: 'svg'
        },
        {
          imgStyle: {
            src: legendSvg(5)
          },
          legendName: '承载网设备机房',
          type: 'svg'
        },
        {
          iconName: 'icon-biaoshi',
          iconColor: '#FFDE00',
          legendName: '汇聚层',
          type: 'line'
        },
        {
          iconName: 'icon-duijie',
          iconColor: '#8856D9',
          legendName: '接入层/汇聚层',
          type: 'line'
        }
      ]
    }
  ];
  const reduxMapResource = useSelector(
    (state: any) => state.reduxMapResource
  );
  const dispatch = useDispatch();
  const mapSelectRef = useRef();

  var [options, setOptions] = useState<{ mode: number, city: string }>({
    // 模式 0 省级  1 市级  2 打点
    mode: 1,
    // 地市code
    city: ''
  });

  const [center, setCenter] = useState<any>(null);
  const [isShow, setIsShow] = useState(true);
  const [searchOver, setSearchOver] = useState(false);
  const [isLegendListShow, setIsLegendListShow] = useState(false);
  const [iconList, setLegendList] = useState(topicList[0].iconList || []);
  const [formItems, setFormItems] = useState<FormItem[]>([{
    props: 'cityId',
    span: 24,
    formType: 'cityPicker',
    districtList: []
  }, {
    formType: 'inputSearch',
    props: 'searchValue',
    span: 24,
    placeholder: '请输入名称',
    labelCol: {
      span: 0,
      offset: 0
    },
    searchType: {
      props: 'searchType',
      options: [
        {
          label: '机房名称',
          value: '1'
        }
      ]
    }
  }, {
    props: 'nowRoomType',
    formType: 'select',
    mode: 'multiple' as any,
    span: 12,
    options: [
      { label: '2G', value: 2 },
      { label: '3G', value: 3 },
      { label: '4G', value: 4 },
      { label: '5G', value: 5 }
    ],
    placeholder: '网络类型'
  }, {
    props: 'loopBBUNum',
    formType: 'select',
    span: 12,
    options: [
      { value: '1', label: '成环' },
      { value: '0', label: '不成环' }
    ],
    placeholder: '成环类型'
  }]);
  const defaultValue = {
    searchValue: '',
    city: '',
    nowRoomType: [],
    loopBBUNum: undefined,
    searchType: '1'
  };

  const [datas, setDatas] = useState([]);

  // 设置右边详情默认值
  // const [rightDetailsDef, setRightDetailsDef] = useState({
  //   tabVal: props.rightDetailsDef?.tabVal, // 1显示的是基本信息， 2显示的是无线设备tab
  //   selectEqpId:  props.rightDetailsDef?.selectEqpId, // 需要选中的设备ID
  //   roomDevType:  props.rightDetailsDef?.roomDevType // 基站-->GM, RRU-->RRU， BBU-->BBU // 是那个类型的设备
  // })
  const [isListShow, setIsListShow] = useState(false);
  const initialRoomItem = {
    roomID: '',// props.rightDetailsDef.roomID
    roomName: '',
    netWorks: '',
    roomLoopFlag: 0,
    x: '',
    y: '',
    address: ''
  };
  const [roomItem, setRoomItem] = useState<ListItemProps['item']>(initialRoomItem);
  const [searchParames, setSearchParames] = useState<SearchParame>();
  const [page, setPage] = useState<PageParame>({
    pageNo: undefined,
    pageSize: 800,
    total: 0
  });
  const [cityPicker, setCityPicker] = useState<any>([{
    name: '',
    id: ''
  },
    {
      name: '',
      id: ''
    },
    {
      name: '',
      id: ''
    }]);
  const [mapLevel, setMapLevel] = useState<number>(2);
  const [currentProvince, setCurrentProvince] = useState<any>(props.provinceName);

  useEffect(() => {

    // 调用地图的loadMap事件
    Eventer.$getEmit('地图组件', 'loadMap', loadMap);
    handleGetCityCode();
    return () => {
      if (map) {
        map.clear('pointLayer');
        map.clear('heightPointLayer');
      }
      mapFnObject = undefined;
      map = null;
      currentTopic = 0;
      currentRoomItem = null;
      currentAreaCode = '';
      currentCityCode = '';
      dispatch(setMapSelect({ areaCode: '', provinceName: '' }));
      dispatch(setMapSelectTopic(topicList[0].value));
    };
  }, []);
  // 省市区选择器列表，匹配联通地图信息，只请求一次就可以
  const handleGetCityCode = () => {
    getCityCode().then((data: any) => {
      let formItemsVal: any = [...formItems];
      formItemsVal[0].districtList = data;
      setFormItems(formItemsVal);
    });
  };
  useEffect(() => {
    currentCityPicker = cityPicker;
    console.log('currentCityPicker', currentCityPicker);
    if (cityPicker[0].name) {
      const zCityCheck = zCity.findIndex(cityName => (replaceProvinceName(cityPicker[1].name) === replaceProvinceName(cityName)) || (replaceProvinceName(cityPicker[0].name) === replaceProvinceName(cityName)));
      const provinceName = (zCityCheck === -1) ? (cityPicker[1].name || cityPicker[0].name) : cityPicker[0].name;
      setCurrentProvince(provinceName);
      setMapLevel((cityPicker[1].name && zCityCheck === -1) ? 2 : 1);
      if (!!cityPicker[2] && cityPicker[2].id !== null) {
        getSearchWirelessData();
      }
    }
  }, [cityPicker]);
  useEffect(() => {
    currentTopic = reduxMapResource.mapSelect.topic;
  }, [reduxMapResource.mapSelect.topic]);
  useEffect(() => {
    currentRoomItem = roomItem;
  }, [roomItem]);
  useEffect(() => {
    if (searchParames) {
      getSearchWirelessData();
    }
  }, [searchParames, page.pageNo, page.pageSize]);
  useEffect(() => {
    if (page.pageNo && page.pageSize) {
      getSearchWirelessData();
    }
  }, [page.pageNo, page.pageSize]);

  useEffect(() => {
    map?.clear('pointLayer');
    map?.clear('heightPointLayer');
    mapFnObject && mapFnObject.hideTitle();
    if (map && datas.length > 0 && options.mode == 2) {
      showPoint();
    }
  }, [datas]);

  useEffect(() => {
    if (options.mode === 2) {
      setCurrentProvince(options.city);
      setMapLevel(2);
      showPoint();
    } else if (options.mode === 1) {
      setCurrentProvince(options.city);
      setMapLevel(1);
      // const e = center || {};
      // if(e.province && e.province.attr && (e.province.attr.code !== currentAreaCode)) {
      //   const areaCode = (`${e.province.attr.code}`).padEnd(12, '0');
      //   dispatch(setMapSelect({ areaCode: areaCode, provinceName: e.province.attr.name}));
      //   currentAreaCode = areaCode
      //   changeCity(e.province.attr.name, e.province.attr.code)
      //   getSearchWirelessData()
      //   if( options.mode == 1 ){
      //     getWirelessCityData();
      //   }
      // }
    }
  }, [options.mode]);


  const handlePointImage = (type: number, isHeight = false) => {
    let types: any = {
      // 室外放置点
      1: 'OPP',
      // 机房
      2: 'huijujifang',
      // BBU
      3: 'BBU',
      // RRU
      4: 'RRU',
      // 承载机房
      5: 'BNMR'
    };
    return require(`../images/icons/${types[type as number]}${isHeight ? '-on' : ''}.png`);
  };

  // 显示地图打点
  const showPoint = function() {
    let points: any[] = [];
    let heightPoints: any[] = [];
    if (!map) return;
    if (reduxMapResource.mapSelect.topic == 1) {
      datas.forEach((item: PointSetData, index) => {
        points.push(setPoint({ x: item.x, y: item.y, attr: item }));
      });
      if (roomItem?.roomID) {
        heightPoints.push(setPoint({ x: roomItem.x, y: roomItem.y, attr: roomItem, isHeight: true }));
        showHeightTitle({
          ...roomItem
        });
      }
      map.setPoints(points, 'pointLayer');
      map.setPoints(heightPoints, 'heightPointLayer');
    } else {
      if (roomItem?.roomID) {
        heightPoints.push(setBaseStationLoopPoint({ x: roomItem.x, y: roomItem.y, attr: roomItem, isHeight: true }));
        map.setPoints(heightPoints, 'heightPointLayer');
        showHeightTitle({
          ...roomItem
        });
      } else {
        datas.forEach((item: PointSetData, index) => {
          points.push(setBaseStationLoopPoint({ x: item.x, y: item.y, icon: png, attr: item }));
        });
        map.setPoints(points, 'pointLayer');
      }
    }
  };

  // 地图打点 (资源上图) // positTypeId 2080004   室外放置点、2080001  机房
  const setPoint = ({ x, y, attr, isHeight = false }: any) => {
    let icon = '';
    if (attr.positTypeId === '2080004') { // 室外放置点
      icon = handlePointImage(1, isHeight);
    } else { // 机房
      icon = handlePointImage(2, isHeight);
    }
    return {
      x,
      y,
      icon,
      attr,
      width: 40,
      height: 40
    };
  };
  // 基站成环的地图打点
  const setBaseStationLoopPoint = ({ x, y, attr, isHeight = false }: any) => {
    let iconName = '';
    if (attr.roomLoopFlag >= 1) { // 如果大于等于1，那么就是成环的
      iconName = '#icon-jifang4';
    } else {
      iconName = '#icon-hepeijifang';
    }
    let iconSvg: any = '';
    if (isHeight) {
      iconName = '#icon-xuanzhongjifang';
    }
    iconSvg = iconName.split('-');
    const icon = require(`../images/icons/${iconSvg[1]}.png`);
    return {
      x,
      y,
      icon,
      attr,
      width: 28,
      height: 26
    };
  };
  const RightBaseStationLoopingRef = useRef();
  const handleSearch = (parames: any) => {
    setRoomItem({
      roomID: '',
      roomName: '',
      netWorks: '',
      roomLoopFlag: 0,
      x: '',
      y: '',
      address: ''
    });
    if (reduxMapResource.mapSelect.topic === 2) {
      const clearPointAndLine = (RightBaseStationLoopingRef.current as any) && (RightBaseStationLoopingRef.current as any).clearPointAndLine as any;
      clearPointAndLine && clearPointAndLine();
    }
    setSearchParames(parames);
    setIsListShow(true);
  };
  const handleChange = (parames: any) => {
    setSearchParames(parames);
  };

  const clearWirelessCityData = function() {
    mapFnObject.removePlugin('liao');
  };

  // 绘制地市汇总信息
  const getWirelessCityData = LastInterface(() => {
    // 首先获取当前省份下面的地市信息
    return Promise.all([window.mapView.getCenterProvinceAndCity(), getCountBaseStationInfo({
      code: center.province.attr.code,
      name: center.province.attr.name
    })]).then(([e, data]: any[]) => {

      mapFnObject.removePlugin('liao');

      setTimeout(() => {
        mapFnObject.addPlugin(<MapSummaryArray onClick={MapSummaryArrayClick} key={'liao'}
                                               datas={(['500000000000', '310000000000', '110000000000', '120000000000'].indexOf(e.province.attr.code) > -1 ? [e.province] : e.province.cityPolygon).map((e: any) => {
                                                 const d = data.data.wirelessResourcesDtos.find((ea: any) => {
                                                   return ea.cityName.indexOf(e.attr.name) > -1;
                                                 }) || data.data.wirelessResourcesDtos[0];
                                                 // const ary = [];
                                                 // for( var i in d ){
                                                 //   ary.push({ name: i, value: d[i] });
                                                 // }
                                                 const ary = [
                                                   { name: '2G基站', value: d.stationNum2g || '0' },
                                                   { name: '3G基站', value: d.stationNum3g || '0' },
                                                   { name: '4G基站', value: d.stationNum4g || '0' },
                                                   { name: '5G基站', value: d.stationNum5g || '0' }
                                                 ];
                                                 return {
                                                   titleNum: eval(ary.map((e) => {
                                                     return e.value * 1;
                                                   }).join('+')),
                                                   title: e.attr.name,
                                                   datas: ary,
                                                   point: e.polygon.getBounds().getCenter(),
                                                   code: e.attr.serveCode
                                                 };
                                               })
                                               }></MapSummaryArray>);
      }, 300);
    });
  });
  // const getWirelessCityData = ()=> {
  //   // 首先获取当前省份下面的地市信息
  //   return Promise.all([window.mapView.getCenterProvinceAndCity(), getCountBaseStationInfo({ code: center.province.attr.code , name: center.province.attr.name })]).then(([e, data]: any[])=>{

  //     mapFnObject.removePlugin("liao");

  //     setTimeout(()=>{
  //       mapFnObject.addPlugin(<MapSummaryArray onClick={MapSummaryArrayClick} key={ "liao" } datas={ e.province.cityPolygon.map((e: any)=> {
  //           const d = data.data.find((ea: any)=>{ return e.attr.name.indexOf(ea.cityName) > -1 });
  //           const ary = [];
  //           for( var i in d ){
  //             ary.push({ name: i, value: d[i] });
  //           }
  //           return { title: e.attr.name ,datas: ary , point: e.polygon.getBounds().getCenter(), code: e.attr.serveCode }
  //         })
  //       } ></MapSummaryArray>)
  //     }, 300)
  //   })
  // }

  // 弹出5G基站弹窗
  const show5GJizhan = function() {
    console.log('显示5G基站弹窗');
    setShowModel(true);
  };

  const MapSummaryArrayClick = function(attr: any, row: any) {
    if (row) {
      if (row.name == '5G基站') show5GJizhan();
      return;
    }
    // 关闭
    clearWirelessCityData();
    // 改变模式
    setOptions({ mode: 2, city: attr.title });
    // 根据点击目标来缩放区域
    window.mapView.centerAndZoom(attr.point.lng, attr.point.lat, 8);
  };

  // 获取列表数据
  const getSearchWirelessData = (params: any = {}) => {
    let provinceCode = reduxMapResource.mapSelect.areaCode;
    if (provinceCode == null || provinceCode == undefined) return;
    let param = {
      'data': {
        cityId: currentCityPicker[1] === '' ? '' : (reduxMapResource.mapSelect.cityId || currentCityPicker[1].id), // this.city,
        regionId: currentCityPicker[2].id,
        network: searchParames?.nowRoomType || [],
        roomName: searchParames?.searchValue || '',
        loopBBUNum: searchParames?.loopBBUNum
      },
      'pageNo': page.pageNo || 1,
      'pageSize': page.pageSize
    };
    setSearchOver(true);
    debouceRequest(param);
  };
  const handleList = _.debounce((param: any) => {
    getPageNetworkRoomCircuitList(param).then(res => {
      const { data, code } = res;
      if (code == '200') {
        setSearchOver(false);
        setDatas(data.data);
        setPage({
          ...page,
          total: data.total
        });

        if (props.rightDetailsDef.roomID) {
          data.data.forEach((item: any) => {
            console.log(item.roomID == props.rightDetailsDef.roomID);
            if (item.roomID == props.rightDetailsDef.roomID) { // 模拟一次点击
              handListClick(item);
              setIsListShow(true);
            }
          });
        }
      }
    });
  }, 500);
  const debouceRequest = useCallback(data => handleList(data), []);
  // 动态切换图例
  // const handleSelect = (topic: number) => {
  //   const topicIndex = topicList.findIndex(item => item.value === topic);
  //   setLegendList(topicList[topicIndex].iconList)
  //   if ((topic === 2 && !roomItem.roomID) || topic === 1) {
  //     getSearchWirelessData()
  //   }
  //   if (topic === 1) {
  //     const clearPointAndLine = (RightBaseStationLoopingRef.current as any) && (RightBaseStationLoopingRef.current as any).clearPointAndLine as any
  //     clearPointAndLine && clearPointAndLine()
  //     map && mapBingChange(map);
  //   }
  // }
  const handlePageChange = (pageNo: any, pageSize: number) => {
    setPage({
      ...page,
      pageNo: pageNo,
      pageSize: pageSize
    });
  };

  const handListClick = (item: ListItemProps['item']) => {
    setRoomItem(item);
    map?.clear('heightPointLayer');
    if (reduxMapResource.mapSelect.topic == 1) {
      map?.setPoints([setPoint({ x: item.x, y: item.y, attr: item, isHeight: true })], 'heightPointLayer');
      map?.centerAndZoom(item.x, item.y, 12);
      showHeightTitle({
        ...item
      });
    } else {
      map?.setPoints([setBaseStationLoopPoint({
        x: item.x,
        y: item.y,
        attr: item,
        isHeight: true
      })], 'heightPointLayer');
      showHeightTitle({
        ...item
      });
      if (item.roomLoopFlag < 1) {
        map?.centerAndZoom(item.x, item.y, 12.5);
      }
    }
  };
  const showHeightTitle = (item: any) => {
    // 显示标题
    mapFnObject && mapFnObject.showTitle([item.x, item.y], item.roomName);
  };

  useEffect(() => {
    const e = center || {};
    const zCityCheck = zCity.findIndex(cityName => replaceProvinceName(e.province?.attr.name) === replaceProvinceName(cityName));
    if (currentTopic === 2 && !!currentRoomItem && !!currentRoomItem.roomID) return;
    if (zCityCheck === -1 && (mapLevel === 2 && !e.cList)) return;
    console.log('e', e, currentAreaCode, currentCityCode);
    if (e.province && e.province.attr && (e.province.attr.code !== currentAreaCode || e.city?.attr.cityId !== currentCityCode)) {
      // 当省份变化时，切换模式
      if (e.province.attr.code !== currentAreaCode) {
        setOptions({ mode: 1, city: e.province.attr.name });
        getSearchWirelessData();
        getWirelessCityData();
      }
      setRoomItem(initialRoomItem);
      const areaCode = (`${e.province.attr.code}`).padEnd(12, '0');
      const cityCode = (e.city?.attr?.cityId && `${e.city?.attr?.cityId}`);
      dispatch(
        setMapSelect({
          areaCode: areaCode,
          provinceName: e.province?.attr.name,
          cityId: cityCode,
          cityName: e.city?.attr.name
        })
      );
      currentAreaCode = areaCode;
      currentCityCode = cityCode;
      const attrName = (zCityCheck === -1) ? e.city?.attr.name : e.province?.attr.name;
      const cityName = (mapLevel === 1 || currentCityPicker[1] === '') ? '' : attrName;
      const cityId = (mapLevel == 1 || currentCityPicker[1] === '') ? '' : cityCode;
      const districtName = (mapLevel === 1 || currentCityPicker[2] === '') ? '' : currentCityPicker[2].name;
      const districtId = (mapLevel === 1 || currentCityPicker[2] === '') ? '' : currentCityPicker[2].id;
      const currentRef = (mapListRef && mapListRef.current) as any;
      currentRef && currentRef.onSearchFields && currentRef.onSearchFields();
      currentRef && currentRef.setPlaceSelected && currentRef.setPlaceSelected([{
        name: e.province?.attr.name,
        id: areaCode
      }, {
        name: cityName,
        id: cityId
      }, {
        name: districtName,
        id: districtId
      }]);
      // if( options.mode == 1 ){
      // }
      // setOptions({ mode: 1, city: "" })
    }
  }, [center]);

  // 地图变化绑定事件
  const mapBingChange = (mapObject: MapObject) => {
    mapObject.onChange((e: any) => {
      // if (currentTopic === 2 && !!currentRoomItem && !!currentRoomItem.roomID) return;
      // if (e.province && e.province.attr && (e.province.attr.code !== currentAreaCode)) {
      //   setRoomItem(initialRoomItem);
      //   const areaCode = (`${e.province.attr.code}`).padEnd(12, '0');
      //   dispatch(setMapSelect({ areaCode: areaCode, provinceName: e.province.attr.name }));
      //   currentAreaCode = areaCode
      //   changeCity(e.province.attr.name, e.province.attr.code)
      //   getSearchWirelessData()
      // }
      setCenter(e);
    });
    mapObject.onclick((e: any) => {
      handListClick(e.attr);
    });
  };
  // 点击列表收缩
  const handleRecovery = (recovery: boolean) => {
    setIsLegendListShow(recovery);
  };
  const mapViewRef = useRef();
  const mapDomRef = useCallback((ref) => {
    if (ref !== null) {
      mapViewRef.current = ref;
    }
  }, []);
  const loadMap = (mapObject: MapObject, fnObject: any) => {

    map = mapObject;
    mapFnObject = fnObject;
    mapBingChange(mapObject);

    // mapFnObject.addPlugin(<MapSummaryArray key={ "liao" } datas={ [
    //   {title:'ceshibiaoti' ,datas: [{ name: "测试", value: "123456"}] , point: new BMapGL.Point(127.06641568767478, 48.27976555411721) },
    //   {title:'ceshibiaoti123' ,datas: [{ name: "测试1", value: "123456"}] , point: new BMapGL.Point(128.84841297171565, 47.12986996426503) },
    // ] } ></MapSummaryArray>)

  };


  // const MapViewMemo = useMemo(() => <MapView loadMap={loadMap} provinceName={props.provinceName} ref={mapDomRef}></MapView>, [])
  const handleChangePlace = (e: any) => {
    if (e[0].name) {
      setCityPicker(e);
    }
  };

  // 动态设置图例显示
  const setLengendType = (devType: string) => {
    topicList.forEach((list) => {
      if (list.label === devType) {
        setLegendList(list.iconList);
      }
    });
  };

  useEffect(() => {
    setCurrentProvince(props.provinceName);
    setDatas([]);
    setMapLevel(1);
    setPage({
      pageNo: undefined,
      pageSize: 800,
      total: 0
    });
    setIsListShow(false);
    setRoomItem(initialRoomItem);
    setLegendList(topicList[0].iconList || []);
    const changeTopic = (mapSelectRef.current as any) && (mapSelectRef.current as any).changeTopic as any;
    changeTopic && changeTopic(topicList[0]);
    const currentRef = (mapListRef && mapListRef.current) as any;
    currentRef && currentRef.onSearchFields && currentRef.onSearchFields();
    if(props.provinceName) {
      getSearchWirelessData();
    }
  }, [props.provinceName]);

  return (
    <div className={css['container']}>
      <MapView
        loadMap={loadMap}
        provinceName={currentProvince}
        ref={mapDomRef}
        mapLevel={mapLevel}
      ></MapView>
      <MapListView
        ref={mapListRef}
        isShow={isShow}
        searchOver={searchOver}
        recoveryShow={true}
        formSearchOptions={{
          gutter: 20,
          showMoreBtn: true,
          showResetBtn: false,
          showSearchBtn: true,
          searchListMore: isListShow
        }}
        listItem={
          isListShow &&
          datas &&
          datas.map((listItem: ListItemProps['item']) => {
            return (
              <ListItem
                key={listItem.roomID}
                item={listItem}
                activeId={roomItem?.roomID}
                height={117}
                handClick={(item) => handListClick(item)}
              />
            );
          })
        }
        listSearch={{
          formItems: formItems,
          defaultValue: defaultValue,
          handleSearch: (parames) => handleSearch(parames),
          handleChange: (parames) => handleChange(parames),
          handleChangePlace: (parames) => handleChangePlace(parames),
          handleListMore: () => setIsListShow(!isListShow)
        }}
        pageSize={{
          total: page.total,
          pageNo: page.pageNo || 1,
          pageSize: page.pageSize,
          onChange: (page, pageSize) => handlePageChange(page, pageSize)
        }}
        handleRecovery={handleRecovery}
      />
      {/* <MapSelectView
        ref={mapSelectRef}
        topicList={topicList}
        topic={reduxMapResource.mapSelect.topic}
        handleSelect={handleSelect}
      /> */}
      <LegendSelectView iconList={iconList} left={isListShow && !isLegendListShow ? '420px' : '15px'} />

      {
        !!roomItem.roomID && <RightDetailsView
          roomName={roomItem.roomName}
          roomID={roomItem.roomID}
          map={map}
          mapFnObject={mapFnObject}
          topic={reduxMapResource.mapSelect.topic}
          rightDetailsDef={props.rightDetailsDef}
          left={isListShow && !isLegendListShow ? '460px' : '60px'}
          setLengendType={setLengendType}
        />
      }

      {/* {
        (reduxMapResource.mapSelect.topic ===1 && !!roomItem.roomID) &&
        <RightBaseStationDetailView
          roomName={roomItem.roomName}
          roomID={roomItem.roomID}
          map={map}
          topic={reduxMapResource.mapSelect.topic}
        />
      }
      { (reduxMapResource.mapSelect.topic ===2 && !!roomItem.roomID) &&
        <RightBaseStationLoopinglView
            ref={RightBaseStationLoopingRef}
            roomName={roomItem.roomName}
            roomID={roomItem.roomID}
            mapObj={map}
            mapFnObject={mapFnObject}
            topic={reduxMapResource.mapSelect.topic} />
      } */}

      {
        showModel
          ? <EquipmentFiveDialog
            showModel={true}
            handleCancel={() => {
              setShowModel(false);
            }}
          />
          : null
      }

    </div>
  );
}

export default WirelessMapView;
