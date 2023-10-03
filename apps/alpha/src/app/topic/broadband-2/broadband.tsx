import styles from './broadband.module.scss';
import { Block } from '@network-resource-vis/block';
import ChinaMap from '@alpha/app/topic/broadband-2/widgets/china-map';
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import { useEffect, useRef, useState } from 'react';

import ResourceOverview from '@alpha/app/topic/broadband-2/widgets/resource-overview';
import OperateSupport from '@alpha/app/topic/broadband-2/widgets/operate-support';
import OperateSupportDown from '@alpha/app/topic/broadband-2/widgets/operate-support-down';

import ModalView from '@alpha/app/modal-view/modal-view';
import GisMap, {
  ProvinceInfoObj,
} from '@alpha/app/topic/broadband-2/widgets/gis/gis-map';
import ResourceDevice from './widgets/resource-device-idleness';
import { simplifyProvinceName } from '@alpha/utils/commFunc';
import BusinessCoverNew from './widgets/business-cover-new';
import ParallelNav from "@alpha/app/topic/broadband-2/components/parallel-nav/parallel-nav";

/* eslint-disable-next-line */
export interface BroadbandProps {}

const defaultProvince = {
  id: '10',
  size: '5000',
  name: '全国',
  center: [118.767413, 32.041544],
  cp: [118.767413, 32.041544],
  childNum: 19,
};

export function Broadband(props: BroadbandProps) {
  const [showSection, setShowSection] = useState(true);
  const [mapType, setMapType] = useState(0);
  const [currentType, setCurrentType] = useState('宽带资源上图');
  const [selectedProvince, setSelectedProvince] =
    useState<ProvinceInfoObj>(defaultProvince);
  const [selectedCity, setSelectedCity] = useState<
    ProvinceInfoObj | undefined
  >();
  const [ifShowGisMap, setIfShowGisMap] = useState(false);
  const [outTarget, setOutTarget] = useState('');

  useEffect(() => {
    if (selectedCity) {
      setIfShowGisMap(true);
    }
  }, [selectedCity]);
  useEffect(() => {
    // console.log(currentType);
  }, [currentType]);
  const menuList = useRef([
    {
      name: '宽带资源上图',
      icon: 'iconfont icon-gongxiangkuandai',
      children: [],
    },
    {
      name: 'OLT单/双上联分析',
      icon: 'iconfont icon-yuce',
      children: [],
    },
    {
      name: '千/百户小区资源预警',
      icon: 'iconfont icon-xiaoqu-xianxing',
      children: [],
    },
  ]);
  return (
    <div className={styles['container']}>
      <Block
        blockStyle={{
          top: '75px',
          left: '480px',
          width: '990px',
          height: '950px',
          zIndex: 9,
        }}
        blockBackground={false}
        blockCorner={false}
      >
        {/* 地图 */}
        <ChinaMap
          type={mapType}
          selectedName={currentType}
          showGis={(data: ProvinceInfoObj) => {
            setSelectedProvince(data);
            setIfShowGisMap(true);
          }}
          setProvince={setSelectedProvince}
          setCity={setSelectedCity}
          outTarget={outTarget}
          setOutTarget={setOutTarget}
        ></ChinaMap>
      </Block>

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
            width: '340px',
            height: '915px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <SectionTitle
            title="资源总览"
            style={{ width: '300px' }}
            // fn={() => {
            //   // HACK gis开发快捷入口
            //   setSelectedProvince((prevState) => {
            //     const temp = { ...prevState };
            //     temp.name = '江苏省';
            //     return temp;
            //   });
            //   setSelectedCity({ name: '南京市' });
            //   setIfShowGisMap(true);
            // }}
          ></SectionTitle>
          <ResourceOverview
            provinceName={simplifyProvinceName(selectedProvince.name)}
            jump={(target: string) => {
              setCurrentType('宽带资源上图');
              setOutTarget(target);
            }}
          />
          <ResourceDevice
            provinceName={simplifyProvinceName(selectedProvince.name)}
            jump={() => {
              setCurrentType('OLT单/双上联分析');
            }}
          />
        </Block>
      </section>

      <section
        className={
          showSection
            ? `animate__animated customAnimate__slideInRight`
            : `animate__animated customAnimate__slideOutRight`
        }
        style={{ position: 'absolute', top: '0', left: '0', zIndex: 2 }}
      >
        <Block
          blockStyle={{
            top: '93px',
            left: '1484px',
            width: '400px',
            height: '500px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <SectionTitle
            title="业务覆盖"
            style={{ width: '320px' }}
            // selecting={mapType == 3}
            // fn={() => {
            //   setMapType(3);
            // }}
          ></SectionTitle>
          {/* <BusinessCoverage
            province={simplifyProvinceName(selectedProvince.name)}
          /> */}
          <BusinessCoverNew
            province={simplifyProvinceName(selectedProvince.name)}
            setCurrentType={setCurrentType}
            setTarget={setOutTarget}
          />
        </Block>
        <Block
          blockStyle={{
            top: '600px',
            left: '1444px',
            width: '425px',
            height: '425px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <SectionTitle
            title="宽带运营支撑"
            style={{ width: '400px' }}
            // selecting={mapType == 3}
            // fn={() => {
            //   setMapType(3);
            // }}
          ></SectionTitle>
          {selectedProvince.name === '全国' ? (
            <OperateSupport
              provinceName={simplifyProvinceName(selectedProvince.name)}
            />
          ) : (
            <OperateSupportDown
              provinceName={simplifyProvinceName(selectedProvince.name)}
            />
          )}
        </Block>
      </section>
      <ParallelNav
        jump={() => {}}
        show={() => {}}
        customMenu={menuList.current}
        style={{ width: '430px' }}
        currentType={currentType}
        setSelectedName={setCurrentType}
      />
      {selectedProvince && (
        <ModalView
          show={ifShowGisMap}
          fn={() => {
            setIfShowGisMap(false);
          }}
          title={'宽带资源'}
          backText="返回"
          style={{ margin: '-75px 0 0 0' }}
          modalType={'fixed'}
        >
          <GisMap
            selectProvinceInfo={selectedProvince}
            selectCityInfo={selectedCity}
            menuList={menuList.current}
            setCurrentType={setCurrentType}
            currentType={currentType}
          ></GisMap>
        </ModalView>
      )}
    </div>
  );
}

export default Broadband;
