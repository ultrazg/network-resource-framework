import styles from './map-view.module.scss';
import styled from 'styled-components';
import { useEffect, useState, useImperativeHandle, forwardRef, useMemo  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMapSelect } from '@alpha/app/redux/map.slice';

import { MapObject } from "./mapUtil/mapObject";

import { useViewport } from "@alpha/app/context/viewport-context";
import { Event, Eventer } from './mapUtil/event';

import MapWindow, { windowParams } from './map-window/map-window';
// 引入地图插件
import MapTitle from'./map-title/map-title';
// 引入地图
import MapCover from'./map-cover/map-cover';

let MapBox = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: #15325a;
`

/* eslint-disable-next-line */
export interface MapFnObject {
  showWindow: Function,
  showTitle: Function,
  showTitles: Function,
  hideWindow: Function,
  hideTitle: Function,
  hideTitles: Function,
  showTitlesAdd: Function,
  getChinaPolygon: Function,
  showWindowDom: Function,
  showCovers: Function,
  hideCovers: Function,
  addPlugin: Function, 
  removePlugin: Function
}
export interface MapViewProps {
  loadMap?: (mapObj: MapObject, mapFnObject?: MapFnObject) => void;
  provinceName?: string;
  mapLevel?: number;
  ref?: any;
}

interface windowTitleParams {
  point: Array<string>;
  title: string;
  datas: Array<{ name: string, value: string }>
}

const windowItems = ({isShowWindow, windowClick, mapObject, windowParams}: any) => {
  return (
    <>
    {/* 探窗模块 */ isShowWindow ? (<MapWindow click={ windowClick } mapObject={ mapObject } params={ windowParams }></MapWindow>): null }
    </>
  )
}
const titleItems = ({isShowTitle, titleParams, titleClick, mapObject}: any) => {
  return (
    <>
    {
      isShowTitle && (titleParams.map((it: any, itIndex: number)=>{
        return (
        <MapTitle
          key={itIndex}
          click={ titleClick }
          mapObject={mapObject }
          params={ it }></MapTitle>
        )
        }))
    }
    </>
  )
}
let map: MapObject;

export function MapView(props: MapViewProps, ref?: any) {

  const [widthWidth] = useViewport();
  const zoom = widthWidth / 1920;

  const [mapObject, setMapObject] = useState<MapObject | null>(null)


  const dispatch = useDispatch();
  const [isShowWindow, setIsShowWindow] = useState<boolean>(false);
  const [windowParams, setWindowParams] = useState<windowParams>({point: ["",""], title: "", datas: [], render: () => { 
    // windowParams render
  }})
  
  const [isShowTitle, setIsShowTitle] = useState<boolean>(false);
  const [titleParams, setTitleParams] = useState<windowTitleParams[]>([])

  const [isShowCover, setIsShowCover] = useState<boolean>(false);
  const [coverParams, setCoverParams] = useState<windowTitleParams[]>([])

  // const [isShowTitles, setIsShowTitles] = useState<boolean>(false);
  // const [titleParamss, setTitleParamss] = useState<windowParams[]>([]);
  const reduxMapResource = useSelector(
    (state: any) => state.reduxMapResource
  );

  // 地图自定义组件集合
  const [pluginsArray, setPluginsArray]  = useState<Array<JSX.Element>>([]);

  // const [windowClickEvent, setWindowClickEvent] = useState<Event | null>();

  // const [titleClickEvent, setTitleClickEvent] = useState<Event | null>();

  // var windowClickEvent: Event;

  // var titleClickEvent: Event;

  const windowClickEvent = useMemo(()=> new Event(), []);

  const titleClickEvent = useMemo(()=> new Event(), []);
  
  const coverClickEvent = useMemo(()=> new Event(), []);

  // 创建订阅者
  const eventer = useMemo(()=> {

    const eventer = new Eventer("地图组件");

    eventer.$on("开放一个对外调用的接口", function(param: any){
      // 开放一个对外调用的接口
    });

    eventer.$on("获取地图对象", function(param: any){
      return window.mapView;
    });

    return eventer;

  }, []);

  useEffect (()=>{

    // 弹窗得点击事件

    // 地图实例化
    const mapObject = MapObject.create("mapObject", {
      center: ["109.69384052522959", "34.121834304894705"],
      zoom: 10,
    });
    window.mapView = mapObject;
    setMapObject(mapObject)
    // map = mapObject
    props.loadMap && props.loadMap(mapObject, { 
      showWindow, showTitle, hideWindow, hideTitle, getChinaPolygon, 
      showTitles,showTitlesAdd, hideTitles, showWindowDom, showCovers, hideCovers, addPlugin, removePlugin });

    return destroyed;
  }, []);

  useEffect(() => {
    if(props.provinceName && mapObject) {
      let timer = setTimeout(()=>{
        props.provinceName && getChinaPolygon(props.provinceName, props.mapLevel)
        // clearTimeout(timer)
      }, 100)
    }
  }, [props.provinceName, mapObject])

  useImperativeHandle(ref, () => ({ // 暴露给父组件的方法
    showWindow,
    showTitle,
    hideWindow,
    hideTitle,
    getChinaPolygon,
    showTitles,
    showTitlesAdd,
    hideTitles,
    showWindowDom,
    showCovers,
    hideCovers
  }))

  const getChinaPolygon = (provinceName: string, mapLevel: number = 1) => {
    mapObject?.getPolygonByName(provinceName).then((e: any) => {
      if(mapLevel === 1) {
        dispatch(setMapSelect({ ...reduxMapResource.mapSelect, areaCode: (`${e.code}`).padEnd(12, '0'), provinceName}));
      } else {
        dispatch(setMapSelect({ ...reduxMapResource.mapSelect, cityId: (`${e.code}`).padEnd(12, '0'), cityName: provinceName}));
      }
      let cent = null;
      if (e.name === "内蒙古") {
        cent = {
            center: { lng: 113.0260999162084, lat: 42.704361959138176 },
            zoom: 6
        }
      } else {
          var bounds = e.polygon.getBounds();
          cent = window.mapView.map.getViewport(bounds)
      }
      mapObject.mapLevel = mapLevel;
      mapObject?.centerAndZoom(cent.center.lng, cent.center.lat, cent.zoom)
    })
  }

  // 显示弹框
  const showWindow = function(point: Array<string>, title: string , datas: Array<{name: string, value: string}>, clickFn?: Function){
    // 传入显示参数
    setWindowParams({point, title, datas});
    // 打开弹框
    setIsShowWindow(true);
    // 如果存在click则绑定绑定
    clickFn && windowClickEvent?.on(clickFn);
  }

  // 显示弹框
  const showWindowDom = function(point: Array<string>, dom: any, clickFn?: Function){
    const title: string = "";
    const datas: Array<{name: string, value: string}> = [];
    // 传入显示参数
    setWindowParams({point, title, datas, dom});
    // 打开弹框
    setIsShowWindow(true);
    // 如果存在click则绑定绑定
    clickFn && windowClickEvent?.on(clickFn);
  }

  // 隐藏弹框
  const hideWindow = function(){
    setIsShowWindow(false);
    windowClickEvent?.off();
  }

  const showTitlesAdd = function(ary: any[], clickFn?: Function){
    // 如果以及显示了 先隐藏
    if( isShowTitle ){ hideTitle(); }
    // 传入显示参数
    setTitleParams(titleParams.concat(ary));
    // 打开弹框
    setIsShowTitle(true);
    // 如果存在click则绑定绑定
    clickFn && titleClickEvent?.on(clickFn);
  }

  // 显示名称
  const showTitles = function(ary: any[], clickFn?: Function){
    // 如果以及显示了 先隐藏
    if( isShowTitle ){ hideTitle(); }
    // 传入显示参数
    setTitleParams(ary);
    // 打开弹框
    setIsShowTitle(true);
    // 如果存在click则绑定绑定
    clickFn && titleClickEvent?.on(clickFn);
  }

  const hideTitles = function(){
    setIsShowTitle(false);
    titleClickEvent?.off();
  }

  // 显示名称
  const showTitle = function(point: Array<string>, title: string , datas: Array<{name: string, value: string}>, clickFn?: Function){
    // 如果以及显示了 先隐藏
    if( isShowTitle ){ hideTitle(); }
    setTitleParams([{point, title, datas}]);
    // 打开弹框
    setIsShowTitle(true);
    // 如果存在click则绑定绑定
    clickFn && titleClickEvent?.on(clickFn);
  }

  // 隐藏名字
  const hideTitle = function(){
    setIsShowTitle(false);
    titleClickEvent?.off();
  }

  // 显示名称
  const showCovers = function(ary: any[], clickFn: Function){
    // 如果以及显示了 先隐藏
    if( isShowCover ){ hideCovers(); }
    // 传入显示参数
    setCoverParams(ary);
    // 打开弹框
    setIsShowCover(true);
    // 如果存在click则绑定绑定
    clickFn && coverClickEvent?.on(clickFn);
  }

  const hideCovers = function(){
    setIsShowCover(false);
    coverClickEvent?.off();
  }

  // 弹窗点击事件
  const windowClick = function(...arg: Array<any>){
    windowClickEvent?.emit(...arg);
  }

  const titleClick = function(...arg: Array<any>){
    titleClickEvent?.emit(...arg);
  }

  const coverClick = function(...arg: Array<any>){
    coverClickEvent?.emit(...arg);
  }

  const addPlugin = function(plugin: JSX.Element | JSX.Element[] ){
    if( !(plugin instanceof Array) ){
      plugin = [plugin];
    }
    setPluginsArray(pluginsArray.concat(plugin)); //pluginsArray.push(...plugin);
  }

  const removePlugin = function(plugin: JSX.Element | string){
    setPluginsArray(pluginsArray.filter((e)=> e !== plugin && e.key !== plugin));
  }

  // 清除事件
  const destroyed = function(){
    window.mapView.map?.getOverlays().forEach((e: any)=>{ e.remove(); return window.mapView.map.removeOverlay(e) });
    window.mapView?.destroyed();
    eventer?.$off();
  }

  return (
    <div
      className={styles['container']}
      style={{
        height: '1080px',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#0a314f',
        zoom: 1 / (zoom),
        transform: "scale("+(zoom)+")", 
        transformOrigin: "0% 0%", 
        width: (1/(zoom)) * 100 + "%" 
      }}
    >
      <MapBox id='mapObject'></MapBox>
      {/* 探窗模块 */ isShowWindow ? (<MapWindow click={ windowClick } mapObject={ mapObject } params={ windowParams }></MapWindow>): null }
      {/* 标题组件 */ isShowTitle &&
      (titleParams.map((it, itIndex)=>{
        return (
        <MapTitle
          key={itIndex}
          click={ titleClick }
          mapObject={mapObject }
          params={ it }></MapTitle>
        )
        }))
      }
      { isShowCover && coverParams.map((it, itIndex)=>{
        return <MapCover key={ itIndex } click={ coverClick } mapObject={ mapObject } params={ it }></MapCover>
      }) }
      { pluginsArray.map((e: JSX.Element, i)=>{ return e; }) }
    </div>
  );
}

// 创建全局变量
declare global {
  interface Window {
      BMapGL: any,
      mapvgl: any,
      mapView: any,
      Eventer: any,
      Event: any,
      html2canvas: any,
  }
}


export default forwardRef(MapView);
