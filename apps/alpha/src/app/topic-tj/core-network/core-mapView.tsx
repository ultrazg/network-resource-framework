import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import { getPageNetworkRoomCircuitList } from '@alpha/app/topic-tj/api/coreNetwork';
import { getRoomTypes } from '@alpha/app/topic-tj/api/coreNetwork';
import { getCityCode } from '@alpha/app/topic-tj/api/apiJson'
import { replaceProvinceName } from '@alpha/app/topic-tj/utils/commFunc';
import { CORE_NEEPQ_TYPE } from '@alpha/app/topic-tj/utils/constants';
import { setMapSelect } from '@alpha/app/redux/map.slice';
import { MapObject } from '../components/map-view/mapUtil/mapObject';
import hexinItemLogo from './images/hexinItemLogo.png';
import css from './core-mapView.module.scss';
import { zCity } from '@alpha/app/topic-tj/utils/constants'
// 引入地图插件
import MapView from '../components/map-view/map-view';
// 搜索列表
import MapListView from '../components/map-view/map-list/map-list';

// 需要显示的图例
import LegendSelectView from '../components/legend-view/legend-view';
import CoreDetails, { CoreDetailsProps } from './core-details/core-details';

interface ListItemProps {
  item: {
    roomID: string;
    roomName: string;
    netWorks: string;
    x: string;
    y: string;
    address: string;
    bigTypeName: string;
    bigTypeId: string;
    roomNo: string;
    childrenList?: ListItemProps['item'][];
  };
  activeId: string;
  handClick?: (item: any) => void;
  height?: number;
}
const ListItem = (props: ListItemProps) => {
  const item = props.item;
  return (
    <div
      className={`${css['itemContainer']} ${
        props.activeId == item.roomID && css['bgcStyle']
      }`}
      onClick={() => props.handClick && props.handClick(item)}
    >
      <div className={css['item-left']}>
        <img src={hexinItemLogo} alt="" />
      </div>
      <div className={css['item-right']}>
        <div className={css['item-topBox']}>
          <span className={css['topBox-name']} title={item.roomName}>
            {item.roomName}
          </span>
          <span className={css['topBox-level']}>{item.bigTypeId === '5' ? '云枢纽机房' : '普通机房'}</span>
        </div>
        <div className={css['item-address']}>
          <span className={css['addresstext']} title={item.address}>
            地址：
          </span>
          {item.address}
        </div>
      </div>
    </div>
  );
};

export interface CoreMapViewProps {
  provinceName?: string;
}
interface SearchParame {
  searchValue: string;
  cityId: string;
  neEqpType: string;
  roomtypes: string[];
}
interface PageParame {
  pageNo: number | undefined;
  pageSize: number;
  total: number;
}

// 点图片
const handlePointImage = (type: number, isHeight = false) => {
  let types: any = {
    // 生产
    1: 'shenchan',
    // 用户
    2: 'yonghu',
    // 基站
    3: 'jizhan',
    // IDC
    4: 'idc',
    // 云枢纽
    5: 'idc',
    // 室外
    6: 'shiwai',
  };
  return require(`./images/icons/${types[type as number]}${
    isHeight ? 'Height' : ''
  }.png`);
};

// 地图打点 (资源上图)
const setPoint = ({ x, y, attr, isHeight = false }: any) => {
  let newAttr = attr.bigTypeId === '5' ? '5' : '1';
  let newAttrLen: any = {
    '1': handlePointImage(1, isHeight),
    '2': handlePointImage(2, isHeight),
    '3': handlePointImage(3, isHeight),
    '4': handlePointImage(4, isHeight),
    '5': handlePointImage(5, isHeight),
    '6': handlePointImage(6, isHeight),
  };
  let iconSvg = newAttrLen[newAttr];
  let width = 50;
  let height = 55;
  return {
    x,
    y,
    icon: iconSvg,
    attr,
    width,
    height,
  };
};

let mapFnObject: any;
let map: MapObject | null;
let currentAreaCode: string;
let currentCityCode: string;
let realroomTypeList: any[] = [];
let currentMapLevel: any;
let currentCityPicker: any;
export function CoreMapView(props: CoreMapViewProps) {
  const mapListRef = useRef();
  const reduxMapResource = useSelector((state: any) => state.reduxMapResource);
  const dispatch = useDispatch();
  const [searchOver, setSearchOver] = useState(false);
  const iconList = [
    {
      imgStyle: {
        src: handlePointImage(1),
      },
      legendName: '普通机房',
      type: 'img',
    },
    {
      imgStyle: {
        src: handlePointImage(5),
      },
      legendName: ' 云枢纽机房',
      type: 'img',
    },
  ];
  const [formItems, setFormItems] = useState([
    {
      props: 'cityId',
      span: 24,
      formType: 'cityPicker',
      districtList: []
    },
    {
      formType: 'inputSearch',
      props: 'searchValue',
      span: 24,
      placeholder: '请输入机房名称关键字',
      labelCol: {
        span: 0,
        offset: 0,
      },
      searchType: {
        props: 'searchType',
        options: [
          {
            label: '机房名称',
            value: '1',
          },
        ],
      },
    },
    // {
    //   props: 'cityId',
    //   formType: 'select',
    //   options: [],
    //   span: 12,
    //   placeholder: '地市',
    // },
    {
      props: 'roomtypes',
      formType: 'select',
      span: 12,
      options: [{
        label: '全部机房',
        value: ''
      },{
        label: '普通机房',
        value: '1'
      }, {
        label: '云枢纽机房',
        value: '5'
      }],
      placeholder: '机房类型',
    },
    {
      props: 'neEqpType',
      formType: 'select',
      options: CORE_NEEPQ_TYPE,
      span: 12,
      placeholder: '网元类型',
    },
  ]);
  const defaultValue = {
    searchValue: undefined,
    cityId: undefined,
    neEqpType: undefined,
    roomtypes: [],
    searchType: '1',
  };
  const [datas, setDatas] = useState<ListItemProps['item'][]>([]);
  const [isListShow, setIsListShow] = useState(false);
  const [isLegendListShow, setIsLegendListShow] = useState(false);
  const initialRoomItem = {
    roomID: '',
    roomName: '',
    netWorks: '',
    x: '',
    y: '',
    address: '',
    bigTypeName: '',
    bigTypeId: '',
    roomNo: '',
  };
  const [roomItem, setRoomItem] =
    useState<ListItemProps['item']>(initialRoomItem);
  const initialCoreDetails = {
    roomId: '', // 机房ID
    roomName: '', // 机房名称
    roomNo: '', // 机房编号
    roomType: '', // 机房类型
    bigTypeId: '',
    roomDeviceType: '', // 包含设备类型
    address: '', // 地址
  };
  const [coreDetails, setCoreDetails] =
    useState<CoreDetailsProps['coreDetails']>(initialCoreDetails);
  const [searchParames, setSearchParames] = useState<SearchParame>();
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
  const [mapLevel, setMapLevel] = useState<number>(1)
  const [currentProvince, setCurrentProvince] = useState<any>(props.provinceName)
  const [page, setPage] = useState<PageParame>({
    pageNo: undefined,
    pageSize: 800,
    total: 0,
  });

  useEffect(() => {
    handleGetCityCode();
    handleGetRoomTypes();
    return () => {
      if (map) {
        map.clear('pointLayer');
        map.clear('heightPointLayer');
      }
      mapFnObject = undefined;
      map = null;
      currentAreaCode = '';
    };
  }, []);
  // 省市区选择器列表，匹配联通地图信息，只请求一次就可以
  const handleGetCityCode = () => {
    getCityCode().then((data: any) => {
      let formItemsVal: any = [...formItems]
      formItemsVal[0].districtList = data
      setFormItems(formItemsVal)
    });
  }
  useEffect(() => {
    currentCityPicker = cityPicker;
    if (cityPicker[0].name) {
      const zCityCheck = zCity.findIndex(cityName => (replaceProvinceName(cityPicker[1].name) === replaceProvinceName(cityName)) || (replaceProvinceName(cityPicker[0].name) === replaceProvinceName(cityName)))
      const provinceName = (zCityCheck === -1) ? (cityPicker[1].name || cityPicker[0].name) : cityPicker[0].name
      setCurrentProvince(provinceName)
      setMapLevel((cityPicker[1].name && zCityCheck === -1) ? 2 : 1)
      if(!!cityPicker[2] && cityPicker[2].id !== null) {
        getSearchCoreData()
      }
    }
  }, [cityPicker])
  useEffect(() => {
    currentMapLevel = mapLevel;
  }, [mapLevel])
  useEffect(() => {
    if (searchParames) {
      getSearchCoreData();
    }
  }, [searchParames, page.pageNo, page.pageSize]);
  useEffect(() => {
    if (page.pageNo && page.pageSize) {
      getSearchCoreData();
    }
  }, [page.pageNo, page.pageSize]);

  useEffect(() => {
    map?.clear('pointLayer');
    mapFnObject?.hideTitles();
    mapFnObject?.hideWindow();
    if (map && datas.length > 0) {
      let points: any[] = [];
      datas.forEach((item: ListItemProps['item'], index) => {
        points.push(setPoint({ x: item.x, y: item.y, attr: item }));
      });
      if (roomItem?.roomID) {
        points.push(setPoint({ x: roomItem.x, y: roomItem.y, attr: roomItem }));
        showHeightTitle({
          ...roomItem,
        });
      }
      map.setPoints(points, 'pointLayer');
    }
  }, [datas]);

  const handleGetRoomTypes = () => {
    getRoomTypes().then((res: any) => {
      if (res && res.code === '200') {
        realroomTypeList = [];
        for (let key in res.data) {
          realroomTypeList.push({
            label: res.data[key],
            value: key,
          });
        }
      }
    });
  };
  const RightBaseStationLoopingRef = useRef();
  const handleSearch = (parames: any) => {
    setRoomItem(initialRoomItem);
    setCoreDetails(initialCoreDetails);
    if (reduxMapResource.mapSelect.topic === 2) {
      const clearPointAndLine =
        (RightBaseStationLoopingRef.current as any) &&
        ((RightBaseStationLoopingRef.current as any).clearPointAndLine as any);
      clearPointAndLine && clearPointAndLine();
    }
    setSearchParames(parames);
    setIsListShow(true)
  };
  const handleChange = (parames: any) => {
    setSearchParames(parames);
  };
  // 获取列表数据
  const getSearchCoreData = (params: any = {}) => {
    let provinceCode = currentAreaCode;
    if (!provinceCode || provinceCode == null || provinceCode == undefined) return;
    let roomtypes = searchParames?.roomtypes;
    if(roomtypes?.includes('1')) {
      const connectList = realroomTypeList.filter(item => item.label !== '云枢纽机房').map(item => item.value)
      roomtypes = [ ...roomtypes, ...connectList]
    }
    let data: any = {
      cityId: currentCityPicker[1] === '' ? '' : (currentCityCode || currentCityPicker[1].id),
      regionId: currentCityPicker[2].id,
      neEqpType: searchParames?.neEqpType,
      roomtypes: [ ...new Set(roomtypes)],
      roomName: searchParames?.searchValue,
      specialityId: ['80'],
    };

    setSearchOver(true)
    debouceRequest(data)
  };
  const handleList = _.debounce((data: any) => {
    let param = {
      data: data,
      pageNo: page.pageNo || 1,
      pageSize: page.pageSize,
    };
    getPageNetworkRoomCircuitList(param).then((res) => {
      const { data, code } = res;
      if (code == '200') {
        setSearchOver(false);
        let dataList: ListItemProps['item'][] = [];
        data.data.forEach((dataItem: ListItemProps['item']) => {
          const dataIndex = dataList.findIndex(
            (listItem) => listItem.x === dataItem.x && listItem.y === dataItem.y
          );
          // 云枢纽机房
          if (dataIndex !== -1) {
            const childrenList: any = dataList[dataIndex].childrenList
              ? dataList[dataIndex].childrenList
              : [dataList[dataIndex]];
            dataList[dataIndex] = {
              ...dataList[dataIndex],
              childrenList: childrenList.concat([dataItem]),
            };
          } else {
            dataList.push(dataItem);
          }
        });
        setDatas(dataList);
        setPage({
          ...page,
          total: data.total,
        });
        // 搜索条件更改，列表展示
        if (!!searchParames && !isListShow) {
          setIsListShow(true);
        }
      }
    });
  }, 500)
  const debouceRequest = useCallback(data => handleList(data), []);
  const handlePageChange = (pageNo: any, pageSize: number) => {
    setPage({
      ...page,
      pageNo: pageNo,
      pageSize: pageSize,
    });
  };

  const handListClick = (item: ListItemProps['item']) => {
    mapFnObject.hideWindow();
    setRoomItem(item);
    setCoreDetails({
      roomId: item.roomID, // 机房ID
      roomName: item.roomName, // 机房名称
      roomNo: item.roomNo, // 机房编号
      roomType: item.bigTypeId === '5' ? '云枢纽机房' : '普通机房', // 机房类型
      bigTypeId: item.bigTypeId, // 机房类型id
      roomDeviceType: item.roomID, // 包含设备类型
      address: item.address, // 地址
    });
    let zoom = map?.map.getZoom();
    if (zoom < 12) {
      map?.centerAndZoom(item.x, item.y, 12, () => {
        if(item.childrenList && item.childrenList.length > 0) {
          handleClickPoint(item);
        }
      });
    } else {
      map?.centerAndZoom(item.x, item.y, zoom, () => {
        if(item.childrenList && item.childrenList.length > 0) {
          handleClickPoint(item);
        }
      });
    }

    showHeightTitle({
      ...item,
    });
  };
  const showHeightTitle = (item: any) => {
    mapFnObject.hideTitles();
    setTimeout(() => {
      // 显示标题
      mapFnObject && mapFnObject.showTitle([item.x, item.y], item.roomName);
    }, 500);
  };
  // 地图变化绑定事件
  const mapBingChange = (mapObject: MapObject) => {
    mapObject.onChange((e: any) => {
      const zCityCheck = zCity.findIndex(cityName => replaceProvinceName(e.province?.attr.name) === replaceProvinceName(cityName))
      if(zCityCheck === -1 && (currentMapLevel === 2 && !e.cList)) return;
      if (
        e.province &&
        e.province.attr &&
        (e.province.attr.code !== currentAreaCode || e.city?.attr.cityId !== currentCityCode)
      ) {
        setRoomItem(initialRoomItem);
        setCoreDetails(initialCoreDetails);
        const areaCode = `${e.province.attr.code}`.padEnd(12, '0');
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
        currentCityCode = cityCode
        const attrName = (zCityCheck === -1) ? e.city?.attr.name : e.province?.attr.name
        const cityName = (currentMapLevel === 1 || currentCityPicker[1] === '') ? '' : attrName;
        const cityId = (currentMapLevel == 1 || currentCityPicker[1] === '') ? '' : cityCode;
        const districtName = (currentMapLevel === 1 || currentCityPicker[2] === '') ? '' : currentCityPicker[2].name;
        const districtId = (currentMapLevel === 1 || currentCityPicker[2] === '') ? '' : currentCityPicker[2].id;
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
        getSearchCoreData();
      }
    });
    mapObject.onclick((e: any) => {
      handListClick(e.attr);
    });

    mapObject.onMapNoClick((e: any) => {
      // console.log("onMapNoClick", e);
    });
  };
  // 选中机房
  const handleClickPoint = (item: any) => {
    mapFnObject.hideWindow();
    const attr = item;
    mapFnObject?.showWindowDom(
      [attr.x, attr.y],
      <div className={css['RoomDetailDialog']}>
        {item.childrenList.map((dataItem: any, dataIndex: number) => {
          return (
            <div
              className={css['RoomDetailItem']}
              key={dataItem.roomID + dataIndex}
              title={dataItem.roomName}
              onClick={() => handleClickRoom(dataItem, item)}
            >
              {`${dataItem.roomName}`}
            </div>
          );
        })}
      </div>
    );
  };
  const handleClickRoom = (
    item: ListItemProps['item'],
    parentItem: ListItemProps['item']
  ) => {
    setRoomItem(parentItem);
    setCoreDetails({
      roomId: item.roomID, // 机房ID
      roomName: item.roomName, // 机房名称
      roomNo: item.roomNo, // 机房编号
      roomType: item.bigTypeId === '5' ? '云枢纽机房' : '普通机房', // 机房类型
      bigTypeId: item.bigTypeId, // 机房类型
      roomDeviceType: item.roomID, // 包含设备类型
      address: item.address, // 地址
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
  };
  const handleChangePlace = (e: any) => {
    if (e[0].name) {
      setCityPicker(e)
    }
  }
  useEffect(() => {
    setCurrentProvince(props.provinceName);
    console.log('props.provinceName', props.provinceName)
    setDatas([]);
    setMapLevel(1)
    setRoomItem(initialRoomItem);
    setPage({
      pageNo: undefined,
      pageSize: 800,
      total: 0,
    });
    setCoreDetails(initialCoreDetails);
    setSearchParames(undefined);
    setIsListShow(false);
    const currentRef = (mapListRef && mapListRef.current) as any;
    currentRef && currentRef.onSearchFields && currentRef.onSearchFields();
    currentRef && currentRef.setPlaceSelected && currentRef.setPlaceSelected([{
      name: props.provinceName,
      id: '',
    },
    {
      name: '',
      id: '',
    },
    {
      name: '',
      id: '',
    }]);
    if(props.provinceName) {
      getSearchCoreData()
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
          onChange: (page, pageSize) => handlePageChange(page, pageSize),
        }}
        handleRecovery={handleRecovery}
      />
      <LegendSelectView
        iconList={iconList}
        left={isListShow && !isLegendListShow ? '420px' : '15px'}
      />
      {coreDetails.roomId && <CoreDetails coreDetails={coreDetails} />}
    </div>
  );
}

export default CoreMapView;
