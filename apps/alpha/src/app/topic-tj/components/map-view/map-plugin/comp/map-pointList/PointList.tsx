import styled from "styled-components"
import MapPlugin from "../../map-plugin"

export interface MapPointListProp {
    point: BMapGL.Point
    row: any[]
    nameProps: string
    onClick?: Function
}

const MapPointListDiv = styled.div`
    position: absolute;
    white-space: nowrap;
    width: 125px;
    height: auto;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(9,99,214,1);
    background: rgba(9,99,214,0.0);
    box-shadow: inset 0 4px 40px 0 rgba(9,99,214,0.6);
    // position: relative;

    .RoomDetailItem{
        height: 43px;
        line-height: 43px;
        padding: 0 10px;
        width: 100%;
        box-sizing: border-box;
        color: rgba(255,255,255,1);
        font-size: 16px;
        font-weight: 400;
        font-family: "Microsoft YaHei", sans-serif;
        text-align: left;
        border-bottom: 1px solid #0963D6;
        cursor: pointer;
        display: block;
        overflow: hidden;text-overflow:ellipsis;white-space: nowrap;
    }
`

export function MapPointList (props: MapPointListProp){


    return (<MapPlugin point={ props.point }>
            <MapPointListDiv>
                { props.row.map((row: any, i: any)=>{
                    return <div key={i} onClick={ ()=>{ props.onClick && props.onClick(row) } } className={'RoomDetailItem'} title={row.attr[props.nameProps]}>
                        <span> {row.attr[props.nameProps]} </span>
                    </div>
                }) }
            </MapPointListDiv>
        </MapPlugin>)
}