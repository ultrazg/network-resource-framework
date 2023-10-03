import { useEffect, useState } from 'react';
import styles from './datas-network.module.scss';
import DatasNetworkProContainer from './datas-province-network'
import { Block } from '@network-resource-vis/block';
import ResourceOverview from './widgets/resource-overview'//全国地图左上角
import DatasTab from './widgets/datas-tab'
import LineChartEm from './widgets/datas-equipment'
import ResourcesMap from './widgets/resources-map'
import NetworkDiagram from './widgets/network-diagram'
import NetworkIPRANTopology from './widgets/network-ipran-topology';
import DataQuality from './widgets/data-quality'  //全国左下角数据质量
import DatasMapView from './datas-mapView'
import ModalView from '@alpha/app/modal-view/modal-view';
import EfficiencyAnalysis from '../datas-network/widgets/resource-efficiencyAnalysis'
import { url } from 'inspector';

/* eslint-disable-next-line */
export interface DatasNetworkConatinerProps { }

export function DatasNetworkContainer(props: DatasNetworkConatinerProps) {
  const [module, setModule] = useState(0);
  const [index, setIndex] = useState(NaN);
  const [provinceName, setProvinceName] = useState<any>('');
  const [provinceId, setProvinceId] = useState<string>('');
  const [provJsonId, setProvJsonId] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState('哈尔滨');
  const [epqName, setEpqName] = useState('');
  
  const selectedProvinceHandle = (provinceName: string, provJsonId: string, provinceId: string) => {
    setProvinceName(provinceName)
    setProvinceId(provinceId);
    setProvJsonId(provJsonId);
    setModule(1);
  }
  const toggleComp = (i: number) => {
    setModule(0);
    setIndex(i)
  }
  //选择回调
  const selectedCityHandle = (cityName: string, epqName: string) => {
    setSelectedProvince(cityName);
    setEpqName(epqName);
    setModule(2);
  }
  return (
    <div>
      {module === 0 ?
        <DatasNetworkMain  toggleComp={toggleComp} index={index} selectedProvinceHandle={selectedProvinceHandle} selectedCityHandle={selectedCityHandle} />
      : module === 1 ?
        <DatasNetworkProContainer toggleComp={toggleComp} provinceName={provinceName} provinceId={provinceId} provJsonId={provJsonId} />
      : ''
      }
      <ModalView
        show={!!selectedProvince && module === 2}
        fn={() => {
          setModule(0);
        }}
        title={'数据网资源可视化'}
        backText="返回"
        style={{ margin: '-75px 0 0 0' }}
        modalType={'fixed'}
      >
        <DatasMapView provinceName={selectedProvince} eqpName={epqName} />
      </ModalView>
    </div>
  );
}

export interface DatasNetworkMainProps {
  selectedProvinceHandle: (name: string, provJsonId: string, provinceId: string) => void;
  selectedCityHandle: (cityName: string, epqName: string) => void;
  toggleComp:(i: number)=> void;
  index: number
}

export function DatasNetworkMain(props: DatasNetworkMainProps) {
  const [showSection, setShowSection] = useState(true);
  const [provinceName, setprovinceName] = useState('全国');
  const [proResourceType, setProResourceType] = useState('');   //省份左上角类型传参
  const [tabIndex, setTabIndex] = useState<number>(0);//资源总览菜单索引
  const [showFlag, setShowFlag] = useState<number>(0);//0 地图
  const setProResourceTypeHandle = (currType: string) => {
    setProResourceType(currType);
  }
  //切换菜单
  const changeTab = (index:number) => {
    setTabIndex(index);
  }
  //切换视图
  const changeShowFlag = (index:number) => {
    setShowFlag(index);
  }
  // tab绑定value
  const [dataIndex, setDataIndex] = useState<number>(0)

  const [mapType, setMapType] = useState<number>(0) // 地图标签样式
  const [efficiencyData, setEfficiencyData] = useState() // 地图-资源效能分析数据
  const [resourceData, setResourceData] = useState() // 地图-资源总览数据
  useEffect(() => {
    if (props.index) {
      setDataIndex(props.index)
    }
  }, [props.index])

  return (
    <div className={styles['datas-network']}>
      {/* 中间模块 */}
      <Block
        blockStyle={{
          top: '106px',
          left: '510px',
          width: '802px',
          height: '784px',
          zIndex: dataIndex === 0 ? 100 : 10,
        }}
        blockBackground={false}
        blockCorner={false}
      >
        <div style={{ 'marginBottom': '45px', zIndex: 100, }}>
          <DatasTab dataIndex={dataIndex} setDataIndex={setDataIndex} />
        </div>
        {
          dataIndex === 0
            ?
            <ResourcesMap
              style={{ width: '802px',height: '784px',}}
              mapType={mapType}
              selectedProvinceHandle={props.selectedProvinceHandle}
              resourceData={resourceData}
              efficiencyData={efficiencyData}
            />
            : <NetworkDiagram  toggleComp={props.toggleComp} gotoGisMap={props.selectedCityHandle} selectedCityHandle={props.selectedCityHandle} changeTab={changeTab} tabIndex={tabIndex} showFlag={showFlag} changeShowFlag={changeShowFlag} />
        }
      </Block>
      {/* 左侧模块 */}
      <section
        className={
          showSection
            ? `animate__animated customAnimate__slideInLeft`
            : `animate__animated customAnimate__slideOutLeft`
        }
        style={{ position: 'absolute', top: '0', left: '0', zIndex: 10 }}
      >
        <Block
          blockStyle={{
            top: '93px',
            left: '100px',
            width: '512px',
            height: '915px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <ResourceOverview setMapType={setMapType} setResourceData={setResourceData} tabIndex={tabIndex} changeTab={changeTab} showFlag={showFlag} dataIndex={dataIndex}></ResourceOverview>
          <DataQuality />
        </Block>
      </section>
      {/* 右侧模块 */}
      {
        dataIndex === 0 ?
          <section
            className={
              showSection
                ? `animate__animated customAnimate__slideInLeft`
                : `animate__animated customAnimate__slideOutLeft`
            }
            style={{ position: 'absolute', top: '0', right: '0', zIndex: 10 }}
          >
            <Block
              blockStyle={{
                top: '100px',
                right: '70px',
                width: '586px',
                height: '527px',
              }}
              blockBackground={false}
              blockCorner={false}
            >
              <EfficiencyAnalysis selectedCityHandle={props.selectedCityHandle} setEfficiencyData={setEfficiencyData} setMapType={setMapType}></EfficiencyAnalysis>
            </Block>
            <Block
              blockStyle={{
                top: '653px',
                right: '100px',
                width: '475px',
                height: '550px',
              }}
              blockBackground={false}
              blockCorner={false}
            >
              <LineChartEm />
            </Block>
          </section>
          :
          ''
      }
    </div>
  );
}

export default DatasNetworkContainer;
