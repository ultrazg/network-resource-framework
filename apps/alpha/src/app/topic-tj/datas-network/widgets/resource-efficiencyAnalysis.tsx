import SectionTitle from '@alpha/app/modal-view/components/section-title';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import arrow2 from '../images/arrow2.png';
import icon1 from '../images/icon1.png';
import icon2 from '../images/icon2.png';
import icon3 from '../images/icon3.png';
import icon4 from '../images/icon4.png';
import bgImg from '../images/bgImg.png';
import xImg from '../images/Xx.png';
import headerBcg from '../images/headerBcg.png';
import HiddenDangerCha from './hidden-dangerCha';
import NoncircleInfo from './non-circleInfoCha';
import NetworkStructure from './network-structureCha';
import css from '../datas-network.module.scss';
import { getResource } from '../../api/datasNetwork';
import * as echarts from 'echarts';
import { useViewport } from '@alpha/app/context/viewport-context';
import styles from '@alpha/app/topic-tj/components/map-view/map-view.module.scss';
import {transformValue} from '../../utils/utils';
import tooltipBg from '../images/tooltipBg.png'

const EfficiencyData = styled.div`
  .efficiencyBox {
    width: 470px;
    height: 107px;
    display: flex;
    justify-content: space-between;
    margin-left: 47px;
    margin-bottom: 28px;
    > div {
      height: 107px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      span:nth-of-type(2) {
        font-family: PangMenZhengDao, sans-serif;
        font-size: 20px;
        color: #ffffff;
      }
    }
    .noClass {
      position: relative;
      padding: 0 16px;
      &::before,
      &::after {
        position: absolute;
        top: 22.16px;
        content: '';
        width: 11px;
        height: 10px;
        background: url(${arrow2}) no-repeat center center;
        background-size: 100% 100%;
        opacity: 0;
      }
      &::after {
        right: 0;
      }
      &::before {
        left: 0;
        transform: rotate(180deg);
      }
    }
    .activeClass {
      position: relative;
      padding: 0 16px;
      &::before,
      &::after {
        position: absolute;
        top: 22.16px;
        content: '';
        width: 11px;
        height: 10px;
        background: url(${arrow2}) no-repeat center center;
        background-size: 100% 100%;
        opacity: 1;
      }
      &::after {
        right: 0;
      }
      &::before {
        left: 0;
        transform: rotate(180deg);
      }
      span:first-child {
        font-family: PingFangSC-SNaNpxibold, sans-serif;
        font-weight: 600;
        font-size: 12px;
        color: #00fcff;
      }
    }
    .activeText {
      font-family: PingFangSC-SNaNpxibold, sans-serif;
      font-weight: 600;
      font-size: 12px;
      color: #00fcff;
    }
    .activeTextTwo {
      font-family: PingFangSC-Regular, sans-serif;
      font-weight: 400;
      font-size: 12px;
      color: #52b9ff;
    }
  }
`;
const EcData = styled.div`
  .ecBox{
    width: 521.37px;
    height:304px;
    margin-left: 64px;
    position: relative;
    .bgBox{
      width: 550px;
      height: 286px;
      background: url(${bgImg}) no-repeat center center;
      background-size: 100% 100%;
      position:absolute;
      top:18px;
      left:-30px;
      z-index:9999;
      .close{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 25px 0 0 10px;
        >p:nth-of-type(2){
          font-family: 'FZZD';
          font-size: 16px;
          color: #00FCFF;
        }
        img{
          width: 17px;
          height: 16px;
          margin-right:21px;
        }
      }
      .swiper-slideBox{ 
        width: 554px;
        height: 179px;
        overflow-y:auto;
        /*滚动条bai整体*/
        ::-webkit-scrollbar{
          width: 4px;
        }
        ::-webkit-scrollbar-track{
          background-color:transparent; /*滑道全部*/
        }
        ::-webkit-scrollbar-track-piece{
          background-color:transparent; /*滑道*/
        }
        ::-webkit-scrollbar-thumb{
          background-color:#153A73; /*滑动条表面*/
          border:none; /*滑动条边框*/
        }
      }
      .swiper-slide {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 33px;
        width: 550px;
        &:nth-child(2n) {
          background-image: linear-gradient(270deg, rgba(42,141,210,0.10) 0%, rgba(26,121,214,0.22) 51%, rgba(36,135,221,0.10) 100%);
        }
        &:hover{
          background: linear-gradient(270deg, rgba(9,99,214,0.00) 0%, rgba(9,99,214,0.76) 35%, rgba(9,99,214,0.76) 70%, rgba(9,99,214,0.00) 100%);
        }
        a{
          font-size: 12px;
          font-family: 'PingFangSC-Regular';
          color: #FFFFFF;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        a:nth-of-type(1){
          width: 56px;
        }
        a:nth-of-type(2){
          width: 60px;
        }
        a:nth-of-type(3){
          width: 49px;
        }
        a:nth-of-type(4){
          width: 28px;
        }
        a:nth-of-type(5){
          width: 48px;
        }
        a:nth-of-type(6){
          width: 48px;
        }
        >div {
          text-align: left;
          align-items: center;
          font-size: 12px;
          font-family: 'PingFangSC-Regular';
          font-weight: 400;
          color: #FFFFFF;
          line-height: 20px;
          white-space: nowrap;
          &:nth-child(1) {
            width: 20px;
          }
          &:nth-child(2) {
            width: 24px;
          }
          &:nth-child(3) {
            width: 54px;
          }
        }
       }
       .tab-header {
        width: 550px;
        height: 50px;
        background: url(${headerBcg});
        background-size: 100% 100%;
        mix-blend-mode: normal;
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: 16px;
        font-weight: 600;
        li {
          text-align: left;
          color: #32C5FF;
          font-size: 14px;
          // width: 17%;
          list-style: none;
          &:nth-child(1) {
            width: 28px;
          }
          &:nth-child(2) {
            width: 28px;
          }
          &:nth-child(3) {
            width: 61px;
          }
          &:nth-child(4) {
            width: 56px;
          }
          &:nth-child(5) {
            width: 60px;
          }
          &:nth-child(6) {
            width: 60px;
          }
          &:nth-child(7) {
            width: 28px;
          }
          &:nth-child(8) {
            width: 56px;
          }
          &:nth-child(9) {
            width: 48px;
          }
        }
    }
  }
`;
const EcClass = styled.div`
  .ecClass{
    width: 521.37px;
    height: 304px;
`;
const StructureTypeClass = styled.div`
  .typeClass{
    position:absolute;
    right:0;
    top:11px;
    display: flex;
    z-index: 990;
    >div{
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    >div:first-child{
      margin-right:20px;
    }
    .oneClass{
      background: #22D69A;
      width:10px;
      height:10px;
    }
    .twoClass{
      background: #0090FF;
      width:10px;
      height:10px;
    }
    .spanClass{
      font-size:12px;
      padding-left: 4px;
    }
`;

function UtilizationCha(props: any) {
  const chartRef = useRef<any>('null');
  const [widthWidth, heightHeight] = useViewport();
  const zoom = widthWidth / 1920;
  const zoomh = heightHeight / 1080;
  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current);
    let cityList4 = props.cityList4.slice(0,10)
    let fourData1 = props.fourData1.slice(0,10)
    let fourData2 = props.fourData2.slice(0,10)
    let fourData3 = props.fourData3.slice(0,10)
    const option = {
      color: ['#FFCC3B','#22D69A','#0090FF'],
      legend: {
        show: true,
        top:9.8,
        right:20,
        itemGap:15,
        itemWidth:10,
        itemHeight:10,
        textStyle: {
          color: '#FFFFFF',
        },
        data: ['CR上联169骨干','SR上联CR','BRAS上联CR'],
      },
      grid: {
        show: false,
        top: '26%',
        right: '5%',
        bottom: '12%',
        left: '7%',
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          axisLabel: {
            color: '#FFFFFF',
            interval: 0,
          },
          // 网格样式
          splitLine: {
            show: false,
            lineStyle: {
              color: ['#262732'],
              width: 1,
              type: 'solid',
            },
          },
          //横轴样式
          axisLine: {
            lineStyle: {
              fontFamily: ' PingFangSC-Regular',
              fontWeight: 400,
              fontSize: 12,
              textAlign: 'center',
            },
          },
          data: cityList4,
        },
      ],
      yAxis: [
        {
          name: '设备数(台)',
          nameTextStyle: {
            color: '#00B6FD',
            fontSize: 12,
            fontWeight: '400',
            fontFamily: 'PingFangSC-Regular',
            padding: 0,
            lineHeight: 20,
          },
          type: 'value',
          // 网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ['rgba(255,255,255,0.18)'],
              width: 1,
              type: 'solid',
            },
          },
          //纵轴样式
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.54)',
              fontFamily: ' PingFangSC-Regular',
              fontWeight: 400,
              fontSize: 12,
              textAlign: 'center',
            },
          },
        },
      ],
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        // textStyle: {
        //   color: '#fff',
        //   align: 'left',
        //   fontSize: 14,
        // },
        // backgroundColor: 'rgba(0,0,0,0.8)',
        backgroundColor: "transparent",
        borderWidth: 0,
        formatter: (params:any) => {
          if(cityList4.length > 0){
            return `<div style="position: relative;width: 206px;">
              <img style="width: 206px;" src="${tooltipBg}" alt=""/>
              <div style="position: absolute; top: 14px;left: 14px;">
                <div style="font-size: 14px;color: #01FFFF;">${params[0].name}</div>
                <div style="font-size: 12px;color: #32C5FF;width:171px;display:flex;justify-content:space-between;margin:8px 0 0;">
                  <div style="display:flex;align-items:center;">    
                    <span style="display:inline-block;width:6px;height:6px;background:#FFCC3B;margin:0 5px 0 0"></span>
                    <div>CR上联169骨干</div>
                  </div>
                  <div style="font-family:PMZD;color: #01FFFF;">${params[0].value}</div>
                </div>
                <div style="font-size: 12px;color: #32C5FF;width:171px;display:flex;justify-content:space-between;">
                  <div style="display:flex;align-items:center;">    
                    <span style="display:inline-block;width:6px;height:6px;background:#22D69A;margin:0 5px 0 0"></span>
                    <div>SR上联CR</div>
                  </div>
                  <div style="font-family:PMZD;color: #01FFFF;">${params[1].value}</div>
                </div>
                <div style="font-size: 12px;color: #32C5FF;width:171px;display:flex;justify-content:space-between;margin:0 0 10px 0;">
                  <div style="display:flex;align-items:center;">    
                    <span style="display:inline-block;width:6px;height:6px;background:#0090FF;margin:0 5px 0 0"></span>
                    <div>BRAS上联CR</div>
                  </div>
                  <div style="font-family:PMZD;color: #01FFFF;">${params[2].value}</div>
                </div>
              </div>
            <div>`
          }else{
            return ``
          }
        },
        position: function(point:any, params:any) {
          if(point[0]<295){
            return [(point[0]-0), ([point[1]-75])]
          }else{
            return [(point[0]-226), ([point[1]-75])]
          }
        }
      },
      series: [
        {
          name: 'CR上联169骨干',
          data: fourData2,
          type: 'bar',
          stack:'总量',
          barWidth: 6,
        },
        {
          name: 'SR上联CR',
          data: fourData3,
          type: 'bar',
          stack:'总量',
          barWidth: 6,
        },
        {
          name: 'BRAS上联CR',
          data: fourData1,
          type: 'bar',
          stack:'总量',
          barWidth: 6,
        },
      ],
    };
    let triggerAction = function (action:any, selected:any) {
      let legend = [];
      for (let name in selected) {
          if (selected.hasOwnProperty(name)) {
              legend.push({name: name});
          }else{
            
          }
      }
      chartInstance.dispatchAction({
          type: action,
          batch: legend
      });
    };
    let isFirstUnSelect = function (selected:any, legend:any) {
      if (selected[legend] === true) return false;
      let unSelectedCount = 0;
      for (let name in selected) {
          if (!selected.hasOwnProperty(name)) {
              continue;
          }
          if (selected[name] === false) {
              unSelectedCount++;
          }
      }
      return unSelectedCount === 1;
    };
    // 所有都未选择，展示全部
    let isAllUnSelected = function (selected:any) {
      let selectedCount = 0;
      for (let name in selected) {
          if (!selected.hasOwnProperty(name)) {
              continue;
          }
          // selected对象内true代表选中，false代表未选中
          if (selected[name] === true) {
              selectedCount++;
          }
      }
      return selectedCount === 0;
    };
    chartInstance.on('legendselectchanged', function (params:any) {
      let selected = params.selected;
      let legend = params.name;
      // 使用legendToggleSelect动作将重新触发legendselectchanged事件，导致本函数重复运行从而丢失selected对象
      if (selected !== undefined) {
          if (isFirstUnSelect(selected, legend)) {
              triggerAction('legendToggleSelect', selected);
          } else if (isAllUnSelected(selected)) {
              triggerAction('legendSelect', selected);
          }
      }
    });
    chartInstance.setOption(option);
  }, [props.cityList4, props.fourData1, props.fourData2, props.fourData3]);

  return (
    <div
      className={styles['container']}
      style={{
        zoom: 1 / (widthWidth / 1920),
        transform: 'scale(' + widthWidth / 1920 + ')',
        transformOrigin: '0% 0%',
        width: (1 / (widthWidth / 1920)) * 100 + '%',
      }}
    >
      <EcClass>
        <div className="ecClass">
          <div
            ref={chartRef}
            style={{ width: '521.37px', height: '304px' }}
          ></div>
        </div>
      </EcClass>
    </div>
  );
}

function EfficiencyAnalysis(props: any) {
  const [resourceData, setresourceData] = useState<any>('1');
  const [cityList1, setCityList1] = useState<any>([]);
  const [oneData1, setOneData1] = useState<any>([]);
  const [oneData2, setOneData2] = useState<any>([]);
  const [oneData3, setOneData3] = useState<any>([]);
  const [oneData4, setOneData4] = useState<any>([]);
  const [oneData5, setOneData5] = useState<any>([]);
  const [oneData6, setOneData6] = useState<any>([]);
  const [cityList2, setCityList2] = useState<any>([]);
  const [twoData, setTwoData] = useState<any>([]);
  const [cityList3, setCityList3] = useState<any>([]);
  const [threeData1, setThreeData1] = useState<any>([]);
  const [threeData2, setThreeData2] = useState<any>([]);
  const [cityList4, setCityList4] = useState<any>([]);
  const [fourData1, setFourData1] = useState<any>([]);
  const [fourData2, setFourData2] = useState<any>([]);
  const [fourData3, setFourData3] = useState<any>([]);
  const [dangerCardDtoList,setDangerCardDtoList] = useState<any>([]);
  const header = [
    '省份',
    '城市',
    '网络类型',
    '设备名称',
    '设备IP',
    '设备类型',
    '厂家',
    '设备型号',
    '机房',
  ];
  useEffect(() => {
    getResource({}).then((res) => {
      if (res.code == 200) {
        setresourceData(res.data);
        setDangerCardDtoList(res.data.dangerCardDtoList)
        
        // 1 隐患数据
        let cityList1 = res.data.totalDangerCardStatistics?.map((item: any) => {
          return item.province;
        });
        setCityList1(cityList1);
        // 隐患柱子数据
        let oneData1 = res.data.totalDangerCardStatistics?.map((item: any) => {
          return item.crUplink169;
        });
        setOneData1(oneData1);
        let oneData2 = res.data.totalDangerCardStatistics?.map((item: any) => {
          return item.crCoreToProvince;
        });
        setOneData2(oneData2);
        let oneData3 = res.data.totalDangerCardStatistics?.map((item: any) => {
          return item.brasSrToCr;
        });
        setOneData3(oneData3);
        let oneData4 = res.data.totalDangerCardStatistics?.map((item: any) => {
          return item.idcAccessIdc;
        });
        setOneData4(oneData4);
        let oneData5 = res.data.totalDangerCardStatistics?.map((item: any) => {
          return item.idcConvergenceIdc;
        });
        setOneData5(oneData5);
        let oneData6 = res.data.totalDangerCardStatistics?.map((item: any) => {
          return item.idcToCr;
        });
        setOneData6(oneData6);

        // 2 不成环数据
        let cityList2 = res.data.nonCircleInfoList?.map((item: any) => {
          return item.province;
        });
        setCityList2(cityList2);
        // 柱子数据
        let TwoData = res.data.nonCircleInfoList?.map((item: any) => {
          return item.count;
        });
        setTwoData(TwoData);

        // 3 网络结构数据
        let cityList3 = res.data.totalNetworkStructureList?.map(
          (item: any) => {
            return item.province;
          }
        );
        setCityList3(cityList3);
        // 利用率数据柱子
        let threeData1 = res.data.totalNetworkStructureList?.map(
          (item: any) => {
            return item.brasUplinkUnbalanceCount;
          }
        );
        setThreeData1(threeData1);
        let threeData2 = res.data.totalNetworkStructureList?.map(
          (item: any) => {
            return item.crUplinkUnbalanceCount;
          }
        );
        setThreeData2(threeData2);          
        //4 利用率数据
        let cityList4 = res.data.totalResourceUtilizationList?.map(
          (item: any) => {
            return item.province;
          }
        );
        setCityList4(cityList4);
        // 利用率数据柱子
        let fourData1 = res.data.totalResourceUtilizationList?.map(
          (item: any) => {
            return item.brasToCrCount;
          }
        );
        setFourData1(fourData1);
        let fourData2 = res.data.totalResourceUtilizationList?.map(
          (item: any) => {
            return item.crTo169Count;
          }
        );
        setFourData2(fourData2);
        let fourData3 = res.data.totalResourceUtilizationList?.map(
          (item: any) => {
            return item.srToCrCount;
          }
        );
        setFourData3(fourData3);

        const arr = res.data.totalDangerCardStatistics.map((item: any) => {
          let count = 0
          for (let k in item) {
            k !== 'province' && (count += item[k])
          }
          return {
            provinceName: item.province,
            count
          }
        })
        props.setEfficiencyData(arr)
      }
    });
  }, []);

  const [currentItem, setCurrentItem] = useState<any>('1');
  const ChangeList = (pro: string) => {
    setCurrentItem(pro);
  };
  const [bgBoxShow, setBgBoxShow] = useState<any>(false);
  const changeBoxShow = (pro: any) => {
    setBgBoxShow(pro);
  };

  const chooseTable = (item:any) => {
    props.selectedCityHandle(item.city,item.equipmentName)
  }

  return (
    <>
      <SectionTitle
        title="资源效能分析"
        style={{ width: '408px', marginBottom: '30px' }}
        fn={() => props.setMapType(1)}
      />
      <EfficiencyData>
        <div className="efficiencyBox">
          <div onClick={() => ChangeList('1')}>
            <div className={currentItem == '1' ? 'activeClass' : 'noClass'}>
              <img src={icon1} style={{ width: '62px', height: '58px' }} />
            </div>
            <span
              className={currentItem == '1' ? 'activeText' : 'activeTextTwo'}
            >
              互联网链路单板卡隐患
            </span>
            <span>{transformValue(resourceData.dangerCardCount)}</span>
          </div>
          <div onClick={() => ChangeList('2')}>
            <div className={currentItem == '2' ? 'activeClass' : 'noClass'}>
              <img src={icon2} style={{ width: '62px', height: '58px' }} />
            </div>
            <span
              className={currentItem == '2' ? 'activeText' : 'activeTextTwo'}
            >
              不成环接入设备数
            </span>
            <span>{transformValue(resourceData.acyclicCount)}</span>
          </div>
          <div onClick={() => ChangeList('3')}>
            <div className={currentItem == '3' ? 'activeClass' : 'noClass'}>
              <img src={icon3} style={{ width: '62px', height: '58px' }} />
            </div>
            <span
              className={currentItem == '3' ? 'activeText' : 'activeTextTwo'}
            >
              节点流量失衡
            </span>
            <span>{transformValue(resourceData.networkStructureCount)}</span>
          </div>
          <div onClick={() => ChangeList('4')}>
            <div className={currentItem == '4' ? 'activeClass' : 'noClass'}>
              <img src={icon4} style={{ width: '62px', height: '58px' }} />
            </div>
            <span
              className={currentItem == '4' ? 'activeText' : 'activeTextTwo'}
            >
              上联带宽利用率
            </span>
            <span>{transformValue(resourceData.resourceUtilization)}</span>
          </div>
        </div>
      </EfficiencyData>
      <EcData>
        <div className="ecBox">
          {bgBoxShow?
            <div className="bgBox">
            <div className='close'>
              <p></p>
              <p>隐患分析</p>
              <img src={xImg} onClick={() => changeBoxShow(false)} style={{cursor: 'pointer'}}></img>
            </div>
            <ul className="tab-header">
              {header &&
                header.map((item: any, index: number) => {
                  return <li key={index}>{item}</li>;
                })}
            </ul>
            <div className='swiper-slideBox'>
              {dangerCardDtoList &&
                dangerCardDtoList.map((item: any, index: number) => {
                  return (
                    <div className="swiper-slide" key={index} onClick={()=>chooseTable(item)}>
                      <div>{item.provinceName}</div>
                      <div>{item.city}</div>
                      <div>{item.networkType}</div>
                      <a title={item.equipmentName}>{item.equipmentName}</a>
                      <a title={item.equipmentIp}>{item.equipmentIp}</a>
                      <a title={item.equipmentType}>{item.equipmentType}</a>
                      <a title={item.manufactor}>{item.manufactor}</a>
                      <a title={item.equipmentModel}>{item.equipmentModel}</a>
                      <a title={item.room}>{item.room}</a>
                    </div>
                  );
                })
              }
            </div>  
          </div>
          :''}
          <div
            className={css['province-source-box']}
            style={{ position: 'absolute', left: '0', top: '0',zIndex:'999' }}
          >
            <h1 className={css['title-eff']} style={{ margin: '0' }} onClick={() => changeBoxShow(true)}>
              带宽利用率大于70%
            </h1>
          </div>
          {currentItem == '1' ? (
            <HiddenDangerCha
              cityList1={cityList1}
              oneData1={oneData1}
              oneData2={oneData2}
              oneData3={oneData3}
            ></HiddenDangerCha>
          ) : (
            ''
          )}
          
          {currentItem == '2' ? (
            <NoncircleInfo cityList2={cityList2} twoData={twoData} />
          ) : (
            ''
          )}
          {currentItem == '3' ? (
            <NetworkStructure cityList3={cityList3} threeData1={threeData1} threeData2={threeData2}/>
          ) : (
            ''
          )}
          {currentItem == '4' ? (
            <UtilizationCha
              cityList4={cityList4}
              fourData1={fourData1}
              fourData2={fourData2}
              fourData3={fourData3}
            />
          ) : (
            ''
          )}
        </div>
      </EcData>
    </>
  );
}
export default EfficiencyAnalysis;
