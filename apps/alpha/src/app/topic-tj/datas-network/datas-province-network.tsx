import { useState } from 'react';
import styles from './datas-network.module.scss';
import DatasMapView from './datas-mapView'
import ModalView from '@alpha/app/modal-view/modal-view';
import { Block } from '@network-resource-vis/block';
import ProvinceResources from './widgets/province-resources'  //省份左上角资源总揽
import ChartsStyle from './widgets/bar-chart'
import ProvinceForm from './widgets/provincial-form'
import CityNetwork from './widgets/city-network'
import {
  ProvinceInfoObj,
} from '@alpha/app/topic/broadband-2/widgets/gis/gis-map';
import ResourceUtilization from './widgets/lan-resourceUtilization'
import ProvinceMap from './widgets/province-map';
import Crumbs from '../wireless-network/components/crumbs';
import DatasTab from './widgets/datas-tab'


/* eslint-disable-next-line */
export interface DatasNetworkProConatinerProps {
  toggleComp: (i: number) => void;
  provinceName: string;
  provinceId: number | string;
  provJsonId: string
}
export function DatasNetworkProvinceContainer(props: DatasNetworkProConatinerProps) {
  const [module, setModule] = useState(1);   //module:1 表示省份大屏页面   2：表示进入省份Gis地图页面
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedProvinceMap, setSelectedProvinceMap] = useState(false);
  const [eqpName, setEqpName] = useState('');
  const selectedCityHandle = (cityName: string) => {
    setSelectedProvinceMap(true)
    setSelectedProvince(cityName);
    setEqpName('');
    setModule(2);
  }
  //选择回调
  const selectedCityHandler = (cityName: string, epqName: string) => {
    setSelectedProvince(cityName);
    setSelectedProvinceMap(false)
    setEqpName(epqName);
    setModule(3);
  }
  return (
    <div className={styles['datas-network']}>
      {module === 1 &&
        <DatasNetworkProMain
          toggleComp={props.toggleComp}
          selectedCityHandle={selectedCityHandle}
          selectedCityHandler={selectedCityHandler}
          provinceName={props.provinceName}
          provinceId={props.provinceId}
          provJsonId={props.provJsonId} />
      }
      {!!selectedProvinceMap && <ModalView
        show={!!selectedProvince && module === 2}
        fn={() => {
          setModule(1);
          setSelectedProvince('')
        }}
        title={'数据网资源可视化'}
        backText="返回"
        style={{ margin: '-75px 0 0 0' }}
        modalType={'fixed'}
      >
        <DatasMapView provinceName={selectedProvince} />
      </ModalView>}
      {(!!selectedProvince && module === 3) && <ModalView
        show={!!selectedProvince && module === 3}
        fn={() => {
          setModule(1);
          setEqpName('');
        }}
        title={'数据网资源可视化'}
        backText="返回"
        style={{ margin: '-75px 0 0 0' }}
        modalType={'fixed'}
      >
        <DatasMapView provinceName={selectedProvince} eqpName={eqpName} />
      </ModalView>
      }
    </div>
  );
}

export interface DatasNetworkProMainProps extends DatasNetworkProConatinerProps {
  selectedCityHandle: (name: string) => void;
  selectedCityHandler: (cityName: string, epqName: string) => void;
}

export function DatasNetworkProMain(props: DatasNetworkProMainProps) {
  const [provinceId, setProvinceId] = useState(props.provinceId);
  const [showSection, setShowSection] = useState(true);
  const [proResourceType, setProResourceType] = useState<Array<any>>([]); //省份左上角类型传参
  const [catagery, setCatagery] = useState<String>(''); //分类
  const [name, setName] = useState<String>(''); //名称
  const [cityNameList, setCityNameList] = useState<any>([]);
  const [cityNumList, setCityNumList] = useState<any>([]);
  const [focusLinksList, setFocusLinksList] = useState<any>([]);
  const setProResourceBottomHandle = (protList: Array<any>, catagery: string, name: string) => {
    setProResourceType(protList);
    setCatagery(catagery);
    setName(name);
  }
  const selectedElement = (focusLinks: Array<any>) => {
    // console.log("focusLinks", focusLinks);
    setFocusLinksList(focusLinks)
  };

  // tab绑定value
  const [dataIndex, setDataIndex] = useState<number>(0)

  const [resourceData, setResourceData] = useState<Array<any>>([])
  const setResourceDataHandle = (resourceData: Array<any>) => {
    setResourceData(resourceData);
  }
  // const [selectedProvince, setSelectedProvince] =
  //   useState<ProvinceInfoObj>(defaultProvince);
  const [selectedCity, setSelectedCity] = useState<
    ProvinceInfoObj | undefined
  >();

  const handleCheck = (i: number) => {
    setDataIndex(i)
    i !== dataIndex && props.toggleComp(i)
  }

  return (
    <div>
      {/* 中间模块 地图 */}
      <Block
        blockStyle={{
          top: '106px',
          left: '592px',
          width: '663px',
          height: '784px',
          zIndex: 100,
          pointerEvents: "none"
        }}
        blockBackground={false}
        blockCorner={false}
      >
        <div style={{ 'marginBottom': '45px' }}>
          <DatasTab dataIndex={dataIndex} setDataIndex={(i: number) => handleCheck(i)} />
        </div>
        <Crumbs
          provinceName={props.provinceName}
          clickFn={() => {
            props.toggleComp(0)
          }}
        ></Crumbs>
        <ProvinceMap
          setCity={props.selectedCityHandle}
          resourceData={resourceData}
          provinceName={props.provinceName}
          adcode={props.provJsonId}
        ></ProvinceMap>
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
            left: '80px',
            width: '512px',
            height: '915px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          {/* 左上角身份资源总览 */}
          <ProvinceResources
            provinceId={props.provinceId}
            setProResourceBottomHandle={setProResourceBottomHandle}
            setResourceDataHandle={setResourceDataHandle}
          >
          </ProvinceResources>
          <CityNetwork proResourceType={proResourceType} catagery={catagery} name={name}></CityNetwork>
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
            width: '589px',
            height: '915px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <ResourceUtilization selectedCityHandler={props.selectedCityHandler} provinceId={provinceId}></ResourceUtilization>
          <ChartsStyle
            provinceId={provinceId}
            selectedElement={selectedElement}
          ></ChartsStyle>
          <ProvinceForm focusLinksList={focusLinksList}></ProvinceForm>
          {/* <ProvinceForm provinceId={provinceId}></ProvinceForm> */}
        </Block>
      </section>
    </div>
  );
}

export default DatasNetworkProvinceContainer;
