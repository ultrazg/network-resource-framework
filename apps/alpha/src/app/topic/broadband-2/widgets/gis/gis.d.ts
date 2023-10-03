interface DATAOBJECT {
  EQP_ROLES?: string;
  ANT_NUM?: string;
  ADDR_NUM?: any;
  ROOM_NUM?: number;
  BUSINESS_RATE?: string;
}
interface IObject {
  [key: string]: any;
}

interface MarkerClustererObj {
  markers: BMapGL.Marker[];
  h?: {
    gridSize?: number;
    maxZoom?: number;
    minClusterSize?: number;
    isAverageCenter?: boolean;
    styles?: {
      url: string;
      size: BMapGL.Size;
      textColor: string;
    }[];
  };
  clearMarkers: Function;
  addMarkers: Function;
}

interface SignalDataObj {
  latWgs: string | null;
  lngWgs: string | null;
  addressName?: string;
  addressValue?: number;
  addressHighlightStr: string;
  interType?: string;
  bandwidth?: string;
  ifShowDetail?: boolean;
  provinceName: string;
  segmId: string;
  segmType: string;
  provinceId: string;
  RESP_CODE?: string;
  DATA_OBJECT?: DATAOBJECT;
}
type LocalDeviceType = '2510' | '2530' | '0000';
interface DeviceObj {
  EQP_ID: string;
  RES_TYPE_ID: string;
  RES_TYPE_NAME?: string;
  EQP_NAME?: string;
  WGS84_X?: number;
  WGS84_Y?: number;
  ACCESS_NAME?: string;
  BUSINESS_TYPE?: string;
  PORT_TOTAL_NUM?: number;
  PORT_TAKEUP_NUM?: number;
  PORT_FREE_NUM?: number;
  PORT_TAKEUP_RATE?: string;
  PORT_OCCUPANCY_RATE?: string | number;
  PORT_NUM?: number;

  BUSINESS_ROOM_NUM?: number;
  OBD_NUM?: number;
  ONU_NUM?: number;
  ROOM_NUM?: number;

  IS_DOUBLE_CONN?: number;
  IS_GIGA?: number;

  [key: string]: number | string;
}

interface LocalIObject {
  wgs84X?: number;
  wgs84Y?: number;
}

interface InfoObj {
  eqpId?: string;
  eqpName?: string;
  provName?: string;
  cityName?: string;
  regionName?: string;
  manageIpaddress?: string;
  wgs84X?: number;
  wgs84Y?: number;
  portNum?: number;
  portUserNum?: number;
  portUsage?: number;
  isDoubleConn?: number;

  segmId?: string;
  segmName?: string;
  houseNum?: number;
  obdNum?: number;
  onuNum?: number;
  busiHouseNum?: number;
  isGiga?: number;

  oltId?: string;
  ponId?: string;
  technicalMode?: number;
  lastObdFlag?: number;
  commWgs84X?: number;
  commWgs84Y?: number;
  bldgWgs84X?: number;
  bldgWgs84Y?: number;
}

interface LocalObdObj extends LocalIObject {
  eqpId: string;
  eqpName?: string;
  oltId?: string;
  ponId?: string;
  technicalMode?: number;
  isGiga?: number;
  isDoubleConn?: number;
  lastObdFlag?: number;
  provName?: string;
  cityName?: string;
  regionName?: string;
  portNum?: number;
  portUserNum?: number;
  portUsage?: number;

  commWgs84?: any;
  commWgs84Y?: number;
  bldgWgs84X?: number;
  bldgWgs84Y?: number;
}

interface LocalCommunityObj extends LocalIObject {
  segmId: string;
  segmName?: string;
  provName?: string;
  cityName?: string;
  regionName?: string;

  houseNum?: number;
  obdNum?: number;
  portNum?: number;
  portUserNum?: number;
  portUsage?: number;
  onuNum?: number;
  busiHouseNum?: number;
  isGiga?: number;
  isDoubleConn?: number;
}

interface LocalOltObj extends LocalIObject {
  eqpId: any;
  eqpName?: string;
  provName?: string;
  cityName?: string;
  regionName?: string;
  manageIpaddress?: any;

  portNum?: number;
  portUserNum?: number;
  portUsage?: number;
  isDoubleConn?: number;
}

interface RelatingDevice extends DeviceObj {
  PATH_NUM: string;
  SEQ_NUM: string;
}

interface LocalPathObj {
  A_EQP_ID: string;
  A_RES_TYPE_ID: string;
  A_WGS84_X: number;
  A_WGS84_Y: number;
  A_PORT_OCCUPANCY_RATE?: number;
  Z_EQP_ID?: string;
  Z_RES_TYPE_ID?: string;
  Z_WGS84_X?: number;
  Z_WGS84_Y?: number;
  Z_PORT_OCCUPANCY_RATE?: number;
  HOUSE_NUM?: number;
  IS_DOUBLE_CONN?: number;
}

interface PathObj {
  A_EQP_ID: string;
  A_RES_TYPE_ID: string;
  A_RES_TYPE_NAME: string;
  A_EQP_NAME: string;
  A_WGS84_X: string;
  A_WGS84_Y: string;
  A_RES_STATE?: any;
  A_PORT_NUM: number;
  A_PORT_OCCUPANCY_RATE: string;
  Z_EQP_ID: string;
  Z_RES_TYPE_ID: string;
  Z_RES_TYPE_NAME?: string;
  Z_EQP_NAME: string;
  Z_WGS84_X: string;
  Z_WGS84_Y: string;
  Z_PORT_NUM: number;
  Z_PORT_OCCUPANCY_RATE: string;
  Z_RES_STATE?: any;

  ONU_NUM?: number;
  OBD_NUM?: number;
  BUSINESS_ROOM_NUM?: number;
  ROOM_NUM?: number;

  [key: string]: number | string;
}

interface Coordinate {
  WGS84_X: string | null;
  WGS84_Y: string | null;
}

interface GisMapObj {
  adcode: number;
  name: string;
  center: number[];
  centroid: number[];
  childrenNum: number;
  level?: string;
  subFeatureIndex?: number;
  acroutes?: number[];
  data?: any;
}

interface GisProvinceObj {
  id: string;
  size: string;
  name: string;
  center: number[];
  cp: number[];
  childNum: number;
}

interface MarkerType {
  [key: string]: BMapGL.Icon;
}

interface LegendStatusMapObj {
  OLT_SINGLE: boolean;
  OLT_DOUBLE: boolean;
  OBD: boolean;
  COMMUNITY_0: boolean;
  COMMUNITY_100: boolean;
  COMMUNITY_1000: boolean;

  [key: string]: boolean;
}

interface LegendObj {
  name: string;
  icon: string;
  key: string;
}

interface SignalSignalDataResObj {
  districtCode: string;
  townCode?: any;
  cityCode: string;
  gcjLocation?: string;
  parentSegmType?: any;
  cityId: string;
  roomCode?: any;
  addressKeyStr?: any;
  segmId: string;
  cityName: string;
  addressNameForSuggestion: string;
  unitCode?: any;
  addressHighlightStr: string;
  alias?: any;
  addressFrom: string;
  latWgs?: string;
  lngGcj?: string;
  addressCode: string;
  resCovered?: string;
  districtName: string;
  provinceCode: string;
  roadCode?: any;
  provinceId: string;
  villageCode?: any;
  districtId: string;
  segmType: string;
  parentSegmId: string;
  lngWgs?: string;
  addressNameHighlight: string;
  addressPrefixStr: string;
  addressName: string;
  provinceName: string;
  wgsLocation?: string;
  time: string;
  buildingNoCode?: any;
  floorCode?: any;
  communityCode?: any;
  latGcj?: string;
}

interface ClusterOptStyleObj {
  url: string;
  size: BMapGL.Size;
  textColor: string;
}

interface ClusterOptObj {
  gridSize?: number;
  maxZoom?: number;
  minClusterSize?: number;
  isAverageCenter?: boolean;
  styles?: ClusterOptStyleObj[];
}
