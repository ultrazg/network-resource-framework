// 数据网-网络示图组件
import styled from 'styled-components';
import { useState,useEffect } from 'react';
import MapChart from './map-chart';
import TopologicPage from './topologic-page';
import backUrl from '../images/topology_bg.png'
import MetropolitanAreaNetwork from './metropolitan-area-network/metropolitan-area-network';
const NetworkDiagramBox = styled.div`
    width: 1516px;
    box-sizing: border-box;
    height: 1080px;
    top: 20px;
    left: -55px;
    margin-top: -160px;
    margin-left: -95px;
    zIndex:  1;
    padding-top: 161px;
    background:url(${backUrl}) no-repeat center center;
    background-size:100% 100%;
}
`

export interface DatasNetworkConatinerProps { 
  selectedCityHandle:  (provinceName: string, eqpName: string) => void;
  gotoGisMap:  (provinceName: string, eqpName: string) => void;
  toggleComp: (i: number)=> void;
  changeShowFlag: (index: number)=> void;
  changeTab: (index: number)=> void;
  showFlag: number;
  tabIndex: number;
}

export function NetworkDiagram(props: DatasNetworkConatinerProps) {
  const [provinceId, setProvinceId] = useState<string>('');
  const [provinceName, setProvinceName] = useState<string>('');
  const [province, setProvince] = useState<any>([]);
  const [cityId, setCityId] = useState<string>('');  //拓扑下钻到第三层参数
  const [cityName, setCityName] = useState<string>('');  //拓扑下钻到第三层参数
  const [eqpTypeId, seteqpTypeId] = useState<string>('');  //拓扑下钻到第三层参数
  const selectedProvinceHandle = (name:string,id:string) => { //拓扑下钻到第二层
    setProvinceId(id);
    setProvinceName(name);
    props.changeShowFlag(1);
  }
  const selectedInfosHandle = (cityName: string, cityId:string,type:string) => { //拓扑下钻到第三层
    setCityId(cityId);
    setCityName(cityName);
    seteqpTypeId(type)
    props.changeShowFlag(2);
  }
  const toggleCompHandle = (i: number)=>{ //返回全国页面
    props.changeShowFlag(i);
  }
  useEffect(() => {
    props.changeShowFlag(0);
  }, []);
  return (
    <>
      <div>
         <NetworkDiagramBox>
            {props.showFlag==0 ? 
            <MapChart
            setProvince={setProvince} selectedProvinceHandle={selectedProvinceHandle} changeTab={props.changeTab} />:props.showFlag==1 ?
             <TopologicPage showFlag={props.showFlag} selectedCityHandle={ props.selectedCityHandle } province={province} provinceId={provinceId} setProvinceId={setProvinceId} provinceName={provinceName} setProvinceName={setProvinceName} changeTab={props.changeTab} selectedInfosHandle={selectedInfosHandle} toggleCompHandle={toggleCompHandle}  /> : 
             props.showFlag==2 ?
             <MetropolitanAreaNetwork provinceCode={provinceId} cityId={cityId} eqpTypeId={eqpTypeId} provinceName={provinceName} citiesName={cityName} gotoGisMap={props.gotoGisMap} changeTab={props.changeTab} toggleCompHandle={toggleCompHandle}/> :
             ''
             }
         </NetworkDiagramBox>
      </div>
      
    </>
  );
}

export default NetworkDiagram;
