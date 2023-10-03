// 资源总揽组件
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import SectionTitle from './section-title';
import * as echarts from "echarts";
import css from '../core-network.module.scss'
import {transformValue} from '../../utils/utils';
interface ListDatas{
  name?:string,
  userNum?:string,
  userPercent?:string
}
const CriceStyle = styled.div`
.ecClass{
  width:100%;
  height:200px;
  display:flex;
  div{
    flex:1;
    height:100%
  }
  .big-echart{
    margin-top:40px;
    transform: scale(1.3);
    div{
      margin:0 auto !important;
    }
  }
}
`
export function OperationPage(props:any) {
  const business = props.business;
  const coreType = props.coreType;
  let mainTitle = coreType == '5GC核心网' ? '5GC运营情况' : (coreType == '移动核心网' ? '移动核心运营情况' : 'VIMS运营情况')
  let coreTypeNum = coreType == '5GC核心网' ? 1 : (coreType == '移动核心网' ? 2 : 3)
  let iconClass = coreType == '5GC核心网' ? 'operation-5G-icon' : (coreType == '移动核心网' ? 'operation-mob-icon' : 'operation-VIMS-icon')
  // 页面列表数据处理
  let pageDatas = [];  //列表数据
  let barLists:Array<any> = [];  //echarts数据列表
  if(coreTypeNum == 1){
    pageDatas = [{
      name:'5G开户用户数（ 万 ）',
      userNum: business.openUserNum,
      userPercent: business.openUserPercent
    },{
      name:'5G注册用户数（ 万 ）',
      userNum:business.registerUserNum,
      userPercent: business.registerUserPercent
    },{
      name:'全网峰值流量（ Gbps ）',
      userNum: business.dataNum,
      userPercent: business.dataPercent
    },{
      name:'AMF挂接5G SA基站（ 万 ）',
      userNum: business.amfNum,
      userPercent:business.amfPercent
    }]
    barLists = [{
        title:`初始注册\n成功率`,
        value:[business.orgRegisterPercent]
      },{
        title:`业务请求\n成功率`,
        value:[business.businessPercent]
      },{
        title:`注册更新\n成功率`,
        value:[business.updRegisterPercent]
      },{
        title:`PAU会话\n成功率`,
        value:[business.pauPercent]
      }
    ]
  }else if(coreTypeNum == 2){
    pageDatas = [{
      name:'上行峰值流量（Gbps）',
      userNum: business.upData,
      userPercent: business.upDataPercent
    },{
      name:'下行峰值流量（Gbps）',
      userNum: business.downData,
      userPercent: business.downDataPercent
    },{
      name:'2/3/4G话务量（ 万Erl ）',
      userNum: business.trafficNum,
      userPercent: business.trafficPercent
    },{
      name:'主叫接通次数（万）',
      userNum: business.dialNum,
      userPercent: business.dialNumPercent
    }]
  }else{
    pageDatas = [{
      name:'接入注册用户数（万）',
      userNum: business.registerNum,
      userPercent: business.registerPercent
    },{
      name:'占用话务量（ 万Erl ）',
      userNum: business.occupyNum,
      userPercent: business.occupyPercent
    }]
    barLists = [{
        title:`初始注册\n成功率`,
        value:[business.orgRegisterPercent],
      },{
        title:`网络\n接通率`,
        value:[business.netConnectPercent],
      },{
        title:`稳定\n通话率`,
        value:[(100-business.lostPercent)],
      }
    ]
  }
  let colorLIsts = [{
    first:"#165EA6",
    center:"#54A9FF",
    end:"#1D7BDA"
  },{
    first:"#05B8FF",
    center:"#2FC4FF",
    end:"#81D3F3"
  },{
    first:"#E99F0C",
    center:"#FFB41F",
    end:"#FFDB94"
  },{
    first:"#175FEA",
    center:"#3378FF",
    end:"#6498FF"
  }]
  const chartRef = useRef<any>('null');
  const chartRef2 = useRef<any>('null');
  const chartRef3 = useRef<any>('null');
  const chartRef4 = useRef<any>('null');
  useEffect(() => {
    if(props.business){
      const echartsAll = [{
        chartInstance : echarts.init(chartRef.current)
      },{
        chartInstance : echarts.init(chartRef2.current)
      },{
        chartInstance : echarts.init(chartRef3.current)
      },{
        chartInstance : echarts.init(chartRef4.current)
      }
    ]
    const titleText = {
      title:'60%',
      subTitle:`初始注册\n成功率`
    }
    let indexCurr = 0 //当前元素颜色下标
    const defaultOption = {
        title: [{
          text: titleText.title,
          x: 'center',
          top: '24%',
          textStyle: {
              fontSize: '18',
              color: '#fff',
              fontFamily: 'PangMenZhengDao',
              foontWeight: '400',
          },
        },{
          text:titleText.subTitle,
          x: 'center',
          z:100,
          bottom: '18%',
          textStyle: {
              fontSize: '14',
              lineHeight: 18,
              color:'rgba(2, 144, 224, 1)',
              foontWeight: '400',
          },
        }],
        polar: {
            radius: ['60%', '80%'],
            center: ['50%', '30%'],
        },
        angleAxis: {
            max: 100,
            show: false,
        },
        radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false,

            },
            axisTick: {
                show: false
            },
        },
        series: [
            {
                name: '',
                type: 'bar',
                roundCap: true,
                barWidth: 200,
                stack: 'a',
                data: [20],
                coordinateSystem: 'polar',
                itemStyle: {
                  shadowColor: 'rgba(0, 0, 0, 1)',//设置折线阴影
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: colorLIsts[indexCurr].first
                    }, {
                      offset: 0.25,
                      color: colorLIsts[indexCurr].center
                    }, {
                      offset: 0.5,
                      color:colorLIsts[indexCurr].end
                    }, {
                      offset: 0.75,
                      color:  colorLIsts[indexCurr].center
                    }, {
                        offset: 1,
                        color: colorLIsts[indexCurr].first
                    }]),
                    shadowBlur: 16,
                    shadowColor: colorLIsts[indexCurr].first,
                  }
                }
            },
            {
              name: '',
              type: 'pie',
              startAngle: 90,
              radius: ['76%', '85%'],
              hoverAnimation: false,
              center: ['50%', '30%'],
              itemStyle: {
                  normal: {
                      labelLine: {
                          show: false
                      },
                      color: 'rgba(0, 108, 226, .15)',
                  }
              },
              data: [{
                  value: 100,

              }]
            }
        ] 
    };
    barLists && barLists.forEach((item:any, index:number)=>{
      let currOption = defaultOption
          currOption.series[0].data = item.value
          currOption.title[0].text = item.value + '%'
          currOption.title[1].text = item.title
          //@ts-ignore
          currOption.series[0].itemStyle.normal.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: colorLIsts[index].first
          }, {
            offset: 0.25,
            color: colorLIsts[index].center
          }, {
            offset: 0.5,
            color:colorLIsts[index].end
          }, {
            offset: 0.75,
            color:  colorLIsts[index].center
          }, {
              offset: 1,
              color: colorLIsts[index].first
          }]);
          let currEchartObj = echartsAll[index].chartInstance
          currEchartObj.setOption(currOption);
    })
    }
}, [coreTypeNum,business]);
  return (
    <>
      <SectionTitle
        mainTitle = { mainTitle }
        mainTitleColor = '#00FAF9'
        subTitle = ''
        style={{
          margin: coreTypeNum == 2? "-6px 0px 0px 5px" : "34px 0 0  5px",
          width: '500px'
        }}
      ></SectionTitle>
      <div className={css['operation-main-cont']}>
          <div className={css['all-name']}>全国</div>
        { coreTypeNum == 2?<div className={css['mob-cont']}> 
            <div className={css['left']}>
            </div>
            <div className={css['right']}>
              <p className={css['num']}>2/3/4G用户数（万）</p>
              <p>
                <span  className={css['total-num']}>{business.userNum?transformValue(business.userNum, true):0}</span>
                <span className={`${css['rate']} ${css[Number(business.userPercent) >  0 ? 'rate-up':'']}`}>{business.userPercent}%</span>
              </p>
            </div>
          </div> : ""
          }
          <div className={css['main-cont']}>
            {
              pageDatas && pageDatas.map((item:ListDatas,index:number)=>{
                return(
                  <div  className={css['main-detail-cont']} key={index}>
                    <h1>{ item.name }</h1>
                    <div className={css['cont-detail']}> 
                      <div className={css['left']}>
                        <span className={`${css['icon-img']}  ${css[`${iconClass}${index + 1}`]}`}></span>
                      </div>
                      <div className={css['right']}>
                        <p className={css['num']}>{transformValue(item.userNum, true)}</p>
                        <p className={`${css['rate']} ${css[Number(item.userPercent) >  0 ? 'rate-up':'']}`}>{(Number(item.userPercent)- 0) > 0 ? item.userPercent : (0 - Number(item.userPercent))}%</p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
          { coreTypeNum == 2? <div className={css['mob-cont1']}> 
            <span className={css['left-icon']}>
               <em>{business.dialPercent}%</em>
            </span>
            <span className={css['right-cont']}>
              主叫接通率
            </span>
          </div>:""
          }
           <CriceStyle style={{display: coreTypeNum != 2? "block" : "none"}}>
            <div className="ecClass">
                <div  className={coreTypeNum == 3?"big-echart":""} ref={chartRef}></div>
                <div  className={coreTypeNum == 3?"big-echart":""} ref={chartRef2}></div>
                <div  className={coreTypeNum == 3?"big-echart":""} ref={chartRef3}></div>
                <div ref={chartRef4}  style={{display: coreTypeNum == 1? "block" : "none"}}></div>
            </div>
          </CriceStyle>
        </div>
    </>
  );
}
export default OperationPage;
