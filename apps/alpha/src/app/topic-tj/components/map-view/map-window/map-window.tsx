import './map-window.module.scss';
import styled from 'styled-components';
import { useEffect, useState, useMemo, useCallback, useRef  } from 'react';
import { MapObject } from '../mapUtil/mapObject';
import { useViewport } from "@alpha/app/context/viewport-context";
import bgPng from "./image/bg.png"
import { Event } from '../mapUtil/event';


const MapWindowBox = styled.div`
  position: absolute;
  top: 500px;
  left: 400px;
  background: #1c2e4a;
  padding: 25px;
  border-radius: 4px;
  z-index: 19999;
  background: url(${bgPng});
  background-size: 100% 100%;
  height: auto;
`

const MapWindowTitle = styled.div`
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC,PingFangSC-Semibold,sans-serif;
  font-weight: 600;
  text-align: left;
  color: #00feff;
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
  cursor: pointer;
`

export interface windowParams {
  point: Array<string>,
  title: string,
  datas?: Array<{ name: string, value: string }>,
  dom?: any,
  render?: () => void
}

/* eslint-disable-next-line */
export interface MapWindowProps {
  mapObject?: MapObject | null,
  params?: windowParams
  click?: Function
}

var point: any = null;

export function MapWindow(props: MapWindowProps) {
  const [windowWidth, windowHeight] = useViewport();

  // const [mapObject, setMapObject] = useState<MapObject | null>(null);

  const [params, setParams] = useState<windowParams | null>(null);

  const [position, setPosition] = useState<Array<string>>(["",""]);
  const [refLoad, setRefLoad] = useState<boolean>(false);

  // const [clickFn, setClickFn] = useState<Event | null>( null );

  const clickFn = useMemo(()=> new Event(), []);

  useEffect (()=>{

    // const clickFn = new Event();

    // setClickFn(clickFn);

    const getPosition_ = function(){
      getPosition();
    }

    createMapChange(getPosition_);
    
    getPoint();

    // getPosition();

    return ()=>{
      // 清除监听
      clearMapChange(getPosition_)
    } 
  }, []);

  useEffect(()=>{
    clickFn?.off();
    props.click && clickFn?.on(props.click);
  },[props.click])


  useEffect(()=>{
    setParams(props.params || null);
    getPoint();
  },[props.params])

  // 监听地图变化
  const createMapChange = function(fn: Function){
    // clearMapChange();
    props.mapObject?.map?.addEventListener("moving",fn);
    props.mapObject?.map?.addEventListener("zooming",fn);
  }

  // 清除地图变化事件
  const clearMapChange = function(fn: Function){
    props.mapObject?.map?.removeEventListener("moving",fn);
    props.mapObject?.map?.removeEventListener("zooming",fn);
  }

  // 获取需要对准得点对象
  const getPoint = function(){ 
    const params = props.params
    if( params ){
      // 传入变化得赋值
      point = new BMapGL.Point(parseFloat(params.point[0]),parseFloat(params.point[1]));
    }
  }
  const windowRef = useRef()
  const mapWindowRef = useCallback((ref) => {
    if (ref !== null) {
      windowRef.current = ref;
      setRefLoad(true)
    }
  }, []);
  useEffect(() => {
    getPosition()
  }, [refLoad])
  // 计算屏幕坐标
  const getPosition = ()=>{
    if( !props.mapObject || !point ) return;
    // 根据点获取屏幕坐标
    const pot = props.mapObject?.map.pointToOverlayPixel(point);
    // 赋值
    const { potx, poty } = getDynamicPot(pot);
    setPosition([potx, poty]); 
  }

  const getDynamicPot = (pot: any) => {
    const clientHeight = (windowRef.current as any).clientHeight;
    const clientWidth = (windowRef.current as any).clientWidth;
    let potx = (clientWidth + pot.x) > 1920 ? pot.x - clientWidth : pot.x;
    let poty = (clientHeight + pot.y) > 1080 ? pot.y - clientHeight : pot.y;
    return {
      potx,
      poty
    }
  }

  // const windowClick = function(){
  //   clickFn?.emit({ type: "title" });
  // }

  return (
    <MapWindowBox className='windowBox' ref={mapWindowRef} style={ {left: position[0]+"px", top: position[1] + "px"} }>
      { params?.dom }
      { props?.params?.title && <MapWindowTitle onClick={ ()=>{clickFn?.emit({ type: "title" })} }> {props?.params?.title || '承载设备所属环名称：重庆-重庆-汇聚环中'} </MapWindowTitle>}
      <div className='window-model'>  
        {/* <div>当前屏幕坐标: { position[0] + "-" + position[1] }</div>
        {
          params ? <div>当前绑定点坐标: { params?.point[0] + "-" + params?.point[1] }</div> : null
        } */}
        { params?.datas?.map((item)=>{
          return (<div onClick={ ()=> clickFn?.emit({ type: "datas" , datas: item }) } key={item.name}>{ item.name }: { item.value }</div>)
        }) }
      </div>
    </MapWindowBox>
  );
}

export default MapWindow;
