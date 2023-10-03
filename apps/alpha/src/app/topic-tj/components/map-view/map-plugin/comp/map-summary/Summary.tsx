import { propertiesContainsFilter } from "@turf/turf"
import { useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import MapPlugin from "../../map-plugin"

const MapPluginDiv = styled.div`
    position: relative;
    // background: #ffffff;
    // border: solid 1px #000000;
    // padding: 8px;
    background: url("./assets/transmission-label.svg") left center no-repeat;
    min-width: 228px;
    height: 27px;
    text-indent: 1em;

    .titleNum {
        margin-left: 2em;
        font-size: 12;
    }

    &:hover .modelBox {
        display: block;
    }

    &.hover .modelBox {
        display: block;
    }

    .modelBox {
        left: 0px;
        top: 100%;
        position: absolute;
        // width: auto;
        // width: 228px;
        width: 100%;
        // height: 233px;
        border: 1px solid rgba(5,102,242,1);
        background: rgba(0,12,50,0.7);
        box-shadow: inset 0 0 40px 0 rgb(0 147 255 / 40%);
        padding: 8px 18px 3px;
        line-height: 18px;
        font-size: 14px;
        color: #fff;
        box-sizing: border-box;
        display: none;

        .modelBoxTitle {
            color: #00FCFF;
            font-size: 14px;
            text-indent: 0em;
            padding: 5px 0px;
        }

        .item {
            // width: 270px;
            display: flex;
            -webkit-box-pack: justify;
            justify-content: space-between;
            padding-left: 24px;
            margin-bottom: 6px;
            box-sizing: border-box;
            background: url(./assets/tooltips-item.svg) left center no-repeat;
            line-height: 18px;
            font-size: 14px;
            color: #fff;

            .key {

            }

            .value {
                color: #00FCFF;
            }
        }
    }
`

interface MapSummaryProps {
    point: BMapGL.Point
    title: string
    datas: Array<{name: string, value: string}>
    onClick?: Function
    titleNum?: number
    isHover?: boolean
    [propName: string]: any
}

export const MapSummary = function (props: MapSummaryProps){

    return (<MapPlugin point={ props.point }>
        <MapPluginDiv className={ props.isHover? "hover" : "" }>
            <div onClick={ ()=> { props.onClick && props.onClick(props) } }> 
                {props.title} 
                <span className="titleNum">{ props.titleNum || 0 }</span>
            </div>

            <div className='modelBox'>
                {/* <div className="modelBoxTitle">弹出框内容</div> */}
                {
                    props.datas.map((e: any, i)=>{
                        return (<div key={i} className="item" onClick={ ()=> { props.onClick && props.onClick(props, e) } }>
                            <div className='key'>{ e.name }</div>
                            <div className='value'>{ e.value }</div>
                        </div>)
                    })
                }
            </div>
        </MapPluginDiv>
    </MapPlugin>)

}

interface MapSummaryArrayProps {
    datas: Array<MapSummaryProps>
    onClick?: Function
}

let key: any = null;

export const MapSummaryArray = function(props: MapSummaryArrayProps){

    const [i, setI] = useState<number>(0);

    useEffect(()=>{
        console.log("计时器---------------------")
        key = setTimeout(()=>{
            if( i >= props.datas.length ){
                setI(0);
            }else{
                setI(i+1);
            }
        }, 1000)
    },[i])

    useEffect(()=>{
        // 创建一个定时器轮播
        // var key = setInterval(()=>{
        if( i+1 >= props.datas.length ){
            setI(0);
        }else{
            setI(i+1);
        }
        // },5000);

        return function(){
            clearTimeout(key);
            // setI({ index: -1, key: "" });
        }
    },[])

    return <div>
        {props.datas.map((e: MapSummaryProps, ai: any)=> <MapSummary isHover={ai == i} attr={e} titleNum={ e.titleNum } onClick={ props.onClick } point={ e.point } title={e.title} datas={e.datas}></MapSummary> )}
    </div>

}