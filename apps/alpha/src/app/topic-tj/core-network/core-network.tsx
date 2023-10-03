import { useState, useMemo, useEffect } from 'react';
import styles from './core-network.module.scss';
import CoreMapView from './core-mapView';
import ModalView from '@alpha/app/modal-view/modal-view';
import AreaTab from './widgets/area-tab'
import { Block } from '@network-resource-vis/block';
import DeviceDetails from './widgets/device-details';
import FactoryChart from './widgets/factory-chart'
import DataQuality from './widgets/data-quality';
import OperationPage from './widgets/operation-page';
import CoreTab from './widgets/core-tab';
import CoreChinaMap from './widgets/core-china-map';
import ResourceOverview from './widgets/core-resourceOverview';
import CoreTopology from './core-topology'

interface CoreNetworkConatinerProps {}

export function CoreNetworkContainer(props: CoreNetworkConatinerProps) {
  const [module, setModule] = useState(0);
  const [coreType, setCoreType] = useState('5GC核心网') // 选中运营商
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedProvinceMap, setSelectedProvinceMap] = useState(false);
  const selectedProvinceHandle = (provinceName: string) => {
    setSelectedProvinceMap(true)
    setSelectedProvince(provinceName);
    setModule(2);
  };
  const selectModel = (index: number) => {
    setModule(index);
  };
  const selectCoreType = (name: string) => {
    setCoreType(name)
  }
  return (
    <div>
      {module === 0 && <CoreNetworkMain selectedProvinceHandle={selectedProvinceHandle} selectModel={selectModel} module={module} coreType={coreType} selectCoreType={selectCoreType} />}
      {module === 1 && <CoreTopology coreType={coreType} />}
      {/* {!!selectedProvinceMap && */}
      <ModalView
        show={!!selectedProvince && module === 2}
        fn={() => {
          setModule(0);
          setSelectedProvince('')
        }}
        title={'核心网'}
        backText="返回"
        style={{ margin: '-75px 0 0 0' }}
        modalType={'fixed'}
      >
        <CoreMapView provinceName={selectedProvince} />
      </ModalView>
      {/* } */}
    </div>
  )
}

/* eslint-disable-next-line */
export interface CoreNetworkMainProps {
  selectedProvinceHandle: (name: string) => void;
  selectModel: (index: number) => void;
  selectCoreType: (name: string) => void;
  module: number;
  coreType: string;
}

let areaTimer: any = null,
    areaIndex = 0

export function CoreNetworkMain(props: CoreNetworkMainProps) {
  const [showSection, setShowSection] = useState(true);
  const [areaValue, setAreaValue] = useState<number>(0) // 选中大区value
  // const [coreType, setCoreType] = useState('5GC核心网') // 选中运营商
  const [business, setBusiness] = useState('') // 左下角数据
  const [childBusiness, setChildBusiness] = useState([]) // 中间大区数据

  const selectedDatas = (type:any,business: any,childBusiness:any) => {
    // setCoreType(type)
    props.selectCoreType(type);
    setBusiness(business);
    setChildBusiness(childBusiness);
    type !== props.coreType && setAreaValue(0);
  };

  const setAreaFunc = (i: number) => {
    setAreaValue(i)
    if(areaTimer) {
      clearInterval(areaTimer)
      areaTimer = setInterval(() => {
        areaIndex++
        setAreaValue(areaIndex % 8)
      }, 10 * 1000)
    }
  }
    
  let mapData = useMemo(() => {
    const strArr = ['5GC核心网', 'vims', '移动核心网']
    return {
      mapType: strArr.indexOf(props.coreType),
      data: childBusiness
    }
  }, [props.coreType, childBusiness])

  useEffect(() => {
    areaTimer = setInterval(() => {
      areaIndex++
      setAreaValue(areaIndex % 8)
    }, 10 * 1000)
    
    return () => {
      clearInterval(areaTimer)
      areaTimer = null
      areaIndex = 0
    }
  }, [])

  useEffect(() => {
    if((props.coreType !== '5GC核心网' || props.module !== 0)) {
      if(areaTimer) {
        clearInterval(areaTimer)
        areaTimer = null
        areaIndex = 0
      }
    } else {
      if(!areaTimer) {
        areaTimer = setInterval(() => {
          areaIndex++
          setAreaValue(areaIndex % 8)
        }, 10 * 1000)
      }
    }
  }, [props.coreType, props.module])
  
  return (
    <div className={styles['container']}>
      {/* 中间模块 */}
      <Block
        blockStyle={{
          top: '100px',
          left: '555px',
          width: '802px',
          zIndex: 10,
        }}
        blockBackground={false}
        blockCorner={false}
      >
        <div style={{ 'marginBottom': '100px' }}>
          <CoreTab dataIndex={props.module} selectModel={props.selectModel}/>
        </div>
        {
          mapData.mapType === 0 && <AreaTab areaValue={areaValue} setAreaValue={setAreaFunc} />
        }
        <div style={{height: '773px'}}>
          <CoreChinaMap mapData={mapData} setAreaValue={setAreaFunc} areaValue={areaValue} selectedProvinceHandle={props.selectedProvinceHandle}/>
        </div>
      </Block>
      {/* 左侧模块 */}
      <section
        className={
          showSection
            ? `animate__animated customAnimate__slideInLeft`
            : `animate__animated customAnimate__slideOutLeft`
        }
        style={{ position: 'absolute', top: '0', left: '0', zIndex:10 }}
      >
        <Block
          blockStyle={{
            top: '100px',
            left: '69px',
            width: '600.2px',
            height: '915px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <ResourceOverview selectedDatas={selectedDatas}></ResourceOverview>
          <OperationPage business={business} coreType = {props.coreType}></OperationPage>
        </Block>
      </section>
      {/* 右侧模块 */}
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
            width: '450px',
            height: '469px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <DeviceDetails coreType={props.coreType}></DeviceDetails>
          <FactoryChart coreType={props.coreType}></FactoryChart>
        </Block>
        <Block
          blockStyle={{
            top: '569px',
            right: '70px',
            width: '530px',
            height: '469px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <DataQuality coreType={props.coreType}></DataQuality>
        </Block>
      </section>
    </div>
  );
}

export default CoreNetworkContainer;
