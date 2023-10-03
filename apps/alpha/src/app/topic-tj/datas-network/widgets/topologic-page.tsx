// 资源总揽组件
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { getProvinceBackboneRoute } from '../../api/datasNetwork'
import SectionTitle from '@alpha/app/components/section-title/section-title';
import * as echarts from "echarts";
import css from '../datas-network.module.scss'
import tupuDevice from '../images/tupu-device.png'
import tupuTitle from '../images/tupu-title.png'
import tupuDeviceActive from '../images/tupu-device-active.png'
import tupuAr from '../images/tupu-ar.png'
import tupuCenterBg from '../images/tupu-center-bg.png'
import tupuBottomBg from '../images/tupu-bottom-bg.png'
import { useViewport } from "@alpha/app/context/viewport-context";
import TopologicTab from './topologic-tab'
const CriceStyle = styled.div`
position: relative;
.echars-box{
    top:-38px;
    width:63%;
    height:740px;
    margin-left:339px;
    z-index:10;
}
.center-bg{
    position: absolute;
    left:115px;
    right:0;
    top:-88px;
    bottom:0;
    width:253px;
    height:131px;
    margin:auto;
    transform:scale(1.2);
    background:url(${tupuCenterBg}) no-repeat center center;
    background-size:100% 100%
}
.bottom-bg{
    position: absolute;
    left:130px;
    right:0;
    bottom:34px;
    width:741px;
    height:96px;
    margin:0 auto;
    z-index:1;
    background:url(${tupuBottomBg}) no-repeat center center;
    background-size:100% 100%
}
`
const legend2 = `image://${tupuTitle}`;
const legend3 = `image://${tupuDeviceActive}`;

const symbol1 = `image://${tupuDevice}`;
const symbol2 = `image://${tupuAr}`;
const getLastValue = (value:any, type:string)=>{
   const  str = value.lastIndexOf(type)
   return value.substring( str+1, value.length )
}
export function TopologicPage(props:any) {
    const [widthWidth] = useViewport();
    const zoom = widthWidth / 1920;
    const chartRef = useRef<any>('null');
    // let echartsDatas:any = []
    // let echartsLinks:any = []
    // const [echartsDatas, setEchartsDatas] = useState<Array<any>>([]); 
    // const [echartsLinks, setEchartsLinks] = useState<Array<any>>([]); 
    const [eqpTypeId, setEqpTypeId] = useState('24000008');    // 网络拓扑编码: 24000008: 城域网(CR); 87770272: 智能城域网(MCR); 87770251: IPRAN(RSG); 
    //选择类型切换
    const setEqpTypeIdHandle = (eqpTypeId: string) => {
        setEqpTypeId(eqpTypeId);
    }
    useEffect(() => {
         const chartInstance = echarts.init(chartRef.current)
        //  let  coordinateDatas:any = null
         let symbolSizeObj:any = null
         let echartsDatas:any = []
         let echartsLinks:any = []
         const option = {
            tooltip: {},
            series: {
                type: 'graph',
                layout: 'none', // 图的布局
                symbol: symbol1,
                focusNodeAdjacency: true,
                symbolSize: 50 || symbolSizeObj.symbolSizeSmall,
                circular: {
                    rotateLabel: true
                },
                tooltip: {
                    padding:[20],
                    borderWidth:0,
                    backgroundColor: '#0a1533',
                    textStyle:{
                        color:'#fff',
                        fontSize: 14 ,
                    },
                    formatter: (params:any)=>{
                        let value = params.data.value
                        if(value) return value.subName
                        else return ''
                    },
                },
                edgeLabel: { 
                    show: true,
                    normal: {
                        show: true,
                        position: 'middle',
                        textStyle: { 
                            fontSize: 16,
                            color:'#fff',
                            distance:10,
                            fontFamily:'PingFangSC',
                            fontWeight:'bolder',
                            align:'center'
                        },
                        formatter: (params:any)=>{
                            if(params.value) return `{b1|${params.value}}`
                            // if(params.value) return `{b${params.data.type}|${params.value}}`
                            else return ''
                        },
                        rich: {
                            b1: {
                                width:81,
                                height:36,
                                lineHeight:110 || symbolSizeObj.lineHeightNum,
                                backgroundColor:{
                                    image: require("../images/tupu-title.png"),
                                },
                            },
                            b2: {
                                width:81,
                                height:36,
                                lineHeight:-120 || symbolSizeObj.lineHeightNum,
                                backgroundColor:{
                                    image: require("../images/tupu-title.png"),
                                },
                            }
                        }
                    }
                },
                label: { 
                    position: ['50%', '44%'],
                    show: true,
                    align: 'center',
                    textStyle: { fontSize: 12, color: '#00FEFF'}, 
                    formatter: (params:any) => {
                        if(params.value.name || params.value.subName ){
                            if(params.value.subName && params.value.name) return  '{c|' + params.value.name +'}'+ '\n\n' + '{d|' + params.value.subName.substring(0,6) +'...}'
                            else if(params.value.name) return  '{c|' + params.value.name + '}' 
                            else return  '\n\n\n\n\n\n\n' + '{d|' +  params.value.subName.substring(0,6) +'...}'
                        }else{
                            return ''
                        }
                    },
                    rich: {
                        c: {
                            fontSize: 16,
                            color:'#00FEFF',
                            fontFamily:'FZZDHJW--GB1',
                            fontWeight:'bolder',
                        },
                        d: {
                            lineHeight:26,
                            color: '#fff',
                        }
                    }
                },
                emphasis:{
                    symbol: symbol2,
                    focus:"adjacency",
                    label:{
                        textStyle: { fontSize:18, color: '#fff'}, 
                    },
                    edgeLabel: { 
                        show: true,
                        normal: {
                            show: true,
                            textStyle: { 
                                color:'red',
                            },
                            formatter: (params:any)=>{
                                if(params.value) return `{b${params.data.type}|${params.value}}`
                                else return ''
                            },
                            rich: {
                                b1: {
                                    width:81,
                                    height:36,
                                    lineHeight:120 || symbolSizeObj.lineHeightNum,
                                    backgroundColor:{
                                        image: require("../images/tupu-title-active.png"),
                                    },
                                }
                            }
                        }
                    },
                },
                edgeSymbol: ['circle', 'circle'],
                edgeSymbolSize: [1, 1],
                data: echartsDatas,
                links: echartsLinks,
                lineStyle: {
                    opacity: 0.9,
                    width: 1,
                    curveness: 0,
                    color: '#fff'
                }
            }
        };
        // 椭圆计算
        // a 长半径， b 短半径， p 节点的间隔 ， cx, cy 圆心, 
            const getCPoint = ({ a=40, b=30, p = 8, cx = 0, cy = 0 })=> {
                const data = []
                for (let index = 0; index < 360; index = index + p) {
                let x = a * Math.cos(Math.PI * 2 * index / 360)
                let y = b * Math.sin(Math.PI * 2 * index / 360)
                data.push(...[
                    {
                        x:x + cx,
                        y:y + cy
                    }
                ])
                }
                return data
            }
            getProvinceBackboneRoute({
                provinceCode:props.provinceId,   // 省份编码
                eqpTypeId:eqpTypeId       
            }).then((res: any) => {
                if(res.code == 200 && res.data){
                    
                    let total = 0
                    res.data.regionList && res.data.regionList.forEach((element:any) => {
                        total +=  element.eqpList? element.eqpList.length : 0
                    });
                    const totalLength = res.data.regionList?total:0  //数据个数
                   const coordinateDatas = getCPoint({ a:40, b:30, p:360/totalLength, cx: 0, cy:0 })
                    symbolSizeObj = {
                        symbolSizeSmall: totalLength > 20 ? 50 : 80,
                        symbolSizeBig: 100,
                        lineHeightNum:totalLength > 20 ? 120 : 200,
                    }
                    //中间中心点数据处理
                    const fatherPoint = [{
                            x:-6, 
                            y:0,
                        },{
                            x:6, 
                            y:0,
                        }]
                    const fatherArray = res.data.arEqpList && res.data.arEqpList.map((item:any, i:number)=>{
                        return {
                            name:item.eqpId,
                            value: {
                            name: '',
                            subName:''
                            },
                            x:fatherPoint[i].x, 
                            y:fatherPoint[i].y,
                            symbol: symbol2,
                            symbolSize:100 || symbolSizeObj.symbolSizeBig
                        }
                    })
                    //周围详细数据
                    const childrenInitArray = res.data.regionList && res.data.regionList.map((item:any, i:number)=>{
                       let allChildsArray =  item.eqpList && item.eqpList.map((curr:any, ci:number)=>{
                            return {
                                name:curr.eqpId?curr.eqpId:'',
                                regionName:item.regionName?item.regionName:'',
                                regionId:item.regionId?item.regionId:'',
                                value: { 
                                    name:curr.eqpTypeName?curr.eqpTypeName:'', 
                                    subName:curr.eqpNo?curr.eqpNo:'',
                                },
                                cityName:item.regionName
                            }
                        })
                        
                        return allChildsArray ? allChildsArray :  undefined
                    })
                    const childrenFlatArray = [ ].concat.apply( [ ], childrenInitArray ) 
                    const childrenArray = childrenFlatArray && childrenFlatArray.map((item:any, i:number)=>{
                        return {
                            ...item,
                            x:coordinateDatas[i].x, 
                            y: coordinateDatas[i].y
                        }
                    })
                    let totalDataArray  = null
                    if( fatherArray&& fatherArray.length>0){
                        totalDataArray = [...fatherArray, ...childrenArray]
                    }else{
                        totalDataArray = [ ...childrenArray]
                    }
                    // setEchartsDatas(totalDataArray)
                    echartsDatas = totalDataArray
                    const linksDatas = res.data.routeList && res.data.routeList.map((item:any, i:number)=>{
                        let type = 1;
                        type = i < ((res.data.routeList.length)/2) ? 1 : 2
                        // if(res.data.routeList.length%2 == 0){
                        //     type = i < ((res.data.routeList.length)/2) ? 1 : 2
                        // }else{
                        //     type = i < ((res.data.routeList.length)/2) ? 1 : 2
                        // }
                        return {
                            source:item.eqpIdA,
                            target:item.eqpIdZ,
                            type:type,
                            cityId:item.regionIdA ? item.regionIdA : (item.regionIdZ ? item.regionIdZ : ''),
                            labelName:item.regionNameA ? item.regionNameA : (item.regionNameZ ? item.regionNameZ : ''),
                            label: {     //y轴以下展示地级市名称
                                normal: {
                                    show: true,
                                    width:81,
                                    height:36,
                                    lineHeigh:72,
                                    position: 'middle',
                                    textStyle: { 
                                        fontSize: 16,
                                        color:'#fff',
                                        distance:10,
                                        fontFamily:'PingFangSC',
                                        fontWeight:'bolder',
                                        align:'center'
                                    },
                                    formatter: (params:any)=>{
                                        const labelName = params.data.labelName?params.data.labelName:"" 
                                        if(params.data && labelName) return `{b${type}|${getLastValue(params.data.labelName, "省")}}`
                                        else return ''
                                    },
                                    rich: {
                                        b1: {
                                            width:81,
                                            height:36,
                                            lineHeight:220,
                                            backgroundColor:{
                                                image: require("../images/tupu-title.png"),
                                            },
                                        },
                                        b2: {
                                            width:81,
                                            height:36,
                                            lineHeight:-100,
                                            backgroundColor:{
                                                image: require("../images/tupu-title.png"),
                                            },
                                        }
                                    }
                                }
                            },
                            // value:item.regionNameA ? item.regionNameA : (item.regionNameZ ? item.regionNameZ : '')
                        }
                    })
                    echartsLinks = linksDatas
                    console.log('linksDatas')
                    console.log(linksDatas)
                    option.series.data = totalDataArray
                    option.series.links = linksDatas
                    chartInstance.setOption(option)
                    // setEchartsLinks(linksDatas)
                }
            })
    // 设置点击事件
    const handleClickNode = (chart:any)=> {
        chart.off('click') // 很重要！！否则每次渲染都会增加一次点击事件
        chart.on('click', function (params:any) {
        if (params.dataType === 'node') {
            if(params.data.value && params.data.value.name){
                let cityName = getLastValue(params.data.regionName, "省")
                let eqName = params.value.subName;
                props.selectedCityHandle(cityName, eqName);
            }
        } else if (params.dataType === 'edge') {
            props.selectedInfosHandle(params.data.labelName, params.data.cityId, eqpTypeId);
        }
        })
    }
    handleClickNode(chartInstance)
    }, [eqpTypeId,props.provinceId]);
    return (
        <>
        <TopologicTab showFlag={props.showFlag} province={props.province}  provinceName={props.provinceName} setProvinceName={props.setProvinceName} setProvinceId={props.setProvinceId} changeTab={props.changeTab} setEqpTypeIdHandle={setEqpTypeIdHandle} toggleCompHandle={props.toggleCompHandle} style={{zIndex:100}}></TopologicTab>
        <div className={css['operation-main-cont']} style={{
                    zoom: 1 / (zoom),
                    transform: "scale("+(zoom)+")", 
                    transformOrigin: "0% 0%", 
                    width: (1/(zoom)) * 100 + "%" ,
                    zIndex:10
        }}>
            <CriceStyle>
            <div className="echars-box" ref={chartRef}></div>
            <div className="center-bg"></div>
            <div className="bottom-bg"></div>
            </CriceStyle>
            </div>
        </>
    );
}
export default TopologicPage;
