import {
  CustomOverlay,
  Map as BMap,
  Marker,
  Polygon,
  Polyline,
  ZoomControl,
  InfoWindow,
} from 'react-bmapgl/dist';
import 'react-bmapgl';
import * as turf from '@turf/turf';

import React, {
  CSSProperties,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  fetchBMapStyle,
  fetchChinaDistrictMapWithId,
  fetchChinaMapWithName,
  fetchChinaProvinceMapWithId,
} from '@alpha/api/data';

import closeIcon from '../../images/icon/close.svg';

import CityPicker, {
  OptionObj,
} from '@alpha/app/components/city-picker/city-picker';
import {
  fetchStatesCodeList,
  queryBiaoZhunDiZhi,
  queryCmtreoPolygon,
} from '@alpha/api/signal-service';
import message from '@alpha/app/message/message';

import { isEmpty } from 'lodash';
import {
  EmptyContainer,
  SearchContainer,
  SearchResultContainer,
  Tooltip,
} from './gis-component';
import {
  defaultLegendStatusMap,
  defaultProvince, DIRECT_CITY_LIST,
  RES_TYPE_LIST,
  resourceLegendList
} from "@alpha/app/topic/broadband-2/widgets/gis/constants";
import {
  getAllDevicesInDistrict,
  getDeviceInfo,
  queryRoutes,
  queryRoutesLocal,
} from '../../../../../api/gis-service';
import {
  convertMeasure,
  generateRadomNum,
  simplifyProvinceName,
} from '@alpha/utils/commFunc';
import { nameMap } from '../../components/resource';
import { getUnit } from '../../layer/function';
import {
  getOltAnalysisMap,
  getResCellResourcesMap,
  getResMap,
} from '@alpha/api/broardband';
import {
  getDeviceIconName,
  getIconName,
  getPointOffset,
  processOnePath,
  processOnePathLocal, uniqueArray
} from "@alpha/app/topic/broadband-2/widgets/gis/gisHelperFunc";
import LegendContainer from '@alpha/app/topic/broadband-2/widgets/gis/components/LegendContainer';

import { CommunityInfoWrapper, InfoWrapper } from './info-window';
import { useViewport } from "@alpha/app/context/viewport-context";
import ParallelNav from "@alpha/app/topic/broadband-2/components/parallel-nav/parallel-nav";

export interface ProvinceInfoObj {
  id?: string;
  size?: string;
  name: string;
  center?: number[];
  cp?: number[];
  childNum?: number;
}

export interface GisMapProps {
  selectProvinceInfo: ProvinceInfoObj;
  selectCityInfo?: ProvinceInfoObj;
  menuList?: any;
  currentType: string;
  setCurrentType: React.Dispatch<React.SetStateAction<string>>;
}

const minZoomLevel = 7;
const provinceZoomLevel = 9;
const districtZoomLevel = 11;
const selectedNames = [
  '宽带资源上图',
  'OLT单/双上联分析',
  '千/百户小区资源预警',
];
const selectedNameMap = {
  all: '宽带资源上图',
  olt: 'OLT单/双上联分析',
  community: '千/百户小区资源预警',
};

const tipsStyle: CSSProperties = { left: '120px', top: '80px' };

export function GisMap(props: GisMapProps) {
  let autocompleteFlag = true;
  const [mapStyle, setMapStyle] = useState();
  const mapRef = useRef<any>();
  // 地图初始化
  const mapDomRef = useCallback((ref) => {
    if (ref !== null) {
      mapRef.current = ref;
      const map = ref.map as BMapGL.Map;
      map.enableContinuousZoom();
      // 触摸屏点击事件会被识别成drag事件，计算位移是否超过5
      let x = 0,
        y = 0,
        POSITION_OFFSET = 10;
      map.addEventListener('dragstart', (e) => {
        x = e.clientPos.x;
        y = e.clientPos.y;
      });

      map.addEventListener('dragend', (e) => {
        if (
          Math.abs(e.clientPos.x - x) < POSITION_OFFSET ||
          Math.abs(e.clientPos.y - y) < POSITION_OFFSET
        ) {
          handleMapClick();
        }
      });
    }
  }, []);

  // 详细地址搜索框
  const [searchInput, setSearchInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [placeSelected, setPlaceSelected] = useState<OptionObj[]>([
    {
      name: props.selectProvinceInfo.name,
      id: props.selectProvinceInfo?.id || '100000',
    },
    {
      name: props.selectCityInfo?.name || '',
      id: '100000',
    },
    {
      name: '',
      id: '3',
    },
  ]);

  const [ifShowSearchTool, setIfShowSearchTool] = useState(false);
  const [districtList, setDistrictList] = useState<OptionObj[]>([
    defaultProvince,
  ]);
  const [zoomLevel, setZoomLevel] = useState(provinceZoomLevel);
  const [centerPoint, setCenterPoint] = useState<BMapGL.Point>();
  const [ifHideOtherPoints, setIfHideOtherPoints] = useState(false);
  const [clickOnRelatingDevices, setClickOnRelatingDevices] = useState(true);

  // 边界数据
  const [edgePoints, setEdgePoints] = useState([[new BMapGL.Point(0, 0)]]);

  // 搜索列表
  const [signalDataList, setSignalDataList] = useState<SignalDataObj[]>();

  const [selectedDevice, setSelectedDevice] = useState<DeviceObj>();
  const [autoViewTrigger, setAutoViewTrigger] = useState(false);

  // 上下游设备
  const [relatingDevicePoints, setRelatingDevicePoints] =
    useState<RelatingDevice[]>();

  const [linePoints, setLinePoints] = useState([[new BMapGL.Point(0, 0)]]);

  // 县、区资源上图数据
  const [localOltDeviceList, setLocalOltDeviceList] = useState<LocalOltObj[]>();
  const [localObdDeviceList, setLocalObdDeviceList] = useState<LocalObdObj[]>();
  const [localCommunityDeviceList, setLocalCommunityDeviceList] =
    useState<LocalCommunityObj[]>();

  // 是否调用最佳视角
  const [needAutoBestView, setNeedAutoBestView] = useState(false);
  const [beforeAutoView, setBeforeAutoView] = useState<BMapGL.Viewport>();

  const [legendStatus, setLegendStatus] = useState<LegendStatusMapObj>(
    defaultLegendStatusMap
  );

  // 页面初始化
  useEffect(() => {
    // 地图样式
    fetchBMapStyle().then((res) => {
      setMapStyle(res);
    });
    return () => {
      setSearchInput('');
      setEdgePoints([[new BMapGL.Point(0, 0)]]);
    };
  }, []);

  const localOltDeviceShowList = useMemo(() => {
    if (localOltDeviceList) {
      if (legendStatus['OLT_SINGLE'] || legendStatus['OLT_DOUBLE']) {
        return localOltDeviceList.filter((item) =>
          legendStatus['OLT_SINGLE'] ? !item.isDoubleConn : item.isDoubleConn
        );
      } else if (!Object.values(legendStatus).filter((item) => item).length) {
        return localOltDeviceList;
      }
    }
    return undefined;
  }, [localOltDeviceList, legendStatus]);

  const localCommunityShowList = useMemo(() => {
    if (localCommunityDeviceList) {
      if (
        legendStatus['COMMUNITY_1000'] ||
        legendStatus['COMMUNITY_100'] ||
        legendStatus['COMMUNITY_0']
      ) {
        return localCommunityDeviceList.filter((item) => {
          const houseNum = item?.houseNum || 0;
          return legendStatus['COMMUNITY_1000']
            ? houseNum >= 1000
            : legendStatus['COMMUNITY_100']
            ? houseNum >= 100 && houseNum < 1000
            : houseNum < 100;
        });
      } else if (!Object.values(legendStatus).filter((item) => item).length) {
        return localCommunityDeviceList;
      }
    }
    return undefined;
  }, [localCommunityDeviceList, legendStatus]);

  // 省市区选择器列表，匹配联通地图信息，只请求一次就可以
  useEffect(() => {
    fetchStatesCodeList().then((res: any) => {
      const provinceList = res;
      const data: OptionObj[] = [];
      for (let province of provinceList) {
        // if (
        //   GIS_ALLOW_LIST.includes(province.text.slice(0, 2)) ||
        //   GIS_ALLOW_LIST.includes(province.text.slice(0, 3))
        // ) {
        data.push({
          name: province.text,
          id: province.value,
          children: province.children.map((city: any) => ({
            name: city.text,
            id: city.value,
            children: [
              {
                name: '全市',
                id: null,
              },
            ].concat(
              city.children.map((district: any) => ({
                name: district.text,
                id: district.value,
              }))
            ),
          })),
        });
        // }
      }
      setDistrictList(data);
    });
  }, []);

  // 各省标准gis坐标信息 只请求一次就可以
  const [provinceMapList, setProvinceMapList] = useState<GisProvinceObj[]>();
  useEffect(() => {
    fetchChinaMapWithName().then((res) => {
      const features = res.features;
      const list = features.map((item: any) => ({
        ...item.properties,
      }));
      setProvinceMapList(list);
    });
  }, []);

  // 将输入框的省市信息与外部同步
  useEffect(() => {
    // 在选择器列表中找到当前省分数据
    if (districtList) {
      let filter = districtList.filter(
        (item) =>
          simplifyProvinceName(item.name) ==
          simplifyProvinceName(props.selectProvinceInfo.name)
      );
      if (filter.length) {
        // 把被选中的省分放到list的第一位
        let index = districtList.findIndex(
          (item) =>
            simplifyProvinceName(item.name) ===
            simplifyProvinceName(filter[0].name)
        );
        if (index !== -1) {
          const target = districtList[index];
          const temp = JSON.parse(JSON.stringify(districtList));
          temp.splice(index, 1);
          temp.unshift(target);
          setDistrictList(temp);
        }
        if (props.selectCityInfo && props.selectCityInfo.name) {
          const cityList = filter[0].children;
          const districtList = (cityList as OptionObj[])[0].children;
          if (cityList) {
            let selectCityName = props.selectCityInfo?.name;
            let district = (
              (cityList as OptionObj[])[0].children as OptionObj[]
            )[0];
            if (
              DIRECT_CITY_LIST.includes(
                props.selectProvinceInfo.name.slice(0, 2)
              )
            ) {
              if (districtList) {
                district =
                  districtList.find(
                    (item) =>
                      simplifyProvinceName(item.name) ===
                      simplifyProvinceName(selectCityName)
                  ) || district;
              }
              selectCityName = props.selectProvinceInfo.name;
            }
            const city = cityList.find(
              (item) =>
                simplifyProvinceName(item.name) ===
                simplifyProvinceName(selectCityName)
            );
            if (city) {
              setPlaceSelected([filter[0], city, district]);
            }
          }
        } else {
          setPlaceSelected([
            filter[0],
            (filter[0].children as OptionObj[])[0],
            ((filter[0].children as OptionObj[])[0].children as OptionObj[])[0],
          ]);
        }
      } else {
        if (
          props.selectProvinceInfo.name &&
          props.selectProvinceInfo.name !== '全国'
        ) {
          message.tips_wrong({
            content: '未找到该省开通查询',
            style: tipsStyle,
          });
        }
      }
    }
  }, [props.selectCityInfo]);

  // 市一级标准gis坐标地图信息 根据选中的省查找
  const [cityMapList, setCityMapList] = useState<GisMapObj[]>();
  useEffect(() => {
    if (provinceMapList) {
      const province = provinceMapList.filter(
        (item: any) =>
          simplifyProvinceName(item.name) ===
          simplifyProvinceName(placeSelected[0].name)
      );
      if (province.length && province[0].id) {
        fetchChinaProvinceMapWithId(province[0].id + '0000').then((res) => {
          const features = res.features;
          const list = features.map((item: any) => ({
            ...item.properties,
          }));
          setCityMapList(list);
        });
      }
    }
    if (placeSelected[2].name === '全市') {
      setIfShowSearchTool(false);
    }
  }, [placeSelected]);

  // 当前被选中的城市
  const currentCity = useMemo(() => {
    if (cityMapList) {
      const city = cityMapList.filter(
        (item: any) =>
          simplifyProvinceName(item.name) ===
          simplifyProvinceName(placeSelected[1].name)
      );
      if (city.length && city[0]) {
        return city[0];
      } else {
        const province =
          provinceMapList &&
          provinceMapList.find(
            (item) =>
              simplifyProvinceName(item.name) ===
              simplifyProvinceName(placeSelected[0].name)
          );
        if (province) {
          return {
            adcode: province.id + '0000',
            name: province.name,
            center: province.center,
            centroid: province.cp,
            childrenNum: province.childNum,
          };
        }
      }
    }
    return undefined;
  }, [cityMapList, placeSelected]);

  function processDistrictInfoList(res: any, list: any) {
    list.forEach((t: any) => {
      t.data = res.data.list.find((ele: any) => ele.district.includes(t.name));
    });
    setDistrictMapList(list);
  }

  const typeIndex = useMemo(() => {
    return selectedNames.findIndex((t) => t.includes(props.currentType));
  }, [props.currentType]);

  useEffect(() => {
    setNeedAutoBestView(true);
    setBeforeAutoView(undefined);
    setAutoViewTrigger(!autoViewTrigger);
    // 跳过置空的状态
    if (props.currentType !== selectedNameMap.all) {
      setLegendStatus(defaultLegendStatusMap);
    }
  }, [props.currentType]);
  // ⚠️ ️这两个useEffect逻辑有嵌套
  useEffect(() => {
    handleMapClick();
    if (legendStatus.OBD) {
      props.setCurrentType(selectedNameMap.all);
    } else if (
      props.currentType === selectedNameMap.community &&
      (legendStatus.OLT_SINGLE || legendStatus.OLT_DOUBLE)
    ) {
      props.setCurrentType(selectedNameMap.all);
    } else if (
      props.currentType === selectedNameMap.olt &&
      (legendStatus.COMMUNITY_0 ||
        legendStatus.COMMUNITY_1000 ||
        legendStatus.COMMUNITY_100)
    ) {
      props.setCurrentType(selectedNameMap.all);
    }
  }, [legendStatus]);

  function queryDistrictInfo(province: string, city: string, list: any) {
    if (typeIndex === 0) {
      getResMap({ province, city }).then((res: any) => {
        processDistrictInfoList(res, list);
      });
    } else if (typeIndex === 1) {
      getOltAnalysisMap({ province, city }).then((res: any) => {
        processDistrictInfoList(res, list);
      });
    } else {
      getResCellResourcesMap({ province, city }).then((res: any) => {
        processDistrictInfoList(res, list);
      });
    }
  }

  // 区一级标准gis坐标地图信息
  const [ifShowDistrictMapList, setIfShowDistrictMapList] = useState(true);
  const [districtMapList, setDistrictMapList] = useState<GisMapObj[]>();
  useEffect(() => {
    if (currentCity) {
      initAllGisData();
      setRelatingDevicePoints(undefined);
      if (
        DIRECT_CITY_LIST.includes(currentCity.name.slice(0, 2)) ||
        currentCity.name.includes('省') ||
        currentCity.name.includes('自治区')
      ) {
        if (DIRECT_CITY_LIST.includes(currentCity.name.slice(0, 2))) {
          fetchChinaProvinceMapWithId(currentCity.adcode)
            .then((res) => {
              const features = res.features;
              return features.map((item: any) => ({
                ...item.properties,
              }));
            })
            .then((list: any) => {
              queryDistrictInfo(currentCity.name, currentCity.name, list);
            });
        }
      } else {
        fetchChinaDistrictMapWithId(currentCity.adcode)
          .then((res) => {
            const features = res.features;
            return features.map((item: any) => ({
              ...item.properties,
            }));
          })
          .then((list: any) => {
            let province = provinceMapList?.find(
              (t) => t.id === currentCity.adcode.toString().slice(0, 2)
            )?.name;
            let city = province + currentCity.name;
            queryDistrictInfo(province || '', city, list);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [currentCity, props.currentType]);

  const currentDistrict = useMemo(() => {
    if (districtMapList) {
      return districtMapList.find(
        (item) =>
          simplifyProvinceName(item.name) ===
          simplifyProvinceName(placeSelected[2].name)
      );
    }
    return undefined;
  }, [placeSelected, districtMapList]);
  useEffect(() => {
    if (
      districtMapList &&
      !localObdDeviceList &&
      !localOltDeviceList &&
      !localCommunityDeviceList
    ) {
      const coordinates = districtMapList.map(
        (item: any) => new BMapGL.Point(item.center[0], item.center[1])
      );
      const map = mapRef.current.map;
      const bestViewPort = map.getViewport(coordinates, {
        margins: [200, 0, -50, 0],
        zoomFactors: -1,
      }) as BMapGL.Viewport;
      map.centerAndZoom(bestViewPort.center, bestViewPort.zoom);
      console.log(bestViewPort, 'districtZoom');
    }
  }, [districtMapList]);

  // 获取打点数据
  useEffect(() => {
    if (
      placeSelected[2] &&
      placeSelected[2].name !== '全市' &&
      placeSelected[0].name !== '全国'
    ) {
      setIfShowDistrictMapList(false);
      setIfHideOtherPoints(false);

      getAllDevicesInDistrict({
        provName: placeSelected[0].name,
        cityName: placeSelected[1].name,
        regionName: simplifyProvinceName(placeSelected[2].name),
      }).then((res) => {
        const data = res.data;
        if (
          !data.qrmeEqpOlt?.length &&
          !data.qrmeEqpObd?.length &&
          !data.qaddrSegmSevenRes?.length
        ) {
          message.tips_wrong({ content: '该地区设备数据为空' });
        }
        setLocalOltDeviceList(data.qrmeEqpOlt);
        setLocalObdDeviceList(data.qrmeEqpObd);
        setLocalCommunityDeviceList(data.qaddrSegmSevenRes);
        setNeedAutoBestView(true);
        setBeforeAutoView(undefined);
        setAutoViewTrigger(!autoViewTrigger);
      });
    } else {
      setIfShowDistrictMapList(true);
    }
  }, [placeSelected]);

  // 生成打点数据的坐标Map
  const allPointsMap = useMemo(() => {
    let dataMap = new Map();
    // RES_TYPE_LIST [2530,2510,0000]
    let sourceList = [
      localObdDeviceList,
      localOltDeviceList,
      localCommunityDeviceList,
    ];
    sourceList.forEach((list, index) => {
      list &&
        list.forEach((item) => {
          const key = `${RES_TYPE_LIST[index].id}_${(item.wgs84X || 0).toFixed(
            6
          )}_${(item.wgs84Y || 0).toFixed(6)}`;
          dataMap.has(key)
            ? dataMap.set(key, dataMap.get(key) + 1)
            : dataMap.set(key, 1);
        });
    });
    return dataMap;
  }, [localOltDeviceList, localCommunityDeviceList, localObdDeviceList]);

  // 切换省市选择时，更改中心点和zoom级别
  useEffect(() => {
    if (mapRef.current?.map && !searchInput && placeSelected) {
      const map = mapRef.current.map as BMapGL.Map;
      if (placeSelected[2]?.name && placeSelected[2]?.name !== '全市') {
        const name =
          (DIRECT_CITY_LIST.includes(
            simplifyProvinceName(placeSelected[0].name)
          )
            ? ''
            : simplifyProvinceName(placeSelected[0].name)) +
          simplifyProvinceName(placeSelected[1].name) +
          simplifyProvinceName(placeSelected[2].name);
        map.centerAndZoom(name, districtZoomLevel);
      } else {
        if (placeSelected[1]?.name) {
          // 只传城市名称, 否则需要为直辖市写特例, 北京北京会找不到
          map.centerAndZoom(
            simplifyProvinceName(placeSelected[1].name),
            provinceZoomLevel
          );
        } else {
          if (placeSelected[0]?.name) {
            map.centerAndZoom(
              simplifyProvinceName(placeSelected[0].name),
              provinceZoomLevel
            );
          } else {
            map.centerAndZoom(
              simplifyProvinceName(props.selectProvinceInfo.name) +
                (props.selectCityInfo
                  ? simplifyProvinceName(props.selectCityInfo.name)
                  : ''),
              provinceZoomLevel
            );
          }
        }
      }
      console.log('zoom:[placeSelected]   ', map.getZoom());
    }
  }, [placeSelected, searchInput]);

  // 省分切换,清空地图数据
  useEffect(() => {
    // 清除图层
    handleSearchClear(provinceZoomLevel);
  }, [props.selectProvinceInfo]);

  // 地区切换清空地图数据
  useEffect(() => {
    handleSearchClear();
  }, [placeSelected]);

  // 调整最佳视角
  useEffect(() => {
    if (mapRef.current) {
      let coordinates: any = [];
      const map = mapRef.current.map;
      let margins = relatingDevicePoints?.length
        ? [230, 160, 40, 160]
        : [90, 20, 20, 20];

      let zoomFactor =
        relatingDevicePoints && relatingDevicePoints?.length < 10 ? -1 : -0.5;

      // olt地图自动调整，其他地图不调整
      if (relatingDevicePoints?.length) {
        setBeforeAutoView({
          zoom: map.getZoom(),
          center: map.getCenter(),
        });
        coordinates.push(
          ...relatingDevicePoints.map(
            (item) =>
              new BMapGL.Point(Number(item.WGS84_X), Number(item.WGS84_Y))
          )
        );
      } else if (needAutoBestView) {
        setNeedAutoBestView(false);
        if (
          props.currentType === selectedNameMap.olt &&
          localOltDeviceList?.length
        ) {
          zoomFactor = 0;

          coordinates.push(
            ...localOltDeviceList.map(
              (item) =>
                new BMapGL.Point(Number(item.wgs84X), Number(item.wgs84Y))
            )
          );
        } else if (
          props.currentType !== selectedNameMap.olt &&
          localCommunityDeviceList?.length
        ) {
          coordinates.push(
            ...localCommunityDeviceList.map(
              (item) =>
                new BMapGL.Point(Number(item.wgs84X), Number(item.wgs84Y))
            )
          );
        }
      } else {
        if (beforeAutoView) {
          map.centerAndZoom(beforeAutoView.center, beforeAutoView.zoom);
        }
      }
      if (coordinates && coordinates.length > 0) {
        const bestViewPort = map.getViewport(coordinates, {
          margins: margins,
          zoomFactor: zoomFactor,
        }) as BMapGL.Viewport;
        map.centerAndZoom(
          bestViewPort.center,
          bestViewPort.zoom < 17 ? bestViewPort.zoom : 17
        );
      }
      console.log('auto zoom', map.getZoom());
    }
  }, [relatingDevicePoints, localOltDeviceList, autoViewTrigger]);

  // 资源上图聚类函数
  function generateClusterData(
    deviceList: LocalIObject[],
    markerClusterer: any,
    deviceTypeCode: '2510' | '2530' | '0000'
  ) {
    markerClusterer.clearMarkers();
    const markers: BMapGL.Marker[] = [];
    const pointMap = new Map();
    deviceList.forEach((item, index) => {
      const [pointX, pointY] = [
        (item.wgs84X || 0).toFixed(6),
        (item.wgs84Y || 0).toFixed(6),
      ];
      const key = `${pointX}_${pointY}`;
      pointMap.has(key)
        ? pointMap.set(key, pointMap.get(key) + 1)
        : pointMap.set(key, 1);
      let offsetY = 0;
      if (deviceTypeCode === '2530') {
        offsetY += allPointsMap.get(`0000_${key}`) ? 1 : 0;
        offsetY += allPointsMap.get(`2510_${key}`) ? 1 : 0;
      }
      const [width, height] = getPointOffset(pointMap.get(key), 9);

      const marker = new BMapGL.Marker(
        new BMapGL.Point(Number(item['wgs84X']), Number(item['wgs84Y'])),
        {
          icon: getIconName(deviceTypeCode, item),
          offset: new BMapGL.Size(
            (32 + 6) * width,
            (40 + 8) * (height + offsetY) + ((index * 12) % 24)
          ),
        }
      );
      marker.addEventListener('click', () => {
        getLocalDeviceRelatingDevices(item, deviceTypeCode);
      });
      markers.push(marker);
    });
    markerClusterer.addMarkers(markers);
  }

  // 资源上图图例是否限制该类资源展示
  function handleIfShowList(type: keyof LegendStatusMapObj): boolean {
    for (let key in legendStatus) {
      if (legendStatus[key] && key !== type) {
        return false;
      }
    }
    return true;
  }

  // 资源上图 markers 聚类
  useEffect(() => {
    const map = mapRef.current && mapRef.current.map;
    let markers: BMapGL.Marker[] = [];
    // 0000 2530 2510
    const sizes = [32, 40, 48, 54];
    const clusterOpts: ClusterOptObj[] = [
      {
        minClusterSize: 5,
        maxZoom: 17,
        styles: sizes.map((size) => ({
          url: `./assets/marker/cluster/b_${size}.png`,
          size: new BMapGL.Size(size, size),
          textColor: '#70fbfe',
        })),
      },
      {
        minClusterSize: 5,
        maxZoom: 17.5,
        styles: sizes.map((size) => ({
          url: `./assets/marker/cluster/m_${size}.png`,
          size: new BMapGL.Size(size, size),
          textColor: '#1ae4ff',
        })),
      },
      {
        minClusterSize: 12,
        maxZoom: 16,
        styles: sizes.map((size) => ({
          url: `./assets/marker/cluster/o_${size}.png`,
          size: new BMapGL.Size(size, size),
          textColor: '#00FFB4',
        })),
      },
    ];
    const markerClustererList = clusterOpts.map((opt, index) => {
      return (
        map &&
        new BMapLib.MarkerClusterer(map, {
          markers: markers,
          minClusterSize: opt.minClusterSize,
          maxZoom: opt.maxZoom,
          styles: opt.styles,
        })
      );
    });

    if (props.currentType === selectedNameMap.community) {
      (handleIfShowList('COMMUNITY_1000') ||
        handleIfShowList('COMMUNITY_100') ||
        handleIfShowList('COMMUNITY_0')) &&
        localCommunityShowList?.length &&
        generateClusterData(
          localCommunityShowList,
          markerClustererList[0],
          '0000'
        );
    } else if (props.currentType === selectedNameMap.all) {
      (handleIfShowList('COMMUNITY_1000') ||
        handleIfShowList('COMMUNITY_100') ||
        handleIfShowList('COMMUNITY_0')) &&
        localCommunityShowList?.length &&
        generateClusterData(
          localCommunityShowList,
          markerClustererList[0],
          '0000'
        );
      handleIfShowList('OBD') &&
        localObdDeviceList?.length &&
        generateClusterData(localObdDeviceList, markerClustererList[1], '2530');
      localOltDeviceShowList?.length &&
        generateClusterData(
          localOltDeviceShowList,
          markerClustererList[2],
          '2510'
        );
    } else {
      markerClustererList[0] && markerClustererList[0].clearMarkers();
      markerClustererList[1] && markerClustererList[1].clearMarkers();
      markers = [];
      localOltDeviceShowList?.length &&
        generateClusterData(
          localOltDeviceShowList,
          markerClustererList[2],
          '2510'
        );
    }

    if (ifHideOtherPoints) {
      markerClustererList.forEach((item: any) => {
        item && item.clearMarkers();
      });
      markers = [];
    }
    return () => {
      // clear
      markers = [];
      markerClustererList.forEach((item: any) => {
        item && item.clearMarkers();
      });
    };
  }, [
    localCommunityDeviceList,
    localObdDeviceList,
    props.currentType,
    mapDomRef,
    ifHideOtherPoints,
    localCommunityShowList,
    localOltDeviceShowList,
    legendStatus,
  ]);
  const [routesOrigin, setRoutesOrigin] = useState<LocalDeviceType>();

  function handleMapClick() {
    if (!clickOnRelatingDevices) {
      if (
        selectedDevice &&
        selectedDevice.RES_TYPE_ID === '2530' &&
        routesOrigin !== '2510'
      ) {
        initAllGisData({
          ifClearEdge: false,
        });
      } else {
        initAllGisData();
      }
    }
    setClickOnRelatingDevices(false);
  }

  const onCompositionStart = () => {
    autocompleteFlag = false;
  };

  const onCompositionUpdate = () => {
    autocompleteFlag = false;
  };

  const onCompositionEnd = () => {
    autocompleteFlag = true;
    handleSearch();
  };

  const onSubmit = () => {
    // 回车后自动选择第一条数据，并进行定位
    if (signalDataList && signalDataList.length) {
      const tmp = JSON.parse(JSON.stringify(signalDataList[0]));

      setTimeout(() => {
        setSignalDataList(undefined);

        handleSearchResultSelect(tmp);
      }, 300);
    }
  };

  function handleChange(e: any) {
    if (isEmpty(inputRef.current?.value)) {
      setSignalDataList(undefined);

      return;
    }

    if (autocompleteFlag) {
      handleSearch();
    }
  }

  const [ifShowInfo, setIfShowInfo] = useState(false);
  function initAllGisData(
    opts: { ifClearEdge?: boolean } = { ifClearEdge: true }
  ) {
    setRelatingDevicePoints(undefined);
    setIfHideOtherPoints(false);
    setIfShowInfo(false);
    // setSelectedDevice(undefined);
    opts.ifClearEdge && setEdgePoints([[new BMapGL.Point(0, 0)]]);
    setLinePoints([[new BMapGL.Point(0, 0)]]);
  }

  function initLocalGisData() {
    setLocalCommunityDeviceList(undefined);
    setLocalObdDeviceList(undefined);
    setLocalOltDeviceList(undefined);
  }

  function handleSearch() {
    if (placeSelected.some((val) => !val) || isEmpty(inputRef.current?.value)) {
      message.tips_wrong({
        content: '地区选择不完整或地址未填写',
        style: tipsStyle,
      });
    } else {
      queryBiaoZhunDiZhi({
        addressName: inputRef.current?.value ? inputRef.current?.value : '',
        provinceId: placeSelected[0].id,
        cityId: placeSelected[1].id,
        districtId: placeSelected[2].id,
        pageNum: 0,
        pageSize: 20,
        sort: false,
        phraseQuery: false,
      })
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          if (res && res.data) {
            const data =
              localCommunityDeviceList &&
              res.data.filter((signal) =>
                localCommunityDeviceList.find(
                  (community) => community.segmId === signal.segmId
                )
              );
            if (data?.length) {
              setSignalDataList(data as SignalDataObj[]);
            } else {
              if (!signalDataList?.length) {
                message.tips_wrong({
                  content: '未查询到可用的标准地址',
                  style: tipsStyle,
                });
                setSignalDataList(undefined);
              }
            }
          } else {
            message.tips_wrong({
              content: '未查询到有效的数据',
              style: tipsStyle,
            });
            setSignalDataList(undefined);
          }
        });
    }
  }

  function handleSearchClear(zoomLevel?: number, ifNoClearGis?: boolean) {
    setSearchInput('');
    setSignalDataList(undefined);
    zoomLevel && setZoomLevel(zoomLevel);
    initAllGisData();
    !ifNoClearGis && initLocalGisData();
  }

  function handleSearchResultSelect(item: SignalDataObj) {
    // 更新查询关键字
    setSearchInput(item.addressName ? item.addressName : '');
    // 清除查询结果
    setSignalDataList(undefined);

    const target =
      localCommunityDeviceList &&
      localCommunityDeviceList.find(
        (community) => community.segmId === item.segmId
      );
    getLocalDeviceRelatingDevices(
      {
        segmId: item.segmId,
        wgs84X: target ? target.wgs84X : Number(item.latWgs),
        wgs84Y: target ? target.wgs84Y : Number(item.lngWgs),
      },
      '0000'
    );
  }

  function getLocalDeviceRelatingDevices(
    item: LocalOltObj | LocalObdObj | LocalCommunityObj | LocalIObject,
    RES_TYPE_ID: '2510' | '2530' | '0000'
  ) {
    setCenterPoint(new BMapGL.Point(item.wgs84X || 0, item.wgs84Y || 0));

    if ('eqpId' in item) {
      getRelatingDevices(
        {
          EQP_ID: item.eqpId,
          RES_TYPE_ID: RES_TYPE_ID,
        },
        item
      );
    }
    if ('segmId' in item) {
      getRelatingDevices(
        {
          EQP_ID: item.segmId,
          RES_TYPE_ID: RES_TYPE_ID,
        },
        item
      );
    }
  }

  function handleGetDeviceInfo(
    item: DeviceObj | RelatingDevice,
    tmp: DeviceObj | RelatingDevice,
    ifClickOnRoutes?: boolean
  ) {
    setClickOnRelatingDevices(!!ifClickOnRoutes);
    getDeviceInfo({
      EQP_ID: item.EQP_ID,
      RES_TYPE_ID: item.RES_TYPE_ID,
      PRO_CODING: placeSelected[0].id,
    }).then((res) => {
      const data = res.data;
      if (data) {
        if (item.RES_TYPE_ID === '0000') {
          tmp.EQP_NAME = data.segmName;
          tmp.PORT_NUM = data.portNum;
          tmp.PORT_TAKEUP_NUM = data.portUserNum;
          tmp.PORT_OCCUPANCY_RATE = String(
            (Number(data.portUsage || 0) * 100).toFixed(2)
          );
          tmp.BUSINESS_ROOM_NUM = data.busiHouseNum;
          tmp.ROOM_NUM = data.houseNum;

          tmp.OBD_NUM = data.obdNum;
          tmp.ONU_NUM = data.onuNum;

          tmp.IS_GIGA = data.isGiga;
        } else {
          tmp.EQP_NAME = data.eqpName;

          tmp.IS_DOUBLE_CONN = data.isDoubleConn;
          tmp.PORT_NUM = data.portNum;
          tmp.PORT_OCCUPANCY_RATE = data.portUsage;
        }
        setSelectedDevice(tmp);
        setIfShowInfo(true);
      }
    });
  }

  function getRelatingDevices(
    item: DeviceObj | RelatingDevice,
    patch?: LocalCommunityObj | LocalObdObj | LocalOltObj
  ) {
    setRoutesOrigin(item.RES_TYPE_ID as LocalDeviceType);
    let tmp = JSON.parse(JSON.stringify(item));
    if (patch) {
      tmp.WGS84_X = patch.wgs84X;
      tmp.WGS84_Y = patch.wgs84Y;
      tmp.RES_TYPE_ID = item.RES_TYPE_ID;
      if ('eqpName' in patch) {
        tmp.EQP_NAME = patch.eqpName;

        tmp.IS_DOUBLE_CONN = patch.isDoubleConn;
        tmp.PORT_NUM = patch.portNum;
        tmp.PORT_OCCUPANCY_RATE = patch.portUsage;
      }

      if ('segmName' in patch) {
        tmp.EQP_NAME = patch.segmName;
        tmp.PORT_NUM = patch.portNum;
        tmp.PORT_TAKEUP_NUM = patch.portUserNum;
        tmp.PORT_OCCUPANCY_RATE = String(
          (Number(patch.portUsage || 0) * 100).toFixed(2)
        );
        tmp.BUSINESS_ROOM_NUM = patch.busiHouseNum;
        tmp.ROOM_NUM = patch.houseNum;

        tmp.OBD_NUM = patch.obdNum;
        tmp.ONU_NUM = patch.onuNum;

        tmp.IS_GIGA = patch.isGiga;
      }
    }

    handleGetDeviceInfo(item, tmp);

    // if (GIS_LOCAL_DATA_LIST.includes(placeSelected[0].name.slice(0, 2))) {
    // HACK 接口替换
    // queryRoutes({
    queryRoutesLocal({
      PRO_CODING: placeSelected[0].id,
      EQP_ID: item.EQP_ID,
      RES_TYPE_ID: item.RES_TYPE_ID,
    }).then((res) => {
      // HACK 接口替换
      // const PATH_LIST = res?.PATH_LIST;
      const PATH_LIST = res.data?.list;
      if (res && PATH_LIST) {
        if (!PATH_LIST) {
          message.warning({ content: '查询到的链路为空' });
        }
        let lines = [],
          points = [];
        let pointMap = new Map();
        let deviceMap = new Map();
        for (let i = 0; i < PATH_LIST.length; i++) {
          // HACK 接口替换
          // const [start, end] = processOnePath(PATH_LIST[i]);
          const [start, end] = processOnePathLocal(PATH_LIST[i]);
          // if (start.WGS84_X && start.WGS84_Y && end.WGS84_X && end.WGS84_Y) {
          //   lines.push([
          //     new BMapGL.Point(Number(start.WGS84_X), Number(start.WGS84_Y)),
          //     new BMapGL.Point(Number(end.WGS84_X), Number(end.WGS84_Y)),
          //   ]);
          // }
          [start, end].forEach((item) => {
            if (item.WGS84_Y && item.WGS84_X) {
              const [pointX, pointY] = [
                (item.WGS84_X || 0).toFixed(6),
                (item.WGS84_Y || 0).toFixed(6),
              ];
              const pointKey = `${pointX}_${pointY}`;
              const eqpId = `${item.EQP_ID}`;

              pointMap.has(pointKey)
                ? pointMap.set(pointKey, pointMap.get(pointKey) + 1)
                : pointMap.set(pointKey, 1);

              if (item.RES_TYPE_ID === '2530') {
                if (deviceMap.has(eqpId)) {
                  item.WGS84_X = deviceMap.get(eqpId)[0];
                  item.WGS84_Y = deviceMap.get(eqpId)[1];
                } else {
                  const offset =
                    (allPointsMap.get(`2510_${pointKey}`) ? 1 : 0) +
                    (allPointsMap.get(`0000_${pointKey}`) ? 1 : 0);

                  const [width, height] = getPointOffset(
                    pointMap.get(pointKey),
                    15
                  );
                  const [offsetX, offsetY] = [width, height + offset];
                  item.WGS84_X = Number(
                    (
                      item.WGS84_X +
                      (offsetX + generateRadomNum()) * 0.0001
                    ).toFixed(10)
                  );
                  item.WGS84_Y = Number(
                    (
                      item.WGS84_Y +
                      (Math.ceil(offsetY / 2) + generateRadomNum()) *
                        0.0001 *
                        (offsetY % 2 ? -1 : 1)
                    ).toFixed(10)
                  );
                  deviceMap.set(eqpId, [item.WGS84_X, item.WGS84_Y]);
                }
              }
            }
          });

          start.WGS84_X && start.WGS84_Y && points.push(start);
          end.WGS84_X && end.WGS84_Y && points.push(end);

          if (start.WGS84_X && start.WGS84_Y && end.WGS84_X && end.WGS84_Y) {
            lines.push([
              new BMapGL.Point(Number(start.WGS84_X), Number(start.WGS84_Y)),
              new BMapGL.Point(Number(end.WGS84_X), Number(end.WGS84_Y)),
            ]);
          }
        }

        const uniquePoints = uniqueArray(points, 'EQP_ID') as RelatingDevice[];
        if (uniquePoints.length < 1) {
          message.success({ content: '链路上只有本设备' });
        }
        if (!uniquePoints.find((item) => item.EQP_ID === tmp.EQP_ID)) {
          // 后加入tmp，防止被覆盖
          uniquePoints.push(tmp);
        }

        setIfHideOtherPoints(true);
        setRelatingDevicePoints(uniquePoints);
        setLinePoints(lines);
        // 获取小区的坐标点
        const communityPoints = uniquePoints.filter(
          (item) => item.RES_TYPE_ID === '0000'
        );
        let communityIds: string[] = [];
        communityPoints.forEach((item: RelatingDevice) => {
          communityIds.push(item.EQP_ID);
        });
        // 获取边界
        queryCommunityEdges(communityIds.join(','));
      } else {
        message.warning({ content: '未查询到链路' });

        setRelatingDevicePoints([]);
        setLinePoints([[new BMapGL.Point(0, 0)]]);
      }
    });
    // }
  }

  // 链路展示
  useEffect(() => {
    function generateRelatingClusterData(
      deviceList: RelatingDevice[],
      markerClusterer: MarkerClustererObj
    ) {
      markerClusterer.clearMarkers();
      const markers: Array<BMapGL.Marker> = [];
      deviceList.forEach((item, index) => {
        const marker = new BMapGL.Marker(
          new BMapGL.Point(Number(item.WGS84_X), Number(item.WGS84_Y)),
          {
            icon: getDeviceIconName(item),
          }
        );

        // ⚠️ 只有2530从这里过
        marker.addEventListener('click', () => {
          handleGetDeviceInfo(item, { ...item }, true);
        });
        if (item.RES_TYPE_ID === '2530') {
          markers.push(marker);
        }
      });
      markerClusterer.addMarkers(markers);
    }

    const map = mapRef.current && mapRef.current.map;
    let markers: BMapGL.Marker[] = [];
    const styles = [
      {
        url: `./assets/marker/cluster/m_48.png`,
        size: new BMapGL.Size(48, 48),
        textColor: '#70fbfe',
      },
      {
        url: `/assets/marker/2530_Y.png`,
        size: new BMapGL.Size(32, 37),
        textColor: '#70fbfe',
      },
      {
        url: `/assets/marker/2530_G.png`,
        size: new BMapGL.Size(32, 37),
        textColor: '#70fbfe',
      },
      {
        url: `/assets/marker/2530_R.png`,
        size: new BMapGL.Size(32, 37),
        textColor: '#70fbfe',
      },
    ];
    const markerClustererList: MarkerClustererObj[] = styles.map(
      (item) =>
        map &&
        new BMapLib.MarkerClusterer(map, {
          markers: markers,
          minClusterSize: 3,
          maxZoom: 18.5,
          styles: [item],
        })
    );

    relatingDevicePoints &&
      generateRelatingClusterData(relatingDevicePoints, markerClustererList[0]);
    return () => {
      // clear
      markers = [];
      markerClustererList.forEach((item: any) => {
        item?.clearMarkers() && item.clearMarkers();
      });
    };
  }, [relatingDevicePoints]);

  function queryCommunityEdges(ids: string) {
    if (!ids) {
      return;
    }

    queryCmtreoPolygon({
      province: placeSelected[0].name,
      segmIds: ids,
    })
      .then((res: any) => {
        return res.data;
      })
      .then((res) => {
        let all = [];

        if (res && res.features && res.features.length) {
          const features = res.features;

          for (const feature of features) {
            if (feature.geometry.type == 'MultiPolygon') {
              for (const item of feature.geometry.coordinates) {
                for (const element of item) {
                  let coordinates = [];
                  for (const child of element) {
                    coordinates.push(new BMapGL.Point(child[0], child[1]));
                  }

                  all.push(coordinates);
                }
              }
            } else {
              let coordinates = [];
              for (const item of feature.geometry.coordinates) {
                for (const element of item) {
                  coordinates.push(new BMapGL.Point(element[0], element[1]));
                }

                all.push(coordinates);
              }
            }
          }
        }

        setEdgePoints(all);
      });
  }

  function handleDistrictNameClick(item: GisMapObj) {
    if (placeSelected[1]?.name) {
      setPlaceSelected((prevState) => {
        const temp = JSON.parse(JSON.stringify(prevState));
        temp[2].name = item.name;
        return temp;
      });
    } else {
      if (
        DIRECT_CITY_LIST.includes(simplifyProvinceName(placeSelected[0].name))
      ) {
        setPlaceSelected((prevState) => {
          const temp = JSON.parse(JSON.stringify(prevState));
          temp[1] = JSON.parse(JSON.stringify(temp[0].children[0]));
          temp[2] = item;
          return temp;
        });
      } else {
        message.tips_wrong({
          content: '请选择市',
          style: tipsStyle,
        });
      }
    }
  }

  const [windowWidth] = useViewport();

  return (
    <>
      {mapStyle && (
        <div
          style={{
            width: '1920px',
            height: '1080px',
            position: 'fixed',
            top: 0,
            left: 0,
            zoom: 1 / (windowWidth / 1920),
          }}
        >
          <BMap
            ref={mapDomRef}
            center={centerPoint || new BMapGL.Point(0, 0)}
            enableScrollWheelZoom
            zoom={zoomLevel}
            style={{
              width: windowWidth,
              height: 1080 * (windowWidth / 1920),
            }}
            mapStyleV2={{
              styleJson: mapStyle,
            }}
            defaultOptions={{
              styleUrl:
                '//10.168.11.225:8081/baidumap/bmapgl/mapstyle/mapstyle.json',
            }}
            heading={0}
            tilt={0}
            minZoom={minZoomLevel}
            onClick={() => {
              handleMapClick();
            }}
            className="broadband-gis"
            displayOptions={{
              indoor: false,
              building: false,
              street: false,
              layer: false,
            }}
          >
            <ZoomControl map={mapRef.current} />
            {edgePoints.map((edge, index) => {
              return (
                <Polygon
                  map={mapRef.current}
                  path={edge}
                  strokeColor="#00C1FF"
                  strokeWeight={2}
                  fillColor="#00C1FF"
                  fillOpacity={0.2}
                  key={`edge${index}`}
                />
              );
            })}
            {!searchInput &&
              ifShowDistrictMapList &&
              districtMapList &&
              districtMapList.map((item, index) =>
                item.centroid ? (
                  <CustomOverlay
                    map={mapRef.current}
                    position={
                      new BMapGL.Point(
                        Number(item.centroid[0]),
                        Number(item.centroid[1])
                      )
                    }
                    offset={new BMapGL.Size(0, -40)}
                    key={item.adcode}
                  >
                    <Tooltip
                      index={index}
                      sum={districtMapList.length}
                      duration={8}
                    >
                      <div
                        className="label"
                        onClick={() => {
                          handleDistrictNameClick(item);
                        }}
                      >
                        {item.name}
                      </div>
                      <div className="content">
                        {Object.keys(nameMap[typeIndex]).map(
                          (t: any, index: number) => {
                            let name = (nameMap[typeIndex] as any)[t] as any;
                            return (
                              <div className="item" key={item.name + index}>
                                <span className="key">{name}</span>
                                <span className="value">
                                  {item.data &&
                                  item.data[t] !== null &&
                                  item.data[t] !== undefined
                                    ? convertMeasure(item.data[t]).join('') +
                                      getUnit(name)
                                    : '--'}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </Tooltip>
                  </CustomOverlay>
                ) : (
                  <Fragment key={item.adcode}></Fragment>
                )
              )}

            {relatingDevicePoints?.length &&
              relatingDevicePoints.map((item, index) =>
                item.RES_TYPE_ID !== '2530' ? (
                  <Fragment key={`${item.WGS84_X}-${item.WGS84_Y}-${index}`}>
                    <Marker
                      map={mapRef.current}
                      position={
                        new BMapGL.Point(
                          Number(item.WGS84_X),
                          Number(item.WGS84_Y)
                        )
                      }
                      icon={getIconName('other', item)}
                      onClick={() => {
                        if (
                          item.RES_TYPE_ID === '2510' &&
                          selectedDevice &&
                          item.EQP_ID !== selectedDevice.EQP_ID
                        ) {
                          getRelatingDevices(item);
                        } else {
                          handleGetDeviceInfo(item, { ...item }, true);
                        }
                      }}
                    />
                  </Fragment>
                ) : (
                  <Fragment
                    key={`${item.WGS84_X}-${item.WGS84_Y}-${index}`}
                  ></Fragment>
                )
              )}

            <ConnectLine points={linePoints} map={mapRef} />

            {ifShowInfo &&
              selectedDevice &&
              selectedDevice.WGS84_X &&
              selectedDevice.WGS84_Y && (
                <InfoWindow
                  map={mapRef.current}
                  position={
                    new BMapGL.Point(
                      Number(selectedDevice.WGS84_X),
                      Number(selectedDevice.WGS84_Y)
                    )
                  }
                  height={selectedDevice.RES_TYPE_ID == '0000' ? 205 : 120}
                  width={320}
                  offset={new BMapGL.Size(-35, 35)}
                >
                  {selectedDevice.RES_TYPE_ID == '2510' && (
                    <InfoWrapper>
                      <div
                        className={`header type-${selectedDevice.RES_TYPE_ID} ${
                          selectedDevice.IS_DOUBLE_CONN ? 'active' : ''
                        }`}
                        data-tooltip={selectedDevice.EQP_NAME}
                      >
                        <div className="txt">{selectedDevice.EQP_NAME}</div>
                        <div
                          className="close"
                          onClick={() => {
                            setSelectedDevice(undefined);
                          }}
                        >
                          <span
                            className="iconfont icon-close"
                            style={{ color: '#1d92fb' }}
                          ></span>
                        </div>
                      </div>
                      <div className="clearfix"></div>
                      <div className="item short">
                        <span className="label"> PON端口数: </span>
                        <span className="value">
                          {selectedDevice['PORT_NUM']}
                        </span>
                      </div>
                      <div className="item">
                        <span className="label"> PON端口占用率: </span>
                        <span className="value">
                          {(
                            Number(selectedDevice['PORT_OCCUPANCY_RATE']) * 100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                      <div className="clearfix"></div>
                    </InfoWrapper>
                  )}
                  {selectedDevice.RES_TYPE_ID == '2530' && (
                    <InfoWrapper>
                      <div
                        className={`header type-${selectedDevice.RES_TYPE_ID} ${
                          Number(selectedDevice.PORT_OCCUPANCY_RATE) * 100 <
                          resourceLegendList[0].limit
                            ? 'underutilization'
                            : Number(selectedDevice.PORT_OCCUPANCY_RATE) * 100 <
                              resourceLegendList[1].limit
                            ? 'normal'
                            : 'prewarning'
                        }`}
                        data-tooltip={selectedDevice.EQP_NAME}
                      >
                        <div className="txt">{selectedDevice.EQP_NAME}</div>
                        <div
                          className="close"
                          onClick={() => {
                            setSelectedDevice(undefined);
                          }}
                        >
                          <span
                            className="iconfont icon-close"
                            style={{ color: '#1d92fb' }}
                          ></span>
                        </div>
                      </div>
                      <div className="clearfix"></div>
                      <div className="item short">
                        <span className="label"> 端口数: </span>
                        <span className="value">
                          {selectedDevice['PORT_NUM']}
                        </span>
                      </div>
                      <div className="item">
                        <span className="label"> 端口占用率: </span>
                        <span className="value">
                          {(
                            Number(selectedDevice['PORT_OCCUPANCY_RATE']) * 100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                      <div className="clearfix"></div>
                    </InfoWrapper>
                  )}
                  {selectedDevice.RES_TYPE_ID == '0000' && (
                    <CommunityInfoWrapper>
                      <div
                        // className={`header type-${selectedDevice.RES_TYPE_ID} ${selectedDevice.IS_GIGA == 1 ? 'isGiga' : ''}`}
                        className={`header type-0000`}
                        data-tooltip={selectedDevice.EQP_NAME}
                      >
                        <div className="txt">{selectedDevice.EQP_NAME}</div>
                        <div
                          className="close"
                          onClick={() => {
                            setSelectedDevice(undefined);
                          }}
                        >
                          <span
                            className="iconfont icon-close"
                            style={{ color: '#1d92fb' }}
                          ></span>
                        </div>
                        <div className="clearfix"></div>
                      </div>
                      <div className="clearfix"></div>
                      <div className="item">
                        <span className="label"> 小区总户数: </span>
                        <span className="value">
                          {selectedDevice['ROOM_NUM']}
                        </span>
                      </div>
                      <div className="item">
                        <span className="label"> 开通联通业务户数: </span>
                        <span className="value">
                          {selectedDevice['BUSINESS_ROOM_NUM']}
                        </span>
                      </div>
                      <div className="item">
                        <span className="label"> 末梢OBD设备数: </span>
                        <span className="value">
                          {selectedDevice['OBD_NUM']}
                        </span>
                      </div>
                      <div className="item">
                        <span className="label"> ONU设备数: </span>
                        <span className="value">
                          {selectedDevice['ONU_NUM']}
                        </span>
                      </div>
                      <div className="item full">
                        <span className="label"> 末梢OBD端口数: </span>
                        <span className="value">
                          {selectedDevice['PORT_NUM']}
                        </span>
                      </div>
                      <div className="item full">
                        <span className="label"> 末梢OBD端口占用率: </span>
                        <span className="value">
                          {Number(
                            selectedDevice['PORT_OCCUPANCY_RATE']
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                      <div className="clearfix"></div>
                    </CommunityInfoWrapper>
                  )}
                </InfoWindow>
              )}
          </BMap>
        </div>
      )}
      <SearchContainer
        style={ifShowSearchTool ? {} : { backgroundSize: '100% 50%' }}
        id="draggable-search"
      >
        <form
          className="search-form"
          method="post"
          onSubmit={(event) => {
            onSubmit();

            event.preventDefault();
            return false;
          }}
        >
          <div className="form-item">
            <div className="label" style={{ whiteSpace: 'nowrap' }}>
              所在地区:
            </div>
            <CityPicker
              data={districtList || []}
              userPicker={placeSelected || []}
              setUserPicker={setPlaceSelected}
              style={{ width: '70%' }}
            ></CityPicker>

            <button
              className="text-button"
              onClick={() => {
                setIfShowSearchTool(!ifShowSearchTool);
              }}
              style={{
                color: '#1966ff',
                lineHeight: '31px',
                visibility:
                  placeSelected[2].name !== '全市' ? 'visible' : 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {ifShowSearchTool ? (
                <>
                  收起
                  <span className="iconfont icon-arrow-up-filling"></span>
                </>
              ) : (
                <>
                  更多
                  <span className="iconfont icon-arrow-down-filling"></span>
                </>
              )}
            </button>
          </div>

          <div
            style={{
              visibility: ifShowSearchTool ? 'visible' : 'hidden',
            }}
          >
            <div
              className="form-item"
              style={{ visibility: ifShowSearchTool ? 'visible' : 'hidden' }}
            >
              <div className="label">详细地址:</div>
              <input
                ref={inputRef}
                placeholder="请输入搜索关键字"
                name="address"
                type="text"
                autoComplete="off"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  handleChange(e);
                }}
                onCompositionEnd={onCompositionEnd}
                onCompositionStart={onCompositionStart}
                onCompositionUpdate={onCompositionUpdate}
              />
              <div
                className="close-icon"
                onClick={() => {
                  handleSearchClear(0, true);
                }}
              >
                <img src={closeIcon} alt="" width={16} height={16} />
              </div>
            </div>
            <div className="button-container" style={{ marginLeft: '26px' }}>
              <button
                className="main-button"
                onClick={() => {
                  handleSearch();
                }}
              >
                搜索
              </button>
              <button
                className="plain-button"
                onClick={() => {
                  handleSearchClear(0, true);
                }}
              >
                清除
              </button>
            </div>
          </div>
        </form>
      </SearchContainer>

      {signalDataList?.length && (
        <SearchResultContainer>
          {signalDataList.map((item, index) => (
            <div
              className="row search-result-item"
              key={index}
              onClick={() => {
                handleSearchResultSelect(item);
              }}
            >
              <span className="iconfont icon-location-fill location-icon"></span>
              <div>
                <div
                  className="text"
                  dangerouslySetInnerHTML={{
                    __html: item.addressHighlightStr,
                  }}
                ></div>
                <div className="sm-text">{item.addressName}</div>
              </div>
            </div>
          ))}
        </SearchResultContainer>
      )}
      <div
        className="legend-container"
        style={{ visibility: ifShowDistrictMapList ? 'hidden' : 'visible' }}
      >
        <LegendContainer
          setDeviceStatus={setLegendStatus}
          deviceStatus={legendStatus}
        />
      </div>

      <EmptyContainer>
        <ParallelNav
          jump={() => {}}
          show={() => {}}
          customMenu={props.menuList}
          style={{ width: '430px' }}
          currentType={props.currentType}
          setSelectedName={props.setCurrentType}
        />
      </EmptyContainer>
    </>
  );
}

export default GisMap;

interface ConnectLineProps {
  points: any;
  map: any;
}

export function ConnectLine(props: ConnectLineProps) {
  return (
    props.points?.length &&
    props.points.map((item: any, index: any) => (
      <Fragment key={`linePoints-${index}`}>
        <Polyline
          map={props.map.current}
          path={item}
          strokeColor="#1D92FB"
          strokeWeight={2}
        />
      </Fragment>
    ))
  );
}
