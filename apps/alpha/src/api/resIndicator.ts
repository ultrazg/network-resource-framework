import { getAction } from '../utils/http';
import { ResponseMeta } from './api';

type AccessNetIndicator = {
  day: string; //	数据获取日期yyyymmdd	string
  emsNum: number; //	EMS个数	integer
  obdNum: number; //	obd个数	integer
  obdPortNum: number; //	obd端子个数	integer
  oltEqpNum: number; //	OLT设备数	integer
  onuEqpNum: number; //	ONU设备数	integer
  ponPortNum: number; //	PON端口数	integer
  province: string; //	省份	string
  rmeCardNum: number; //	板卡个数	integer
  total: number; //	接入网资源总数	integer
};

type SpaceIndicator = {
  accessoryRoomCount: number; //	附属用房数量	integer
  addrSegmCount: number; //	标准分段地址数量	integer
  addrSegmEqpCount: number; //	地址资源数量	integer
  bldgServicetypeTimelimitCount: number; //	楼宇开通时限表数量	integer
  buildingCount: number; //	楼宇数量	integer
  comEqpRelaCount: number; //	楼宇关系表数量	integer
  compartmentRoomCount: number; //	机笼数量	integer
  day: string; //	数据获取的日期yyyymmdd	string
  districtCount: number; //	行政区域数量	integer
  gridCount: number; //	网格数量	integer
  gridResRelationCount: number; //	网格关联资源数量	integer
  positionCount: number; //	室外放置点数量	integer
  province: string; //	省份	string
  regionCount: number; //	管理区域数量	integer
  roomCount: number; //	机房数量	integer
  serviceRegionCount: number; //	社区资源数量	integer
  stationCount: number; //	局站数量	integer
  total: number; //	空间资源总量	integer
};

type CoreNetDetailIndicator = {
  amfCount: number; //	5GC-AMF数量	integer	
  anchorAsCount: number; //	VIMS-AnChor_AS数量	integer	
  ausfCount: number; //	5GC-AUSF数量	integer	
  bgcfCount: number; //	VIMS-BGCF数量	integer	
  bsfCount: number; //	5GC-BSF数量	integer	
  bsfUdrCount: number; //	5GC-BSF_UDR数量	integer	
  cgpCount: number; //	VIMS-CGP数量	integer	
  cgpomuCount: number; //	5GC-CGPOMU数量	integer	
  coreNetCircuitSwitchedTotal: number; //	移动网核心网电路域-CS总量	integer	
  coreNetPacketSwitchTotal: number; //	核心网分组域-PS总量"	integer	
  dnsenumCount: number; //	VIMS-DNSENUM数量	integer	
  draCount: number; //	LTE核心网EPC-DRA数量	integer	
  emsCount: number; //	VIMS-EMS数量	integer	
  emsOmcCount: number; //	5GC-EMS/OMC数量	integer	
  esCount: number; //	VIMS-ES数量	integer	
  evolvedPacketCoreNetworkTotal: number; //	LTE核心网-EPC总量	integer	
  fifthCcgCount: number; //	5GC-CCG数量	integer	
  fifthGenerationCoreTotal: number; //	5G核心网-5GC总量	integer	
  fifthMeCount: number; //	5GC-ME设备数量	integer	
  firewallCount: number; //	VIMS-防火墙数量	integer	
  ggsnCount: number; //	核心网分组域PS-GGSN数量	integer	
  hlrCount: number; //	核心网电路域CS-HLR数量	integer	
  hssBeCount: number; //	VIMS-HSS_BE数量	integer	
  hssFeCount: number; //	VIMS-HSS_FE数量	integer	
  icscfCount: number; //		integer	
  imAsCount: number; //	VIMS-IM_AS数量	integer	
  imMgwCount: number; //	VIMS-IM_MGW数量	integer	
  imScfCount: number; //	VIMS-IM_SCF数量	integer	
  imSsfCount: number; //	VIMS-IM_SSF数量	integer	
  ipsmgwCount: number; //	VIMS-IPSMGW数量	integer	
  lteHssCount: number; //	NB核心网-HSS数量	integer	
  lteMmeCount: number; //	NB核心网-MME数量	integer	
  ltePcrfCount: number; //	NB核心网-PCRF数量	integer	
  mgcfCount: number; //	VIMS-MGCF数量	integer	
  mgwGmgwCount: number; //	核心网电路域CS-MGW/GMGW数量	integer	
  mmtelAsCount: number; //	VIMS-MMTEL_AS数量	integer	
  mrfcCount: number; //	VIMS-MRFC数量	integer	
  mscGmscCount: number; //	核心网电路域CS-MSC/GMSC数量	integer	
  mscServerVlrCount: number; //	核心网电路域CS-MSC SERVER/VLR数量	integer	
  nbHssCount: number; //	NB核心网-HSS数量	integer	
  nbMmeCount: number; //	NB核心网-MME数量	integer	
  nbPcrfCount: number; //	NB核心网-PCRF数量	integer	
  nbSprCount: number; //	NB核心网-SPR数量	integer	
  nodebCoreNetTotal: number; //	NB核心网-NB总量	integer	
  nrfCount: number; //	5GC-NRF数量	integer	
  nssfCount: number; //	5GC-NSSF数量	integer	
  nxInterfaceCount: number; //	5GC-Nx接口数量	integer	
  pcfCount: number; //	5GC-PCF数量	integer	
  pcfCspCount: number; //	5GC-PCF-CSP数量	integer	
  pcfUdrCount: number; //	5GC-PCFUDR数量	integer	
  pcscfCount: number; //		integer		
  routerCount: number; //	VIMS-路由器数量	integer	
  sbcCount: number; //	VIMS-SBC数量	integer	
  sccAsCount: number; //	VIMS-SCC_AS数量	integer	
  scscfCount: number; //		integer	
  sgsnCount: number; //	核心网分组域PS-SGSN数量	integer	
  sgwPgwCount: number; //	LTE核心网EPC-SGW/PGW数量	integer	
  smfCount: number; //	5GC-SMF数量	integer	
  spgSpnCount: number; //	VIMS-SPG/SPN数量	integer	
  total: number; //	核心网网元总量	integer	
  udmCount: number; //	5GC-UDM数量	integer	
  udmCspCount: number; //	5GC-UDM-CSP数量	integer	
  udmUdrCount: number; //	5GC-UDM-UDR数量	integer	
  upfCount: number; //	5GC-UPF数量	integer	
  utCount: number; //	VIMS-UT数量	integer	
  vhssCount: number; //	5GC-vHSS数量	integer	
  vimsCcgCount: number; //	VIMS-CCG数量	integer	
  vimsMeCount: number; //	VIMS-ME设备数量	integer	
  vimsPcrfCount: number; //	VIMS-PCRF数量	integer	
  vimsRelayCircuitCount: number; //	VIMS-vIMS中继电路数量	integer	
  vimsSprCount: number; //	VIMS-SPR数量	integer	
  vimsTotal: number; //	交换网-VIMS总量	integer
};

type CoreNetIndicator = {
  coreNet: CoreNetDetailIndicator,
  csAndPsTotal: number; //	CS / PS数量	integer
  epcAndNbTotal: number; //	EPC / NB数量	integer
  fifthGenerationCoreTotal: number; //	5GC数量	integer
  vimsTotal: number; //	vIMS数量	integer
}

type DataNetIndicator = {
  day: string; //	数据获取的日期yyyymmdd	string
  province: string; //	省份	string
  routeNum: number; // 路由器个数	integer
  total: number; // 数据网总数	integer
  areaNetNum: number;
  trunkNetNum: number;
  ipBearANum: number;
  ipBearBNum: number;
};

type IDCIndicator = {
  day: string; //	获取日期	string
  province: string; //	省份	string
  rack: number; //	机架	integer
  rate: number; //	机架利用率	number
  room: number; //	机房	integer
  station: number; // 局站	integer
  total: number; //	总计	integer
  usedRack: number; //	占用机架个数	integer
};

type InternationalIndicator = {
  borderCount: number; //	边境站数量	integer
  day: string; //	统计日期	string
  digitalCount: number; //	国际数字专线数量	integer
  ethernetCount: number; //	国际以太网专线电路数量	integer
  intBureau: number; //	国际局数量	integer
  landCableCount: number; //	陆缆数量	integer
  landCount: number; //	登陆站数量	integer
  otnCount: number; //	otn设备数量	integer
  popCount: number; //	pop点数量	integer
  portCount: number; //	端口数量	integer
  sdhCount: number; //	sdh设备数量	integer
  seaCableCount: number; //	海缆数量	integer
  total: number; //	统计总量	integer
  transmissionCount: number; //	传输电路数量	integer
  trsNeCount: number; //	网元数量	integer
  wdmCount: number; //	wdm设备数量	integer
};

type OptNetIndicator = {
  day: string; //	数据获取的日期yyyymmdd	string
  firstClassTrunkOptLength: number; //	一干光缆长度（km）	number
  inputOptLength: number; //	接入光缆长度（km）	number
  localOptLength: number; //	本地光缆长度（km）	number
  optCoilCount: number; //	光缆盘留数量	integer
  optConjunctionCount: number; //	光缆熔纤数量	integer
  optConnectBoxCount: number; //	光交接箱数量	integer
  optJntBoxCount: number; //	光分纤箱数量	integer
  optLogicOptPairCount: number; //	局向光纤数量	integer
  optOpticalCount: number; //	光缆数量	integer
  optOpticalSectCount: number; //	光缆段数量	integer
  optPairCount: number; //	光缆纤芯数量	integer
  optPairLinkCount: number; //	光链路数量	integer
  optRoadCount: number; //	光路数量	integer
  optTieInCount: number; //	光缆接头数量	integer
  pipHoleCount: number; //	人井数量	integer
  pipMarkerCount: number; //	标石数量	integer
  pipOccupyCount: number; //	穿缆信息数量	integer
  pipPipeSectCount: number; //	管道段数量	integer
  pipPipeholeCount: number; //	管孔数量	integer
  pipPipelineCount: number; //	管道数量	integer
  pipPolelineCount: number; //	杆路数量	integer
  pipPolesectCount: number; //	杆路段数量	integer
  pipStaypointCount: number; //	电杆数量	integer
  province: string; //	省份	string
  secondClassTrunkOptLength: number; //	二干光缆长度（km）	number
  total: number; //	光缆网资源总量	integer
  totalOptLength: number; //	合计光缆长度（km）	number
};

type TrsNetIndicator = {
  day: string; //	数据获取的日期yyyymmdd	string
  emsCount: number; //	EMS数量	integer
  ipranEqpCount: number; //	ipran设备数量	integer
  ipranPortCount: number; //	ipran端口数量	integer
  province: string; //	省份	string
  rmeCardCount: number; //	板卡数量	integer
  rmePortCount: number; //	端口数量	integer
  rmeShelfCount: number; //	机框数量	integer
  rmeSlotCount: number; //	机槽数量	integer
  total: number; //	传输网资源总数	integer
  trsChannelCount: number; //	传输通道数量	integer
  trsChannelProtectRouteCount: number; //	传输通道保护路由数量	integer
  trsChannelRouteCount: number; //	传输通道路由数量	integer
  trsCircuitCount: number; //	传输电路数量	integer
  trsCircuitProtectRouteCount: number; //	传输电路保护路由数量	integer
  trsCircuitRouteCount: number; //	传输电路路由数量	integer
  trsCrossLinkCount: number; //	交叉连接数量	integer
  trsDwdmwaveCount: number; //	WDM数量	integer
  trsNmneCount: number; //	EMS与网元关系数量	integer
  trsSegCount: number; //	传输段数量	integer
  trsSegRouteCount: number; //	传输段路由数量	integer
  trsSegmentProtectRouteCount: number; //	段保护路由数量	integer
  trsSysCount: number; //	传输系统数量	integer
  trsSyseqpCount: number; //	传输系统与网元关系数量	integer
  trsTextRouteCount: number; //	文本路由数量	integer
  trsTrsNeCount: number; //	传输网元数量	integer
  trsTsCount: number; //	传输时隙数量	integer
  wdmEqpCount: number; //	波分设备数量	integer
  wdmPortCount: number; //	波分端口数量	integer
};

type WirelessNetIndicator = {
  aau: number; //	AAU数量	integer
  bbu: number; //	BBU数量	integer
  btsCount: number; //	2G基站数量	integer
  cu: number; //	CU数量	integer
  day: string; //	数据获取的日期yyyymmdd	string
  du: number; //	DU数量	integer
  enodebCount: number; //	4G基站数量	integer
  enodebCountByTelecom: number; //	电信承建4G基站数量	integer
  eutranCellCount: number; //	4G小区数量	integer
  gnodebCount: number; //	5G基站数量	integer
  gnodebCountByTelecom: number; //	电信承建5G基站数量	integer
  nodebCount: number; //	3G基站数量	integer
  nrCellCount: number; //	5G小区数量	integer
  province: string; //	省份	string
  rru: number; //	RRU数量	integer
  total: number; //	总数	integer
};

export interface ResIndicatorResp extends ResponseMeta {
  data: {
    accessNet: AccessNetIndicator;
    coreNet: CoreNetIndicator;
    dataNet: DataNetIndicator;
    idcRes: IDCIndicator;
    internationalRes: InternationalIndicator;
    optNet: OptNetIndicator;
    spcRes: SpaceIndicator;
    trsNet: TrsNetIndicator;
    wireNet: WirelessNetIndicator;
  };
}

type ResQuality = {
  id: number;
  createTime: string; //	创建时间	string
  day: string; //	数据获取的日期yyyymmdd	string
  indicatorId: number; //	评价指标id	integer
  indicatorName: string; //	评价指标名称	string
  normalNum: number; //	达标数	integer
  province: string; //	省份	string
  rate: number; //	达标百分比	number
  speciality: string; //	专业	string
  totalNum: number; //	总数	integer
  updateTime: string; //	更新时间	string
};

export type ResType =
  | 'ACCESS_NET'
  | 'CORE_NET'
  | 'DATA_NET'
  | 'IDC_RES'
  | 'INTERNATIONAL_RES'
  | 'OPT_NET'
  | 'SPC_RES'
  | 'TRS_NET'
  | 'WIRE_NET';
export interface ResQtResp extends ResponseMeta {
  data: {
    normalNum: number; //	达标数(各子指标合计)	integer(int64)
    province: string; //	省份	string
    provinceName: string; //	省份名称	string
    rate: number; //	达标百分比	number
    speciality: string; //	专业	string
    totalNum: number; //	总数（各子指标合计）	integer(int64)
    day: string; //	数据获取的日期yyyymmdd	string
    indicatorData: ResQuality[]; // 各指标数据
  };
}
function fetchResIndicator(
  day?: string /* 20220218 */,
  province?: string
): Promise<ResIndicatorResp> {
  return getAction('/api/netres-service/netres/resIndicator/resAtlas', {
    day,
    province,
  });
}

function fetchResQt(
  speciality: ResType,
  day?: string,
  province?: string
): Promise<ResQtResp> {
  return getAction('/api/netres-service/res-quality', {
    day,
    province,
    speciality,
  });
}

export { fetchResIndicator, fetchResQt };
