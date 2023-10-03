import { useState } from 'react';
import styles from './wireless-network.module.scss';
import { Block } from '@network-resource-vis/block';
import ChinaMap from '@alpha/app/topic-tj/wireless-network/widgets/china-map';
import ModalView from '@alpha/app/modal-view/modal-view';
import WirelessMapView from './wireless-mapView';
import ResourceOverview from '@alpha/app/topic-tj/wireless-network/widgets/resource-overview';
import ShareBasePage from '@alpha/app/topic-tj/wireless-network/widgets/shareBasePage';
import NetworkStronger from '@alpha/app/topic-tj/wireless-network/widgets/networkStronger';
import ResourceLifecycle from '@alpha/app/topic-tj/wireless-network/widgets/resource-lifecycle';
import EquipmentFiveDialog from '@alpha/app/topic-tj/wireless-network/equipment-five-dialog/equipment-five-dialog';
/* eslint-disable-next-line */
export interface WirelessNetworkConatinerProps {}

export function WirelessNetworkContainer(props: WirelessNetworkConatinerProps) {
  const [module, setModule] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [showModel, setShowModel] = useState(false);
  const selectedProvinceHandle = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setModule(1);
  };
  
  // 设置右边详情默认值
  const [rightDetailsDef, setRightDetailsDef] = useState({
    tabVal: '2', // 1显示的是基本信息， 2显示的是无线设备tab
    selectEqpId: '039067610100000548550450', // 需要选中的设备ID
    roomDevType: 'GM', // 基站-->GM, RRU-->RRU， BBU-->BBU // 是那个类型的设备
    roomID: '030002050000000000014899'
  })
  return (
    <div>
      {/* <button
        onClick={() => {
          setShowModel(true);
        }}
      >
        点击显示弹窗
      </button>
      <EquipmentFiveDialog
        showModel={showModel}
        handleCancel={() => {
          setShowModel(false);
        }}
      /> */}
      <WirelessNetworkMain selectedProvinceHandle={selectedProvinceHandle} />
      <ModalView
        show={!!selectedProvince && module === 1}
        fn={() => {
          setModule(0);
        }}
        title={'无线网资源可视化'}
        backText="返回"
        style={{ margin: '-75px 0 0 0' }}
        modalType={'fixed'}
      >
        <WirelessMapView provinceName={selectedProvince} rightDetailsDef={rightDetailsDef} />
      </ModalView>
    </div>
  );
}

export interface WirelessNetworkMainProps {
  selectedProvinceHandle: (name: string) => void;
}
export function WirelessNetworkMain(props: WirelessNetworkMainProps) {
  const [showSection, setShowSection] = useState(true);
  const [mapType, setMapType] = useState(0);
  const [outTarget, setOutTarget] = useState('');

  return (
    <div className={styles['container']} id="wirelessContainer">
      <Block
        blockStyle={{
          top: '155px',
          left: '494px',
          width: '933px',
          height: '900px',
          zIndex: 100,
        }}
        blockBackground={false}
        blockCorner={false}
      >
        {/* 地图 */}
        <ChinaMap
          type={mapType}
          selectedProvinceHandle={props.selectedProvinceHandle}
          outTarget={outTarget}
          setOutTarget={setOutTarget}
        ></ChinaMap>
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
            width: '420px',
            height: '915px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <ResourceOverview />
          <ShareBasePage />
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
            top: '93px',
            right: '80px',
            width: '474px',
            height: '915px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <NetworkStronger />
        </Block>
        <Block
          blockStyle={{
            top: '560px',
            right: '80px',
            width: '513px',
            height: '415px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <ResourceLifecycle />
        </Block>
      </section>
    </div>
  );
}

export default WirelessNetworkContainer;
