import styles from './quality-board.module.scss';
import { Block } from '@network-resource-vis/block';
import { useEffect, useRef, useState } from 'react';

import TotalDetails from './widgets/total-details';
import ChinaMap from './widgets/china-map';
import ProfessionalDetails from './widgets/operate-support';

// import GisMap, {
//   ProvinceInfoObj,
// } from '@alpha/app/topic/broadband-2/widgets/gis/gis-map';
/* eslint-disable-next-line */
export interface QualityBoardProps {

}

export function QualityBoard(props: QualityBoardProps) {
  const defaultProvince = {
    id: '10',
    size: '5000',
    name: '全国',
    center: [118.767413, 32.041544],
    cp: [118.767413, 32.041544],
    childNum: 19,
  };
  const [showSection, setShowSection] = useState<boolean>(true);
  const [speciality, setSpeciality] = useState<string>('');
  const [mapType, setMapType] = useState(0);
  const [currentType, setCurrentType] = useState('宽带资源上图');
  // const [selectedProvince, setSelectedProvince] =
  //   useState<ProvinceInfoObj>(defaultProvince);
  // const [selectedCity, setSelectedCity] = useState<
  //   ProvinceInfoObj | undefined
  // >();
  const [ifShowGisMap, setIfShowGisMap] = useState(false);
  const [outTarget, setOutTarget] = useState('');
  const changeTitle = (value:string) => {
    setSpeciality(value);
  }
  return (
    <div className={styles['container']}>
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
            left: '70px',
            width: '340px',
            height: '915px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <TotalDetails></TotalDetails>
          
        </Block>
        <Block
          blockStyle={{
            top: '150px',
            left: '530px',
            width: '860px',
            height: '785px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
        {/* 地图 */}
        <ChinaMap
          type={mapType}
          selectedName={currentType}
          // showGis={(data: ProvinceInfoObj) => {
          //   // setSelectedProvince(data);
          //   setIfShowGisMap(true);
          // }}
          // setProvince={setSelectedProvince}
          // setCity={setSelectedCity}
          outTarget={outTarget}
          setOutTarget={setOutTarget}
          tabIndex={speciality}
        ></ChinaMap>
        </Block>
        <Block
          blockStyle={{
            top: '93px',
            left: '1400px',
            width: '450px',
            height: '915px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <ProfessionalDetails changeTitle={changeTitle}></ProfessionalDetails>
          
        </Block>
      </section>
    </div>
  );
}
export default QualityBoard;
