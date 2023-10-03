// 网络拓扑
import { useState, useMemo,useEffect } from 'react';
import styles from './core-network.module.scss';
import { Block } from '@network-resource-vis/block';
import ModalView from '@alpha/app/modal-view/modal-view';
import CoreNetworkMain from './core-network'
import CoreTab from './widgets/core-tab';
import CoreMap from './widgets/core-map';
import Crumbs from './components/crumbs';
import TopologyDetails from './widgets/topology-details';
import TopologyFactory from './widgets/topology-factory'
import TopologyDataQuality from './widgets/topology-data-quality';
import CoreMapView from './core-mapView';
import NetworkTopology from './widgets/core-networkTopology';
import AreaTab from './widgets/area-tab'
import CoreGMap from './widgets/core-g-map';
import { index } from 'd3-array';
interface CoreNetworkConatinerProps {
  coreType: string;
}

export function CoreNetworkContainer(props: CoreNetworkConatinerProps) {
  const [module, setModule] = useState(1);
  const [mapormode, mapModule] = useState(0);
  const [provinceName, setProvinceName] = useState<any>('');
  const [provinceId, setProvinceId] = useState<string>('');
  const [provJsonId, setProvJsonId] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState('哈尔滨');
  const [epqName, setEpqName] = useState('');
  const selectModel = (index: number) => {
    setModule(index);
  };

  const toggleComp = (index: number) => {
    mapModule(index);
  };

  const selectedProvinceHandle = (provinceName: string) => {
    setProvinceName(provinceName)
    setSelectedProvince(provinceName);
    setModule(2);
  }
  return (
    <div>
      {module === 1 ? <CoreNetworkTopology selectModel={selectModel}
        toggleComp={toggleComp}
        provinceName={provinceName}
        selectedProvinceHandle={selectedProvinceHandle} module={module} coreType={props.coreType} mapormode={mapormode} /> : module === 0 ? <CoreNetworkMain /> : ''}
      <ModalView
        show={!!selectedProvince && module === 2}
        fn={() => {
          setModule(1);
          setSelectedProvince('');
          mapModule(0)
        }}
        title={'核心网'}
        backText="返回"
        style={{ margin: '-75px 0 0 0' }}
        modalType={'fixed'}
      >
        <CoreMapView provinceName={selectedProvince} />
      </ModalView>
    </div>
  );
}

/* eslint-disable-next-line */
export interface CoreNetworkMainProps {
  selectedProvinceHandle: (name: string) => void;
  selectModel: (index: number) => void;
  toggleComp: (index: number) => void;
  provinceName: string;
  module: number;
  mapormode: number;
  coreType: string;
}

let areaTimer: any = null,
    areaIndex = 0

export function CoreNetworkTopology(props: CoreNetworkMainProps) {
  // tab绑定value
  const [dataIndex, setDataIndex] = useState<number>(0)
  const [mapType, setMapType] = useState<number>(0) // 地图标签样式
  const [resourceData, setResourceData] = useState() // 地图-资源总览数据
  const [efficiencyData, setEfficiencyData] = useState() // 地图-资源效能分析数据
  const [networkElement, setNetworkElement] = useState('ALL') // 网元类型
  const [areaValue, setAreaValue] = useState<number>(0) 

  const selectedElement = (type: any,goMap:any,isFive:any) => {
    setNetworkElement(type)
    if (goMap || goMap == true) {
      props.toggleComp(isFive)
    }
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
  };
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

  return (
    <div className={styles['container']}>
      {/* 顶部tab模块 */}
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
        <div>
          <CoreTab dataIndex={props.module} selectModel={props.selectModel} />
        </div>
      </Block>
      {/* 左侧模块 */}
      <Block
        blockStyle={{
          top: '100px',
          left: '180px',
          width: '450px',
          height: '469px',
        }}
        blockBackground={false}
        blockCorner={false}
      >
        <TopologyDetails networkElement={networkElement}></TopologyDetails>
        <TopologyFactory networkElement={networkElement}></TopologyFactory>
      </Block>
      <Block
        blockStyle={{
          top: '530px',
          left: '100px',
          width: '530px',
          height: '469px',
        }}
        blockBackground={false}
        blockCorner={false}
      >
        <TopologyDataQuality networkElement={networkElement}></TopologyDataQuality>
      </Block>
      {/* 右侧模块 */}
      {props.mapormode == 0 ?
        <Block
          blockStyle={{
            top: '100px',
            left: '652.296px',
            width: '1185.5px',
            height: '686.86px'
          }}
          blockBackground={false}
          blockCorner={false}>
          <NetworkTopology selectedElement={selectedElement}></NetworkTopology>
        </Block>
        :
        <>
          <Block
            blockStyle={{
              top: '136px',
              left: '652.296px',
              width: '900px',
              height: '115px',
              zIndex: '11111111'
            }}
            blockBackground={false}
            blockCorner={false}>
            {props.mapormode === 1||2 ?
             <div style={{position:'relative',top:'5px',left:'70px'}}>
              <Crumbs
                provinceName={networkElement}
                clickFn={() => {
                  props.toggleComp(0)
                }}
              ></Crumbs></div> : ""}
          </Block>
          <Block
            blockStyle={{
              top: '228px',
              left: '602.296px',
              width: '1000px',
              height: '915px',
            }}
            blockBackground={false}
            blockCorner={false}
          >
            {props.mapormode === 1 ?
              <CoreMap
                mapType={mapType}
                selectedProvinceHandle={props.selectedProvinceHandle}
                resourceData={resourceData}
                networkElement={networkElement}
                efficiencyData={efficiencyData}
              /> :
              <>
               {props.mapormode === 2 ?
                <Block
                  blockStyle={{
                    top:'-50px',
                    width: '802px',
                    zIndex: 111111111111,
                  }}
                  blockBackground={false}
                  blockCorner={false}
                >
                  
                  <div style={{position:'relative',top:'-5px',left:'230px'}}><AreaTab areaValue={areaValue} setAreaValue={setAreaFunc} /></div>
                </Block>:""}
                {props.mapormode === 2 ?
                <Block
                  blockStyle={{
                    width: '802px',
                    zIndex: 10,
                  }}
                  blockBackground={false}
                  blockCorner={false}
                >
                  <div style={{ height: '773px' }}>
                    <CoreGMap  mapType={mapType} setAreaValue={setAreaFunc} areaValue={areaValue} networkElement={networkElement} selectedProvinceHandle={props.selectedProvinceHandle} />
                  </div>
                </Block>:""}
              </>}

          </Block>
        </>
      }
    </div>
  );
}

export default CoreNetworkContainer;
