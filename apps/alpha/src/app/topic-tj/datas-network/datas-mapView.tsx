import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import { queryDataNetworkRoomList, queryCircuitRouteList, getRoomToBldgList, fetchStatesCodeList, getWgsBldgList } from '@alpha/app/topic-tj/api/datasNetwork';
import { NET_TYPE, SYS_LEVEL, DATAS_ROOM_TYPE } from '@alpha/app/topic-tj/utils/constants';
import { replaceProvinceName } from '@alpha/app/topic-tj/utils/commFunc'
import { setMapSelect, setMapSelectTopic } from '@alpha/app/redux/map.slice';
import { PointSetData } from '../components/map-view/mapUtil/mapLayer';
import { MapObject } from '../components/map-view/mapUtil/mapObject';
import {
  OptionObj,
} from '@alpha/app/topic-tj/components/map-view/city-picker/city-picker';
import shujuItemLogo from './images/shujuItemLogo.png'
import css from './datas-mapView.module.scss';
// 引入地图插件
import MapView from '../components/map-view/map-view';
// 搜索列表
import MapListView from '../components/map-view/map-list/map-list';
// 主题选择
import MapSelectView from '../components/map-view/map-select/map-select';
// 需要显示的图例
import LegendSelectView from '../components/legend-view/legend-view';
import { Dialog } from '@alpha/app/topic-tj/components/dialog';
import DeviceList from '@alpha/app/topic-tj/datas-network/components/device-list/device-list';
import ResourcesDetailDialog from '@alpha/app/topic-tj/datas-network/resources-detail-dialog/resources-detail-dialog';
import RoomDetailDialog from '@alpha/app/topic-tj/datas-network/room-detail-dialog/room-detail-dialog';
import styled from 'styled-components';

// 资源覆盖弹窗
import ZyfgDialog from "./components/building-info-modal/building-info-modal"
import { MapPointList } from '../components/map-view/map-plugin/comp/map-pointList/PointList';

// import { jierujifangSvg, jieruHeightSvg, huijuSvg, huijuHeightSvg, hexinSvg, hexinHeightSvg, shiwaiSvg, shiwaiHeight, louyuSvg, louyuHeightSvg} from './components/utils'
export interface ListItemProps {
  item: {
    ROOM_ID: string;
    roomName: string;
    netWorks: string;
    roomLoopFlag: number;
    x: string;
    y: string;
    address: string;
    china_name: string;
    roomtypename: string
  },
  activeId: string;
  handClick?: (item: any) => void;
  height?: number;
}
const ListItem = (props: ListItemProps) => {
  const item = props.item
  return (
    <div className={`${css['itemContainer']} ${props.activeId == item.ROOM_ID && css['bgcStyle']}`} onClick={() => props.handClick && props.handClick(item)}>
      <div className={css['item-left']}>
        <img src={shujuItemLogo} alt="" />
      </div>
      <div className={css['item-right']}>
        <div className={css['item-topBox']}>
          <span className={css['topBox-name']}>
            {item.china_name}
          </span>
        </div>
        <div className={css['item-address']} title={item.address}>
          <span className={css['addresstext']}>地址：</span>{item.address}
        </div>
        <div className={css['item-type']}>
          {item.roomtypename || '本地城域网IP网汇聚层机房'}
        </div>
      </div>
    </div>
  )
}

export interface DatasMapViewProps {
  provinceName?: string;
  eqpName?: string;
}
interface SearchParame {
  searchValue: string;
  regionId: string;
  netLevel: number;
  belongNetwork: string;
  typeId: string;
  searchType: string;
}
interface PageParame {
  pageNo: number | undefined;
  pageSize: number;
  total: number;
}

 // 画线的方法
 const handleSetLine = (parentX: string, parentY: string, x: string, y: string, attr: any, strokeColor = "#1AE0CD", lineType = "solid") => {
  return { points: [[parentX, parentY], [x, y]], attr, color: strokeColor, width: 3 };
}
const forList = (startItem: any, lists: any[]) => {
  let pointDatas: any[] = [];
  let lineDatas: any[] = [];
  lists.forEach((list: any) => {
    pointDatas.push(setPoint({ x: list.wgsX, y: list.wgsY, attr: {...list, roomtypeid: getRoomTypeId(list)} }));
    lineDatas.push(handleSetLine(
      startItem.x || startItem.wgsX,
      startItem.y || startItem.wgsY,
      list.wgsX,
      list.wgsY,
      {start: startItem, end: list},
      "#11B0FF",
      "solid"
    ));
    if(list.grandList && list.grandList.length > 0) {
      const { points, lines } = forList(list, list.grandList)
      pointDatas.push(...points)
      lineDatas.push(...lines)
    }
  });
  return {
    points: pointDatas,
    lines: lineDatas
  }
}

  // 点图片
  const handlePointImage = (type: number, isHeight = false) => {
    // let types: any = {
    //     // 接入机房
    //     // 4: 'jierujifang',
    //     4: {
    //       normal: jierujifangSvg,
    //       height: jieruHeightSvg
    //     },
    //     // 汇聚
    //     // 3: 'huiju',
    //     3: {
    //       normal: huijuSvg,
    //       height: huijuHeightSvg
    //     },
    //     // 核心
    //     // 2: 'hexin',
    //     2: {
    //       normal: hexinSvg,
    //       height: hexinHeightSvg
    //     },
    //     // 骨干
    //     1: {
    //       normal: shiwaiSvg,
    //       height: shiwaiHeight
    //     },
    //     // 楼宇
    //     5: {
    //       normal: louyuSvg,
    //       height: louyuHeightSvg
    //     }
    // }
    // return types[type as number][isHeight ? 'height' : 'normal'];
    let types: any = {
      // 接入机房
      4: 'jierujifang',
      // 汇聚
      3: 'huiju',
      // 核心
      2: 'hexin',
      // 骨干
      1: 'shiwai',
      // 楼宇
      5: 'louyu',
  }
    return require(`./images/icons/${types[type as number]}${isHeight ? 'Height' : ''}.png`);
  }

  const legendImage = (type: number, isHeight = false) => {
    let types: any = {
        // 接入机房
        4: 'jierujifang',
        // 汇聚
        3: 'huiju',
        // 核心
        2: 'hexin',
        // 骨干
        1: 'shiwai',
        // 楼宇
        5: 'louyu',
    }

    return require(`./images/icons/${types[type as number]}${isHeight ? 'Height' : ''}.svg`).default;
  }

// 地图打点 (资源上图)
const setPoint = ({x, y, attr, isHeight = false}: any) => {
    let newAttr =  attr.roomtypeid
    let newAttrLen: any = {
        '1': handlePointImage(1, isHeight),
        '2': handlePointImage(2, isHeight),
        '3': handlePointImage(3, isHeight),
        '4': handlePointImage(4, isHeight),
    }
    let iconSvg = newAttrLen[newAttr]
    let width = 40;
    let height = 44;
    if(isHeight) {
      width = 40;
      height = 44; 
    }
    return {
      x,
      y,
      icon: iconSvg,
      attr,
      width,
      height,
    };
  }
// 定义机房类型
const getRoomTypeId = (item: any) => {
  const index = DATAS_ROOM_TYPE.findIndex(type => type.ids.indexOf(item.typeId) > 0)
  return index > -1 ? DATAS_ROOM_TYPE[index].value : '4'
}


const TitleContent = styled.div`
  border: solid 1px #004796;
  background: #071B3B;
  color: #ffffff;
  padding: 6px 8px;
  display: flex;
  align-items: center;

  .type {
    padding: 1px 8px;
    color: #00FCFF;
    background: linear-gradient(90deg, transparent, #639ebd, transparent);
    font-size: 12px;
    margin-right: 8px;
  }
`;

let mapFnObject: any;
let map: MapObject | null;
let currentAreaCode: string;
let currentCityCode: string;
let currentTopic: number;
let currentRoomItem: ListItemProps['item'] | null;
let currentDefaultValue: any;
// let currentProvince: any;
let currentSearchParames: any;
let currentMapLevel: any;
let currentCityPicker: any;

let newTime = new Date();
export function DatasMapView(props: DatasMapViewProps) {
  const mapListRef = useRef();
  const topicList = [
    {
      label: '资源上图',
      icon: 'ziyuanshangtu',
      value: 1,
    },
    {
      label: '资源拓扑',
      icon: 'ziyuantuopu',
      value: 2,
    },
    {
      label: '资源覆盖',
      icon: 'ziyuanfugai',
      value: 3,
    }
  ];
  const reduxMapResource = useSelector(
    (state: any) => state.reduxMapResource
  );
  const dispatch = useDispatch();
  const mapSelectRef = useRef();
  const [deviceListShow, setDeviceListShow] = useState(false)
  const [searchOver, setSearchOver] = useState(false)
  const [zyfgShow,setZyfgShow] = useState(false);
  const [zyfgLocation,setZyfgLocation] = useState<{x: "", y: ""}>({ x: "", y: "" });
  const [bldgId,setBldgId] = useState('');
  const [provinceCode,setProvinceCode] = useState('');
  const [clearText, setClearText] = useState('');
  const zCity = ['北京市', '天津市', '上海市', '重庆市'];
  const iconList = [
    {
      imgStyle: {
        src: legendImage(4)
      },
      legendName: '接入机房',
      type: 'svg'
    },
    {
      imgStyle: {
        src: legendImage(3)
      },
      legendName: '汇聚机房',
      type: 'svg'
    },
    {
      imgStyle: {
        src: legendImage(2)
      },
      legendName: '核心机房',
      type: 'svg'
    },
    {
      imgStyle: {
        src: legendImage(1)
      },
      legendName: '骨干机房',
      type: 'svg'
    },
    {
      imgStyle: {
        src: legendImage(5)
      },
      legendName: '楼宇',
      type: 'svg'
    },
  ]
  const [searchParames, setSearchParames] = useState<SearchParame | null>()
  const [defaultValue, setDefaultValue] = useState<any>({
    searchValue: undefined,
    regionId: undefined,
    netLevel: undefined,
    belongNetwork: undefined,
    typeId: undefined,
    searchType:  props.eqpName ? '1' : '2'
});
  const [formItems, setFormItems] = useState([{
    props: 'cityId',
    span: 24,
    formType: 'cityPicker',
    districtList: []
  }, {
      formType: 'inputSearch',
      props: 'searchValue',
      span: 24,
      placeholder: `请输入${defaultValue?.searchType === '1' ? '设备' : '机房'}名称关键字`,
      labelCol: {
          span: 0,
          offset: 0
      },
      searchType: {
        props: 'searchType',
        options: [{
          label: '设备名称',
          value: '1'
        }, {
          label: '机房名称',
          value: '2'
      }]
      }
  },
  // {
  //     props: 'regionId',
  //     formType: 'select',
  //     span: 8,
  //     options: [],
  //     placeholder: '区域'
  // }, 
  {
      props: 'belongNetwork',
      formType: 'select',
      span: 12,
      options: NET_TYPE,
      placeholder: '所属网络'
  },
  {
    props: 'netLevel',
    formType: 'select',
    span: 12,
    options: SYS_LEVEL,
    placeholder: '网络层次'
  },
  ])
  const [datas, setDatas] = useState([])
  const [isListShow, setIsListShow] = useState(false)
  const [isLegendListShow, setIsLegendListShow] = useState(false)
  const initialRoomItem = {
    ROOM_ID: '',
    roomName: '',
    netWorks: '',
    roomLoopFlag: 0,
    x: '',
    y: '',
    address: '',
    china_name: '',
    roomtypename: ''
  }
  const [roomItem, setRoomItem] = useState<ListItemProps['item']>(initialRoomItem)
  const [cityPicker, setCityPicker] = useState<any>([{
    name: '',
    id: '',
  },
  {
    name: '',
    id: '',
  },
  {
    name: '',
    id: '',
  }])
  const [mapLevel, setMapLevel] = useState<number>(2)
  const [currentProvince, setCurrentProvince] = useState<any>(props.provinceName)
  const [page, setPage] = useState<PageParame>({
      pageNo: undefined,
      pageSize: 800,
      total: 0,
  })
  useEffect(() => {
    currentDefaultValue = defaultValue;
    handleGetCityCode()
    return () => {
      if(map) {
        map.clear('pointLayer');
        map.clear('heightPointLayer');
      }
      mapFnObject = undefined;
      map = null;
      currentAreaCode = '';
      currentTopic = 0;
      currentRoomItem = null;
      dispatch(setMapSelect({ areaCode: '', provinceName: ''}));
      dispatch(setMapSelectTopic(topicList[0].value));
    }
  }, [])
  useEffect(() => {
    currentCityPicker = cityPicker;
    console.log('currentCityPicker', currentCityPicker)
    if (cityPicker[0].name) {
      const zCityCheck = zCity.findIndex(cityName => (replaceProvinceName(cityPicker[1].name) === replaceProvinceName(cityName)) || (replaceProvinceName(cityPicker[0].name) === replaceProvinceName(cityName)))
      const provinceName = (zCityCheck === -1) ? (cityPicker[1].name || cityPicker[0].name) : cityPicker[0].name
      setCurrentProvince(provinceName)
      setMapLevel((cityPicker[1].name && zCityCheck === -1) ? 2 : 1)
      if(!!cityPicker[2] && cityPicker[2].id !== null) {
        getSearchData()
      }
    }
  }, [cityPicker])
  useEffect(() => {
    if (props.eqpName) {
      setDefaultValue({
        ...defaultValue,
        searchType:'1',
        searchValue: props.eqpName
      });
    }
  }, [props.eqpName])
  useEffect(() => {
    currentDefaultValue = defaultValue;
    const currentRef = (mapListRef && mapListRef.current) as any;
    currentRef && currentRef.onSearchDefault && currentRef.onSearchDefault(currentDefaultValue)
  }, [defaultValue])
  useEffect(() => {
    currentTopic = reduxMapResource.mapSelect.topic;
  }, [reduxMapResource.mapSelect.topic])
  useEffect(() => {
    currentMapLevel = mapLevel;
  }, [mapLevel])
  useEffect(() => {
    currentRoomItem = roomItem;
  }, [roomItem])
  useEffect(() => {
    currentSearchParames = searchParames;
    if(searchParames) {
      getSearchData()
    }
  }, [searchParames])
  useEffect(() => {
    if(page.pageNo && page.pageSize) {
      getSearchData()
    }
  }, [page.pageNo, page.pageSize])

  useEffect(() => {
    map?.clear('pointLayer');
    map?.clear('heightPointLayer');
    mapFnObject?.hideTitles()
    if (map && datas && datas.length > 0) {
      let points: any[] = [];
      let heightPoints: any[] = [];
      datas.forEach((item: PointSetData, index) => {
        points.push(setPoint({ x: item.x, y: item.y, attr: item }));
      })
      if(roomItem?.ROOM_ID) {
        heightPoints.push(setPoint({ x: roomItem.x, y: roomItem.y, attr: roomItem, isHeight: true}));
        showHeightTitle({
          ...roomItem,
        })
      }
      map.setPoints(points, 'pointLayer')
      map.setPoints(heightPoints, 'heightPointLayer')
    }
    if(datas.length === 0) {
      setRoomItem(initialRoomItem);
    }
  }, [datas]);
  // 省市区选择器列表，匹配联通地图信息，只请求一次就可以
  const handleGetCityCode = () => {
    fetchStatesCodeList().then((res: any) => {
      const provinceList = res;
      const data: OptionObj[] = [];
      for (let province of provinceList) {
        data.push({
          name: province.text,
          id: province.value,
          children: province.children.map((city: any) => ({
            name: city.text,
            id: city.value,
            children: [
              {
                name: '全市',
                id: '',
              },
            ].concat(
              city.children.map((district: any) => ({
                name: district.text,
                id: district.value,
              }))
            ),
          })),
        });
      }
      let formItemsVal: any = [...formItems]
      formItemsVal[0].districtList = data
      setFormItems(formItemsVal)
    });
  }
  const handleSearch = (parames: any) => {
    setSearchParames(parames);
    setRoomItem(initialRoomItem);
    setIsListShow(true)
  }
  const handleChange = (parames: any) => {
    if(parames.searchType !== searchParames?.searchType) {
      let formItemsVal: any = [...formItems]
      formItemsVal[1].placeholder =  `请输入${parames?.searchType === '1' ? '设备' : '机房'}名称关键字`
      setFormItems(formItemsVal)
    }
    setSearchParames(parames)
  }
  // 获取列表数据
  const getSearchData = (params:any = {}) => {
    let provinceCode = currentAreaCode;
    if (!provinceCode || provinceCode == null || provinceCode == undefined) return;
    let data: any = {
      cityId: (currentCityPicker[1] === '') ? '' : (currentCityCode || currentCityPicker[1].id),
      regionId: currentCityPicker[2].id,
      netLevel: searchParames?.netLevel || currentDefaultValue?.netLevel,
      belongNetwork: searchParames?.belongNetwork || currentDefaultValue?.belongNetwork,
      typeId: searchParames?.typeId || currentDefaultValue?.typeId,
      searchType: searchParames?.searchType || currentDefaultValue?.searchType
    }
    if(searchParames?.searchType === '2' || currentDefaultValue?.searchType === '2') {
      data.roomName = searchParames?.searchValue || currentDefaultValue?.searchValue
    } else {
      if(currentDefaultValue?.searchValue){
        data.accurateEqpName = currentDefaultValue?.searchValue
      } else {
        data.eqpName = searchParames?.searchValue
      }
    }
    setSearchOver(true)
    debouceRequest(data)
  };
  let listTime: any = null;
  const handleList = _.debounce((data: any) => {
    // if (!data.cityId || data.cityId === 'undefined') return;
    const newTime_ = new Date();
    listTime = newTime_;
    let param = {
        data,
        pageNo: page.pageNo || 1,
        pageSize: page.pageSize,
    }
    queryDataNetworkRoomList(param).then(res => {
      const { data, code } = res;
      if (listTime === newTime_ && code == "200") {
        setSearchOver(false);
        setDatas(data.data)
        setPage({
          ...page,
          total: data.total
        })
        // const checkListShow = !!(currentSearchParames.regionId || currentSearchParames.belongNetwork || currentSearchParames.netLevel)
        // 搜索条件更改，列表展示
        if(!!currentSearchParames && !isListShow && data.data) {
          setIsListShow(true)
        }
        if(currentDefaultValue?.searchValue) {
          data.data && data.data[0] && handListClick(data.data[0])
          currentDefaultValue = null;
        }
      }
    });
  }, 500)
  const debouceRequest = useCallback(data => handleList(data), []);
  // 动态切换图例
  const handleSelect = (topic: number) => {
    if(topic === 1) {
      setClearText('')
      if (roomItem.ROOM_ID) {
        const zoom = map?.map.getZoom()
        map?.setPoints([setPoint({ x: roomItem.x, y: roomItem.y, attr: roomItem, isHeight: true})], 'heightPointLayer')
        showHeightTitle({
          ...roomItem,
        })
        map?.centerAndZoom(roomItem.x, roomItem.y, zoom < 12 ? 12 : zoom)
      }
    }
    if(topic === 2 && roomItem.ROOM_ID) {
      handleQueryCircuitRouteList()
    }
    if( topic === 3 && roomItem.ROOM_ID){
      // 假如是资源覆盖
      handleZYFG(roomItem);
      showHeightTitle({
        ...roomItem,
      })
    }
    if(topic !== 2) {
      tuoPuClear()
    }
    // 不等于3的时候
    if( topic !== 3 ){
      // 清除掉资源覆盖的数据
      ZYFGDataClear();
    }
  }

  const tuoPuClear = () => {
    map?.clear('ziyuantuopuPoints');
    map?.clear('ziyuantuopuLines');
    map?.clear('ziyuantuopuLinesHeight');
    map?.clear('ziyuantuopuPointsHeight');
    mapFnObject?.hideWindow();
    mapFnObject?.hideTitles()
  }

  const CoverDom = styled.div`
    width: 100%;
    height: 100%;
    border: solid 1px #06FFD1;
    border-radius: 50%;
    box-shadow: #06FFD120 0px 0px 20px inset;
    opacity: 1;

    @keyframes kuoshan {
      0% {
          transform: scale(1);
          opacity: 1;
      }
      70% {
          opacity: 1;
      }
      100% {
          transform: scale(1.5);
          opacity: 0;
      }
    }
  `;

  const ZYFGDataClear = function(){
    window.mapView.clear("zyfg");
    window.mapView.clear("zyfg_line");
    window.mapView.clear("zyfg_label");
    window.mapView.clear('zyfg_heightpoint')
    mapFnObject?.hideTitles();
    mapFnObject?.hideCovers();
    mapFnObject?.hideWindow();
    newTime = new Date();
    setZyfgShow(false);
  }

  const handleZYFGClick = function(e: any){
    let provinceCode = e?.attr?.areaCode;
    let bldgId = e?.attr?.bldgId;

    setZyfgLocation({x: e.geometry.coordinates[0], y:e.geometry.coordinates[1]});
    setBldgId(bldgId);
    setProvinceCode(provinceCode);
    setZyfgShow(true);


    // mapFnObject?.showWindowDom([], )
  }

  // 资源覆盖入口
  const handleZYFG = function (item = roomItem ){
    // 清除资源覆盖的方法
    ZYFGDataClear();
    setRoomItem(item);
    window.mapView.clear('heightPointLayer')
    map?.setPoints([setPoint({ x: item.x, y: item.y, attr: item, isHeight: true})], 'zyfg_heightpoint')
    showHeightTitle({
      ...item,
    })
    // 根据绘制的范围定位
    // window.mapView.map.setViewport(datas.point.map((e: any)=>{ return new BMapGL.Point(e.x, e.y); }),{zoomFactor: -3, margins: [20, 20, 0, 120]});
    window.mapView.centerAndZoom(item.x, item.y, 14);
    // 显示圆圈
    const cirle = new BMapGL.Circle( new BMapGL.Point(parseFloat(item.x), parseFloat(item.y)), 1500 );
    window.mapView.map.addOverlay(cirle);
    const bounds = cirle.getBounds();
    window.mapView.map.removeOverlay(cirle);
    mapFnObject.hideCovers();
    let coverTimer = setTimeout(()=>{
      mapFnObject.showCovers([{ point: [[bounds.getNorthEast().lng, bounds.getNorthEast().lat], [bounds.getSouthWest().lng, bounds.getSouthWest().lat]], dom: 
        <CoverDom> 
          <CoverDom className='kuoshan' style={ {animation: "kuoshan 4s linear 1s infinite",transform: "scale(1.2)", borderColor: "#00ffc600", boxShadow: "#06FFD152 0px 0px 20px inset"} }> 
            <CoverDom className='kuoshan' style={ {animation: "kuoshan 4s linear 1s infinite",transform: "scale(1.5)", borderColor: "#00ffc600", boxShadow: "#06FFD152 0px 0px 20px inset"} }></CoverDom> 
          </CoverDom> 
        </CoverDom> }])
      clearTimeout(coverTimer)
    },300)
    mapFnObject.hideWindow();
    let windowTimer = setTimeout(()=>{
      mapFnObject?.showWindowDom([`${item.x}`, `${item.y}`] ,
      <div className={css['RoomDetailDialog']}>
        <em 
          className={`tj-iconfont icon-guanbi ${css['closeDialog']}`}
          onClick={handleDialogClose}
        />
        <RoomDetailDialog
          showModel={false}
          hideModelContent={true}
          roomId={item.ROOM_ID}
          roomName={item.china_name}
        ></RoomDetailDialog>
      </div>);
      clearTimeout(windowTimer)
    }, 300)
    // 获取数据
    getZYFGData(item, bounds).then((datas: any)=>{
      if( !datas ) return;
      // 将点打上去
      window.mapView?.setPoints(datas.point, "zyfg");
      // 显示名称
      mapFnObject?.hideTitles();
      let timer = setTimeout(()=>{
        mapFnObject.showTitlesAdd(datas.point.map((e: any)=>{
          return {point: [e.x, e.y], title: "测试", datas: e.attr, dom: <TitleContent> <div className='type'>{e.attr.openDate}</div> <div className='text'>{e.attr.bldgName}</div> </TitleContent>}
        }).concat([{point: [item.x, item.y], title: "测试", datas: item, dom: <TitleContent> <div className='text'>{item.china_name}</div> </TitleContent>}]), null, true);
        clearTimeout(timer)
      },500)
      // window.mapView?.setLabel(datas.point.map((e: any)=>{ return {...e, typeText: e.attr.openDate , text: e.attr.bldgName}; }), "zyfg_label");
      // 把线画上去
      window.mapView?.setLines(datas.line, "zyfg_line");
    });
    setClearText('清除覆盖')
  }

  const getZYFGDataLy = function(bounds: any){
    const p = 
    {
      "provinceCode": reduxMapResource.mapSelect.areaCode || window.mapView.province,
      "rangeCoordinate":{
        "lowerLeftCoordinate":{
          "latitude":bounds.sw.lat, //45.7246420025321,
          "longitude":bounds.sw.lng //126.6489981262123
        },
        "topRightCoordinate":{
          "latitude":bounds.ne.lat,//45.8446420025234,
          "longitude":bounds.ne.lng//126.7689981262432
        }
      }
    }
    // {
    //       "provinceCode":"230000000000",
    //       "rangeCoordinate": {
    //               "lowerLeftCoordinate": {
    //                   "latitude": 45.7246420025321,
    //                   "longitude": 126.6489981262123
    //               },
    //               "topRightCoordinate": {
    //                   "latitude": 45.8446420025234,
    //                   "longitude": 126.7689981262432
    //               }
    //           }
    //   }
    const center = bounds.getCenter();
    return getWgsBldgList(p).then((ref: any)=>{
      if( !ref.data || !ref.data.bldgList || !ref.data.bldgList.length ){
        ref.data = {
          bldgList: []
        };
      }
      ref.data.bldgList = ref.data.bldgList.filter((dat: any)=>{
        return window.mapView.map.getDistance( new BMapGL.Point(dat.wgsX, dat.wgsY), center ) < 1500;
      })
      return ref;
    })
  }

  const getZYFGData = function(item = roomItem, bounds: any){
    const newTime_ = new Date();
    newTime = newTime_;
    // ROOM_ID reduxMapResource.mapSelect.areaCode "460000000000" || "191202050000001123046041" ||
    return Promise.all([getRoomToBldgList({ provinceCode:  reduxMapResource.mapSelect.areaCode || window.mapView.province, roomId:  item.ROOM_ID }), getZYFGDataLy(bounds)]).then(([res, res1]: any)=>{
      if( newTime_ !== newTime || !res.data ) { return };
      if (!res.data.bldgList) res.data.bldgList = [];
      // 生成打点数据 [[item.x, item.y + -0.001],[item.x + 0.001, item.y]]
      const iary = res.data.bldgList.concat(res1.data.bldgList).map((e: any)=>{
      // const iary = [[item.x, item.y + -0.001],[item.x + 0.001, item.y]].map((e: any)=>{
        return {
          x: e[0] || e.wgsX,
          y: e[1] || e.wgsY,
          icon: handlePointImage(5),
          width: 54,
          height: 54,
          attr: { ...e, areaCode: reduxMapResource.mapSelect.areaCode },
        }
      })

      // 生成画线数据
      const point = [item.x, item.y];
      // const iline = [[item.x, item.y + -0.001],[item.x + 0.001, item.y]].map((e,i,ary)=>{
      const iline = res.data.bldgList.map((e: any,i: any,ary: any)=>{
        // if( i == 0 ) return;
        return {
          points: [[e.wgsX, e.wgsY], point],
          // points: [e, point],
          color: "#11B0FF",
          width: 3,
          // width: 54,
          // height: 54
        }
      });
      // iline.splice(0,1);

      const covers = [point,...res.data.bldgList.map((e: any)=>{ return [e.wgsX, e.wgsY] })];
      // const covers = [point,[item.x, item.y + -0.001],[item.x + 0.001, item.y]];

      return{ point: iary, line: iline, cover: covers };
    })
  }
  
  // 请求资源拓扑
  let zytpTimer: any = null;
  const handleQueryCircuitRouteList = (activeItem = roomItem) => {
    const newTime_ = new Date();
    zytpTimer = newTime_;
    tuoPuClear()
    const params = {
      provinceCode: reduxMapResource.mapSelect.areaCode || currentAreaCode,
      positType: '2080001',
      positId: activeItem.ROOM_ID
    }
    let pointDatas: any[] = [];
    let lineDatas: any[] = [];
    queryCircuitRouteList(params).then((res: any) => {
      if(zytpTimer !== newTime_) return;
      tuoPuClear()
      if (res && res.code === '200') {
        const { fatherList, childrenList } = res.data;

        if(fatherList && fatherList.length > 0) {
          const { points, lines } = forList(activeItem, fatherList)
          pointDatas.push(...points)
          lineDatas.push(...lines)
        }
        if(childrenList && childrenList.length > 0) {
          const { points, lines } = forList(activeItem, childrenList)
          pointDatas.push(...points)
          lineDatas.push(...lines)
        }
        // 点集合
        // 线集合
        map?.setPoints(pointDatas, "ziyuantuopuPoints");
        map?.setLines(lineDatas, "ziyuantuopuLines");
        const points = [activeItem, ...pointDatas].map((e)=>{ return {point: [`${e.x}`, `${e.y}`], title: (e.attr && e.attr.positName) || e.china_name, datas: e.attr} })
        mapFnObject?.showTitles(points)
        map?.setViewport([activeItem, ...pointDatas], {
          margins: [20, 100, 100, 250]
        })
        handleClickPoint({attr: activeItem, x: activeItem.x, y: activeItem.y})
        setClearText('清除拓扑')
      }
    })
  }
 

  // 左侧页码改变
  const handlePageChange = (pageNo: any, pageSize: number) => {
    setPage({
      ...page,
      pageNo: pageNo,
      pageSize: pageSize,
    })
  }
  // 关闭机房列表
  const handleDeviceListCancel = () => {
    setDeviceListShow(false)
  }
  // 点击列表
  const handListClick = (item: ListItemProps['item']) => {
    
    setRoomItem(item);
    map?.clear('heightPointLayer');
    let heightPoints = []
    heightPoints.push(setPoint({ x: item.x, y: item.y, attr: item, isHeight: true}))
    map?.setPoints(heightPoints, 'heightPointLayer')
    showHeightTitle({
      ...item,
    })
    if(reduxMapResource.mapSelect.topic == 1) {
      const zoom = map?.map.getZoom()
      map?.centerAndZoom(item.x, item.y, zoom < 12 ? 12 : zoom)
      // setDeviceListShow(true)
    } else if (reduxMapResource.mapSelect.topic == 2){
      handleQueryCircuitRouteList(item)
    } else if ( reduxMapResource.mapSelect.topic == 3 ){
      // 假如是资源覆盖
      handleZYFG(item);
    }
  }
  // 显示高亮标题
  const showHeightTitle = (item: any) => {
    // 显示标题
    mapFnObject?.hideTitles()
    let timer = setTimeout(()=>{
      mapFnObject?.showTitles([{point:[item.x, item.y], title: item.china_name}])
      clearTimeout(timer)
    },500)
  }
  // 地图变化绑定事件
  const mapBingChange = (mapObject: MapObject) => {
    mapObject.onChange((e: any) => {
      console.log('e', e)
      const zCityCheck = zCity.findIndex(cityName => replaceProvinceName(e.province?.attr.name) === replaceProvinceName(cityName))
      if(zCityCheck > -1) {
        setMapLevel(1)
        setCurrentProvince(e.province?.attr.name)
      }
      if(zCityCheck === -1 && (currentMapLevel === 2 && !e.cList)) return;
      if(currentTopic === 2 && !!currentRoomItem && !!currentRoomItem.ROOM_ID) return;
      if(e.province && e.province.attr && (e.province.attr.code !== currentAreaCode || e.city?.attr.cityId !== currentCityCode)) {
        setRoomItem(initialRoomItem);
        const areaCode = (`${e.province?.attr.code}`).padEnd(12, '0');
        const cityCode = (e.city?.attr?.cityId && `${e.city?.attr?.cityId}`);
        dispatch(setMapSelect({
          areaCode: areaCode,
          provinceName: e.province?.attr.name,
          cityId: cityCode,
          cityName: e.city?.attr.name
        }));
        currentAreaCode = areaCode
        currentCityCode = cityCode
        const attrName = (zCityCheck === -1) ? e.city?.attr.name : e.province?.attr.name
        const cityName = (currentMapLevel == 1 || currentCityPicker[1] === '') ? '' : attrName;
        const cityId = (currentMapLevel == 1 || currentCityPicker[1] === '') ? '' : cityCode;
        let districtName = '';
        let districtId = '';
        if(currentCityPicker[2] && e.cList) {
          const districtListIndex = e.cList.findIndex((districtItem: any) => districtItem.value === currentCityPicker[2].id)
          districtName = districtListIndex !== -1 ? currentCityPicker[2].name : ''
          districtId = districtListIndex !== -1 ? currentCityPicker[2].id : ''
        }
        const currentRef = (mapListRef && mapListRef.current) as any;
        currentRef && currentRef.onSearchFields && currentRef.onSearchFields()
        currentRef && currentRef.setPlaceSelected && currentRef.setPlaceSelected([{
          name: e.province?.attr.name,
          id: areaCode
        }, {
          name: cityName,
          id: cityId
        }, {
          name: districtName,
          id: districtId,
        }]);
        getSearchData()
      }
    });
    mapObject.onclick((e: any, b: any) => {
      
      if( e.arrayList && e.arrayList.length > 1 ){
        mapFnObject.addPlugin(
          <MapPointList onClick={ (e: any)=>{ mapFnObject.removePlugin("pointArrayList") ;mapClick({...e, zoom: window.mapView.map.getZoom()}, b) } } key={ "pointArrayList" } nameProps={ "china_name" } row={ e.arrayList } 
            point={ new BMapGL.Point(e.geometry.coordinates[0], e.geometry.coordinates[1]) }></MapPointList>
        )
        return;
      }

      mapClick(e, b);
    })
  }

  const mapClick = function(e: any, b: any) {
    if(currentTopic === 1) {
      handleZystClick(e)
    }
    if(currentTopic === 2) {
      handleZytpClick(e, b)
    }
    if( currentTopic === 3 ){
      if( e.attr.ROOM_ID ){
          handleZYFG(e.attr);
      }else{
        // 当是资源覆盖的时候点击楼宇
        handleZYFGClick(e);
      }
    }
  }

  const mapClear = () => {
    if(currentRoomItem && currentRoomItem.ROOM_ID) {
      map?.clear('heightPointLayer');
      mapFnObject?.hideTitles()
    }
    setRoomItem({
      ROOM_ID: '',
      roomName: '',
      netWorks: '',
      roomLoopFlag: 0,
      x: '',
      y: '',
      address: '',
      china_name: '',
      roomtypename: ''
    })
    if(reduxMapResource.mapSelect.topic == 2) {
      tuoPuClear()
    }
    if(reduxMapResource.mapSelect.topic == 3) {
      ZYFGDataClear()
    }
  }
  const handleZystClick = (e: any) => {
    handListClick(e.attr)
  }

  const handleZytpClick = (e: any, b: any) => {
    const attr = e.attr;
    const zytpIndex: any = map?.dataset.findIndex(datas => datas.name === 'ziyuantuopuPoints')
    const zytpData = (zytpIndex > -1) ? (map?.dataset[zytpIndex].datas) : []
    if(e.geometry.type === "Point") {
      const domIndex = zytpData?.findIndex(data => (data.x === (attr.wgsX || attr.x)) && (data.y === (attr.wgsY || attr.y)))
      if (domIndex !== -1) {
        handleClickPoint(e)
      } else if(domIndex === -1){
        // 切换机房
        const item = e.attr;
        setRoomItem(item);
        map?.clear('ziyuantuopuPointsHeight');
        let heightPoints = []
        heightPoints.push(setPoint({ x: item.x, y: item.y, attr: item, isHeight: true}))
        map?.setPoints(heightPoints, 'ziyuantuopuPointsHeight')
        showHeightTitle({
          ...item,
        })
        handleQueryCircuitRouteList(item)
      }
    }

    if(zytpData && zytpData.length > 0) {
      if(e.geometry.type === "LineString") {
        handleClickLine(e, b)
      }
    }
  }
  // 选中线路
  const handleClickLine = (e: any, b: any) => {
    if(!e.attr) return;
    map?.clear('ziyuantuopuLinesHeight');
    map?.clear('ziyuantuopuPointsHeight');
    mapFnObject.hideWindow();
    const { start, end } = e.attr;
    const startX = start.x || start.wgsX
    const startY = start.y || start.wgsY
    const endX = end.x || end.wgsX
    const endY = end.y || end.wgsY
    map?.setLines([handleSetLine(
      startX,
      startY,
      endX,
      endY,
      {
        ...e.attr
      },
      "#32FF11",
      "solid"
    )], 'ziyuantuopuLinesHeight');
    mapFnObject?.showWindowDom(
    // [`${(Number(startX) + Number(endX)) / 2}`, `${(Number(startY) + Number(endY)) / 2}`] ,
    [b.latlng.lng.toString(), b.latlng.lat.toString()],
    <div className={css['ResourcesDetailDialog']}>
      <em 
        className={`tj-iconfont icon-guanbi ${css['closeDialog']}`}
        onClick={handleDialogClose}
      />
      <ResourcesDetailDialog
        showModel={false}
        hideModelContent={true}
        positIdA={start.positId || start.ROOM_ID}
        positIdZ={end.positId}
        provinceCode={currentAreaCode}
      />
    </div>);
  }
  // 选中机房
  const handleClickPoint = (e: any) => {
    map?.clear('ziyuantuopuLinesHeight');
    map?.clear('ziyuantuopuPointsHeight');
    mapFnObject.hideWindow();
    const attr = e.attr;
    map?.setPoints([setPoint({ x: attr.wgsX || attr.x, y: attr.wgsY || attr.y, attr: { ...attr, roomtypeid: getRoomTypeId(attr)}, isHeight: true})], 'ziyuantuopuPointsHeight');
    mapFnObject?.showWindowDom([`${attr.wgsX || attr.x}`, `${attr.wgsY || attr.y}`] ,
    <div className={css['RoomDetailDialog']}>
      <em 
        className={`tj-iconfont icon-guanbi ${css['closeDialog']}`}
        onClick={handleDialogClose}
      />
      <RoomDetailDialog
        showModel={false}
        hideModelContent={true}
        roomId={attr.positId || attr.ROOM_ID}
        roomName={attr.positName || attr.china_name}
      ></RoomDetailDialog>
    </div>);
  }
  const handleDialogClose = () => {
    mapFnObject.hideWindow();
  }
  // 点击列表收缩
  const handleRecovery = (recovery: boolean) => {
    setIsLegendListShow(recovery)
  }
  const mapViewRef = useRef()
  const mapDomRef = useCallback((ref) => {
    if (ref !== null) {
      mapViewRef.current = ref;
    }
  }, []);
  const loadMap = (mapObject: MapObject, fnObject: any)=>{
    map = mapObject;
    mapFnObject = fnObject;
    mapBingChange(mapObject)
  }
  useEffect(()=>{
    setCurrentProvince(props.provinceName);
    if(!!props.eqpName) return;
    setDatas([])
    setMapLevel(2)
    setSearchParames(undefined)
    setDefaultValue({
      searchValue: undefined,
      regionId: undefined,
      netLevel: undefined,
      belongNetwork: undefined,
      typeId: undefined,
      searchType:  props.eqpName ? '1' : '2'
    })
    setCityPicker([{
      name: '',
      id: '',
    },
    {
      name: '',
      id: '',
    },
    {
      name: '',
      id: '',
    }])
    setRoomItem(initialRoomItem);
    setPage({
      pageNo: undefined,
      pageSize: 800,
      total: 0,
    })
    setIsListShow(false)
    tuoPuClear()
    ZYFGDataClear();
    const changeTopic = (mapSelectRef.current as any) && (mapSelectRef.current as any).changeTopic as any
    changeTopic && changeTopic(topicList[0])
    const currentRef = (mapListRef && mapListRef.current) as any;
    currentRef && currentRef.onSearchFields && currentRef.onSearchFields()
    currentRef && currentRef.setPlaceSelected && currentRef.setPlaceSelected([{
      name: '',
      id: '',
    },
    {
      name: props.provinceName,
      id: '',
    },
    {
      name: '',
      id: '',
    }]);
    if(props.provinceName) {
      getSearchData()
    }
  },[props.provinceName]);
  const handleClear = () => {
    mapClear()
    setClearText('')
  }

  const handleChangePlace = (e: any) => {
    if (e[0].name) {
      setCityPicker(e)
    }
  }
  const MapViewMemo = useMemo(()=> <MapView loadMap={ loadMap } provinceName={currentProvince} ref={mapDomRef} mapLevel={mapLevel}></MapView>, [])

  return (
    <div className={css['container']}>
      {clearText && <div
      className={css['clearText']}
      style={{ left: (!isLegendListShow) ? '475px' : '75px' }}
      onClick={handleClear}
      >
        {clearText}
      </div>}
      {/* {MapViewMemo} */}
      <MapView loadMap={ loadMap } provinceName={currentProvince} ref={mapDomRef} mapLevel={mapLevel}></MapView>
      <MapListView
        ref={mapListRef}
        isShow={true}
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
          isListShow && datas && datas.map((listItem:ListItemProps['item'], index) => {
            return (
              <ListItem
                key={listItem.ROOM_ID + index}
                item={listItem}
                activeId={roomItem?.ROOM_ID}
                height={117}
                handClick={(item) => handListClick(item)}
              />
            )
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
      <MapSelectView
        ref={mapSelectRef}
        topicList={topicList}
        topic={reduxMapResource.mapSelect.topic}
        handleSelect={handleSelect}
      />
      <LegendSelectView iconList={iconList} left={(isListShow && !isLegendListShow) ? '420px' : '15px'} />
      {(!!roomItem.ROOM_ID && reduxMapResource.mapSelect.topic === 1) && <DeviceList roomItem={roomItem} />}
      { zyfgShow && <ZyfgDialog isShow={zyfgShow} location={ zyfgLocation } onCloseFunc={()=>{setZyfgShow(false)}} provinceCode={provinceCode} bldgId={bldgId}/> }
    </div>
  );
}

export default DatasMapView;
