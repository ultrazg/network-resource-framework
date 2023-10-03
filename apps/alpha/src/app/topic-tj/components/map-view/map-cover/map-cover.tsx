import './map-cover.module.scss';
import styled from 'styled-components';
import { useEffect, useState, lazy, useMemo  } from 'react';
import { MapObject } from '../mapUtil/mapObject';
// import { threadId } from 'worker_threads';
// import bgPng from "./image/bg.png"
import { Event } from '../mapUtil/event';


const MapCoverBox = styled.div`
  position: absolute;
  top: 500px;
  left: 400px;
  z-index: 9999;
  height: auto;
  transform: translate(-50%, -50%);
  pointer-events: none;
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

export function MapWindow(props: MapWindowProps) {

  const [position, setPosition] = useState<Array<string>>(["",""]);

  const clickFn = useMemo(()=> new Event(), []);

  const point = useMemo(()=>{
    const point = props?.params?.point;
    if( point ){
      const center = window.mapView.map.getViewport(point.map((p: any)=>{
        return new BMapGL.Point( parseFloat(p[0]), parseFloat(p[1]) );
      }))
      return center.center;
    }
    return null;
  }, [props?.params?.point])

  const lastPoint = useMemo(()=>{
    const points = props?.params?.point;
    const map = window.mapView.map;
    if( points ){
      let max = 0;
      let p = null;
      points.forEach((a: any)=>{ 
        // return map.getDistance(new BMapGL.Point( parseFloat(a[0]), parseFloat(a[1]) ), point) < map.getDistance(new BMapGL.Point( parseFloat(b[0]), parseFloat(b[1]) ), point);
        const p1 = new BMapGL.Point( parseFloat(a[0]), parseFloat(a[1]) );
        const d = map.getDistance(p1, point);
        if( max > d ){ return; }
        max = d;
        p = p1;
      })
      // .map((e)=>{ return map.getDistance(new BMapGL.Point( parseFloat(e[0]), parseFloat(e[1]) ), point) })
      // points.sort((a,b)=>{ 
      //   return map.getDistance(new BMapGL.Point( parseFloat(a[0]), parseFloat(a[1]) ), point);
      // });
      return p;
    }
    return null;
  }, [props?.params?.point])

  useEffect (()=>{

    createMapChange();
    
    // getPoint();

    getPosition();

    return ()=>{
      // 清除监听
      clearMapChange()
    } 
  }, []);

  useEffect(()=>{
    // debugger;
    // getPoint();
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
    props.mapObject?.map?.removeEventListener("moving",getPosition);
    props.mapObject?.map?.removeEventListener("zooming",getPosition);
  }

  // // 获取需要对准得点对象
  // const getPoint = function(){ 
  //   const params = props.params
  //   if( params ){

  //     params.point.map((p: any)=> {
  //       // 传入变化得赋值
  //       point?.push(new BMapGL.Point(parseFloat(p[0]),parseFloat(p[1])));
  //     })
  //   }
  // }

  // 计算屏幕坐标
  const getPosition = ()=>{
    if( !props.mapObject || !point ) return;
    // 根据点获取屏幕坐标
    const pot = props.mapObject?.map.pointToOverlayPixel(point);

    // 判断宽度
    const lpot = props.mapObject?.map.pointToOverlayPixel(lastPoint);
    const w = Math.sqrt(Math.pow(pot.x - lpot.x, 2) + Math.pow(pot.y - lpot.y, 2)) * 1.2;

    // 赋值
    setPosition([pot.x, pot.y, w * 2, w * 2]);
  }

  // const windowClick = function(){
  //   clickFn?.emit({ type: "title" });
  // }

  return (
    <MapCoverBox className={"mapCover"} style={ {left: position[0]+"px", top: position[1] + "px", width: position[2]+"px", height: position[3] + "px"} }>
      { props?.params?.dom }
    </MapCoverBox>
  );
}

export default MapWindow;
