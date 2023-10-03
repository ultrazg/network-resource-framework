import './map-plugin.module.scss';
import styled from 'styled-components';
import { useEffect, useState, lazy, useMemo  } from 'react';
import { MapObject } from '../mapUtil/mapObject';
import { Event } from '../mapUtil/event';


const MapPluginBox = styled.div`
  position: absolute;
  top: 500px;
  left: 400px;
  z-index: 10;
  height: auto;
  transform: translate(-50%, -50%);
  // pointer-events: none;

  &:hover {
    z-index: 20;
  }
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
  children?: JSX.Element;
  // mapObject?: MapObject | null,
  point?: BMapGL.Point,
  params?: windowParams
}

export function MapPlugin(props: MapWindowProps) {

  const [position, setPosition] = useState<Array<string>>(["",""]);

  // const [mapObject, setMapObject] = useState<MapObject>()

  useEffect (()=>{

    // props.mapObject || ( window.mapView && setMapObject(window.mapView) );

    createMapChange();
    
    getPosition();

    return ()=>{
      // 清除监听
      clearMapChange()
    } 
  }, []);

  // useEffect(()=>{
  //   props.mapObject && setMapObject(props.mapObject);
  // }, [props.mapObject])

  // 监听地图变化
  const createMapChange = function(){
    // clearMapChange();
    const mapObject = window.mapView;
    mapObject?.map?.addEventListener("update",getPosition);
    
    // mapObject?.map?.addEventListener("moving",getPosition);
    // mapObject?.map?.addEventListener("zooming",getPosition);
  }

  // 清除地图变化事件
  const clearMapChange = function(){
    const mapObject = window.mapView;
    mapObject?.map?.removeEventListener("update",getPosition);
    // mapObject?.map?.removeEventListener("moving",getPosition);
    // mapObject?.map?.removeEventListener("zooming",getPosition);
  }

  // 计算屏幕坐标
  const getPosition = ()=>{
    const mapObject = window.mapView;
    if( !mapObject || !props.point ) return;
    // 根据点获取屏幕坐标
    const pot = mapObject?.map.pointToOverlayPixel(props.point);

    // 赋值
    setPosition([pot.x, pot.y]);
  }

  return (
    <MapPluginBox className={"mapPlugin"} style={ { left: position[0]+"px", top: position[1] + "px" } }>
      {props?.children}
    </MapPluginBox>
  );
}

export default MapPlugin;
