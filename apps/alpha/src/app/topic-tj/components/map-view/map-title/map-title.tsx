import './map-title.module.scss';
import styled from 'styled-components';
import { useEffect, useState, useMemo  } from 'react';
import { MapObject } from '../mapUtil/mapObject';
import { Event } from '../mapUtil/event';

const MapTitleBox = styled.div`
  position: absolute;
  top: 500px;
  left: 400px;
  // background: #1c2e4a;
  // padding: 12px;
  border-radius: 4px;
  z-index: 9999;
  transform: translate(-50%,calc(-50% - 65px));

  position: absolute;
  left: 50%;
  // bottom: calc(100% + 2px);
  // padding: 4px;
  border-radius: 0;
  font-size: 12px;
  font-family: PingFangSC,PingFangSC-Semibold,sans-serif;
  font-weight: 600;
  text-align: left;
  color: #fff;
  pointer-events: none;
  

  .window-title {
    padding: 7px;
    background: #071B3B;
    border: 2px solid #004796;
    border-radius: 2px;
    height: max-content;
    font-family: PingFangSC-Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
  }
`

interface windowParams {
  point: Array<string>,
  title: string,
  datas: Array<{ name: string, value: string }>,
  dom?: any
}

/* eslint-disable-next-line */
export interface MapWindowProps {
  mapObject?: MapObject | null;
  params: windowParams;
  click?: Function;
}

// var point: any = null;
export function MapWindow(props: MapWindowProps) {

  // const [mapObject, setMapObject] = useState<MapObject | null>(null);

  const [params, setParams] = useState<windowParams | null>(null);

  const [position, setPosition] = useState<Array<string>>(["",""]);

  // const [point, setPoint] = useState<any>(null);
  const point = useMemo(()=>{
    if( props.params.point ){
       return new BMapGL.Point(parseFloat(props.params.point[0]),parseFloat(props.params.point[1]))
    }
    return null 
  }, [props.params.point])
  let timer: any = null;
  useEffect(()=>{
    // console.log('props.params.point', props.params.point)
    timer = setTimeout(() => getPosition(), 100)
  }, [props.params.point])




  // const [clickFn, setClickFn] = useState<Event | null>( null );

  const clickFn = useMemo(()=> new Event(), []);

  // const point = useMemo(()=> )

  useEffect (()=>{

    createMapChange();
    
    getPoint();

    getPosition();

    return ()=>{
      // 清除监听
      clearMapChange()
      clearTimeout(timer)
    } 
  }, []);

  useEffect(()=>{
    // 
    setParams(props.params || null);
    getPoint();
  },[props.params])

  useEffect(()=>{
    clickFn?.off();
    props.click && clickFn?.on(props.click);
  },[props.click])

  // 监听地图变化
  const createMapChange = function(){
    // clearMapChange();
    props.mapObject?.map?.addEventListener("moving",getPosition);
    props.mapObject?.map?.addEventListener("zooming",getPosition);
  }

  // 清除地图变化事件
  const clearMapChange = function(){
    props.mapObject?.map?.off("moving",getPosition);
    props.mapObject?.map?.off("zooming",getPosition);
  }

  // 获取需要对准得点对象
  const getPoint = function(){ 
    const params = props.params
    if( params ){
      // 传入变化得赋值
      // setPoint(new BMapGL.Point(parseFloat(params.point[0]),parseFloat(params.point[1])));
    }
  }

  // 计算屏幕坐标
  const getPosition = ()=>{
    // console.log('point', point)
    if( !props.mapObject || !point ) return;
    // 根据点获取屏幕坐标
    const pot = props.mapObject?.map?.pointToOverlayPixel(point);
    // 赋值
    const newPot = [pot.x, pot.y]
    setPosition(prePot => ([...newPot]));
    // console.log('position', position, newPot)
  }
  useEffect(() => {
    // console.log('position-eff', position)
  }, [position])
  return (
    <MapTitleBox onClick={ ()=>{clickFn?.emit({ type: "title" , params: props.params })} } style={ {left: position[0]+"px", top: position[1] + "px"} }>
      {/* {position} */}
      { params?.dom || <div className='window-title'> { params?.title } </div> }
    </MapTitleBox>
  );
}

// 创建全局变量
declare global {
  interface Window {
      BMapGL: any,
      mapvgl: any
  }
}


export default MapWindow;
