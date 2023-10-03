import './core-deviceTree.module.scss';
import { useEffect, useState  } from 'react';
import styled from 'styled-components';

import bg from "./images/bg.png"
import bg1 from "./images/bg1.png"
import bg2 from "./images/bg2.png"
import bg3 from "./images/bg3.png"
import bgBox from '../../../images/dialogNewBg.png';
import { FullScreenQuad } from 'three-stdlib';



const CoreDeviceTreeBoxParentDiv = styled.div`
  background: url(${bgBox});
  background-size: 100% 100%;
  // position: absolute;
  left: 50%;
  top: 50%;
  width: 600px;
  // height: 400px;
  // height: 265px;
  height: 295px;
  // transform: translate(-50%,-50%);
  padding: 20px 20px 0px;
  margin-top: 20px;

  .backIcon {
    opacity: 1;
    color: rgba(0,212,255,1);
    font-size: 12px;
    font-weight: 400;
    // font-family: "Microsoft YaHei";
    text-align: center;
    position: absolute;
    padding-left: 10px;
    cursor: pointer;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(-50%, -50%) rotateZ(-45deg);
      border-top: solid 1px rgba(0,212,255,1);
      border-left: solid 1px rgba(0,212,255,1);
      padding: 3px;
    }
    &::after {
      content: "";
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translate(-50%, -50%) rotateZ(-45deg);
      border-top: solid 1px rgba(0,212,255,1);
      border-left: solid 1px rgba(0,212,255,1);
      padding: 3px;
    }
  }

  .fullIcon {
    opacity: 1;
    color: rgba(0,212,255,1);
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    position: absolute;
    padding-left: 10px;
    right: 15px;
    cursor: pointer;
  }
`

const CoreDeviceTreeBoxDiv = styled.div`
  // position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: calc(100% - 25px);
  
  // background: #ffffff;
  display: flex;
  color: #ffffff;
  // transform: translate(-50%,-50%);
  overflow: hidden;

  .left {
    width: 100px;
    // height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    flex-shrink: 0;

    div:last-child {
      &::before {
        display: none;
      }
    }

    div {
      color: #2191FC;
      font-size: 16px;
      font-weight: 700;
      font-family: "Microsoft YaHei";
      text-align: left;
      position: relative;
      cursor: pointer;
      height: 25%;
      display: flex;
      align-items: center;

      &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: calc(50% + 20px);
        width: 2px;
        // height: 53px;
        height: 32px;
        opacity: 1;
        background: linear-gradient(180deg, #2191FC00, #2191FC);
        border-radius: 50px 50px 0px 0px;
      }
    }

    div.active {
      color: rgba(255,255,255,1);

      &::before {
        // content: "";
        // position: absolute;
        // left: 50%;
        // top: calc(50% + 20px);
        // width: 2;
        // height: 53px;
        // opacity: 1;
        background: linear-gradient(180deg, #ffffff00, #ffffff);
        // border-radius: 50px 50px 0px 0px;
      }
    }
  }

  .right {
    width: calc(100% - 100px);
    height: 100%;

    .right_icon {
      height: 25%;
      display: flex;
      align-items: center;

      >.icon {
        width: 60px;
        height: 60px;
        background: url(${bg1});
        background-size: 100% 100%;
        margin: auto;
      }
    }

  }
`;

const Title = styled.div`
  color: rgba(255,255,255,1);
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  width: calc(100% - 100px);
  margin-left: 100px;
  // margin-bottom: 20px;
`

const CoreDeviceTreeBox_tabs = [
  { name: "网元", value: "网元" },{ name: "虚拟机", value: "虚拟机" },{ name: "物理机", value: "物理机" },{ name: "机架", value: "机架" }
];

const CoreDeviceTreeBox_treeDatas = function(name: string){
  return {
    name: name,
    data: [{
      name: name + "第一级",
      icon: bg2,
      child: [{
        name: "第二级1",
        icon: bg3,
        child: [{
          name: "第三级1",
          icon: bg,
          child: []
        },{
          name: "第三级2",
          icon: bg,
          child: []
        },{
          name: "第三级3",
          icon: bg,
          child: []
        }]
      },{
        name: "第二级2",
        icon: bg3,
        child: [{
          name: "第三级4",
          icon: bg,
          child: []
        },{
          name: "第三级5",
          icon: bg,
          child: []
        }]
      }]
    }]
  }
}

export interface CoreDeviceTreeBoxProps {
  treeClick?: Function,
  callBack?: Function,
  title: string,
  rackName: string,
  fullBack?: Function,
  tabs: Array<{ name: string, value: string }>,
  treeDatas: Array<Tree>,
  index: string
}

export function CoreDeviceTreeBox(props: CoreDeviceTreeBoxProps) {

  // 当前选择的tabs
  const [index, setIndex] = useState("网元");

  // treeData
  // const [treeDatas, setTreeDatas] = useState<Array<Tree>>(CoreDeviceTreeBox_tabs.map((e: any)=> CoreDeviceTreeBox_treeDatas(e.name)));

  // useEffect(()=>{
    // setIndex(props.index);
  // }, [props.index]);

  return (
    <CoreDeviceTreeBoxParentDiv >
      <div className='backIcon' onClick={ ()=>{ props.callBack && props.callBack() } }> 返回 </div>
      {/* <div className='fullIcon' onClick={ ()=>{ props.fullBack && props.fullBack() } }> 全图 </div> */}
      {/* modelVisible={true}
      handleCancel={()=>{}}
      width="600px"
      bodyStyle={{ height: 'auto' }} */}
      {/* <Title>{ props.title }</Title> */}
      <Title>{ props.title }</Title>
      <CoreDeviceTreeBoxDiv>
        {/* 左边的列表 */}
        <div className='left'>
          { props.tabs.map((e: any, i: any)=>{ return <div key={i} onClick={ ()=>{  } } className={ index === e.value ? "active" : "" }>{ e.name }</div> }) }
        </div>
        {/* 右边的树状图 */}
        <div className='right'>
          <div className='right_icon'>
            <div className='icon'></div>
          </div>

          <CoreDeviceTree treeData={ props.treeDatas[0] /*props.treeDatas.find((e)=>{ return e.name === index })*/ } treeClick={ props.treeClick }></CoreDeviceTree>
        </div>
      </CoreDeviceTreeBoxDiv>
    </CoreDeviceTreeBoxParentDiv>
  );
}

/* eslint-disable-next-line */
export interface CoreDeviceTreeProps {
  treeData: Tree | undefined,
  treeClick?: Function
}

// var point: any = null;

interface TreeNode {
  name: string,
  icon: string,
  child: Array<TreeNode>
  attr?: any,
  __type?: Boolean
  // [propName: string]: any
}

export interface Tree {
  data: Array<TreeNode>
  name: string
}

const CoreDeviceTreeDiv = styled.div`
  height:calc(100% - 25%);
  width: 100%;
`

export function CoreDeviceTree(props: CoreDeviceTreeProps) {

  // 树状图渲染列表
  // const [treeData, setTreeData] = useState<Tree|undefined>();

  return (
    <CoreDeviceTreeDiv>
      { props.treeData && <CoreDeviceTreeRow datas={props.treeData.data[0]} treeClick={ props.treeClick }></CoreDeviceTreeRow> }
    </CoreDeviceTreeDiv>
  );
}

const CoreDeviceTreeRowDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  /* 滚动槽 */
  &::-webkit-scrollbar-track {
    border-radius: 4px;
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #5d97bd;
  }
  &::-webkit-scrollbar-thumb:window-inactive {
    background: #5d97bd;
  }

  .treeModelRow {
    display: flex;
    justify-content: left;
    align-items: center;
    // padding: 14px;
    height: 33%;
    position: relative;

    .name {
      width: 40px;
      white-space: nowrap;
      margin: auto;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .treeModelChildRow {
    display: flex;
    // justify-content: space-around;
    justify-content: left;
    align-items: center;

    > div {

      > .treeModelChildRowSpaceLine .line:last-child, .treeModelChildRowSpaceLine .line:first-child  {
        &::before {
          // background: #ff0000;
          display:none;
        }
      }

    }

  }

  .treeModelChildRowSpaceLine {
    display: flex;
    justify-content: space-between;

    &.last {
      .line {
        &::before {
          // top: 10px;
          top: 3px;
        }
      }
    }

    .line {
      width: 100%;
      position: relative;

      &.none {
        // display: none;
        opacity: 0;
      }

      &::before {
        content: "";
        left: 50%;
        position: absolute;
        transform: translateX(-50%);
        height: 10px;
        width: 1px;
        background: #00D4FF;
        top: 0px;
      }

      // &:last-child, &:first-child  {
      //   &::before {
      //     display:none;
      //   }
      // }
    }
  }

  .treeModelChildRowSpace {
    // border-bottom: solid 1px #00D4FF;
    // height: 10px;
    // border-radius: 10px;
    width: calc(100% - 50px);
    min-width: 25px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    // justify-content: left;
    transform: translateY(0px);

    .treeModelChildRowSpaceLeft {
      border-bottom: solid 1px #00D4FF;
      border-left: solid 1px #00D4FF;
      height: 10px;
      border-radius: 0px 0px 0px 8px;
      width: calc(50% - 5px);
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: 100%;
        top: 100%;
        width: 5px;
        height: 10px;
        border-radius: 0px 8px 0px 0px;
        border-top: solid 1px #00D4FF;
      }
    }

    .treeModelChildRowSpaceRight {
      border-bottom: solid 1px #00D4FF;
      border-right: solid 1px #00D4FF;
      height: 10px;
      border-radius: 0px 0px 8px 0px;
      width: calc(50% - 5px);
      position: relative;

      &::before {
        content: "";
        position: absolute;
        right: 100%;
        top: 100%;
        width: 5px;
        height: 10px;
        border-radius: 8px 0px 0px 0px;
        border-top: solid 1px #00D4FF;
      }
    }
  }

  .treeModel {
    color: #00D4FF;
    text-align: center;
    font-size: 12px;
    flex-shrink: 0;
    width: 50px;
    .icon {
      width: 32px;
      height: 32px;
      background: url(${bg});
      background-size: 100% 100%;
      margin: auto;
    }
  }
`

interface CoreDeviceTreeRowProps {
  datas: TreeNode
  parentNode?: TreeNode,
  getCenter?: Function
  treeClick?: Function
}

function executeRequestElsewhere2(caller: any) {
  caller.print()
}

export function CoreDeviceTreeRow(props: CoreDeviceTreeRowProps) {

  const [el, setEl] = useState<Element | null>(null);

  const getTree = function(level: number){
    if( level == -1 ) return [props.datas];
    let datas: TreeNode[] = props.datas.child.map((e, i, list)=>{ let a = { ...e, __type: !!( i == 0 || i == list.length - 1 )};  return a; });
    // let ref: TreeNode[] = [];
    for( var i = level; i > 0; i-- ){
      let ary: TreeNode[] = [];
      datas.forEach((e: TreeNode)=>{ 
        return ary.push(...e.child.map((e, i, list)=>{ let a = { ...e, __type: !!( i == 0 || i == list.length - 1 )};  return a; }));
      });
      datas = ary;
    }
    return datas;
  }

  const getWidth = function(){
    const count = getTree(1);
    const width = count.length * 50;

    // 获取第二层数据
    const count2 = getTree(0);
    const fi = count2[0].child.length;
    const li = count2[count2.length - 1].child.length;

    return width - fi * 50 / 2 - li * 50 / 2  + "px";
  }

  const getMargin = function(){
    // 获取第二层数据
    const count2 = getTree(0);
    const fi = count2[0].child.length;

    return fi * 50 / 2 + "px";
  }

  // const wheel = function(event: any){
  //   console.log(event.deltaY);
  //   // el?.scrollTop && ( el.scrollLeft += event.deltaY );

  //   el && ( el.scrollTo( el.scrollTop + event.deltaY, 0 ) );
  // }

  return (
    <CoreDeviceTreeRowDiv ref={ (el)=>{ setEl(el) } } >
      {/* 第三层 */}
      <div className='treeModelRow'>
        { getTree(1).map((e: TreeNode, i)=>{ return <div key={ i } className='treeModel' onClick={ ()=> props.treeClick && props.treeClick(props.datas) }>
          { props.datas.icon ? 
            <div className='icon' title={e.name} style={ { backgroundImage: `url(${e.icon})`, backgroundSize: "100% 100%" } }></div> :  
            <div className='icon' title={e.name}></div>}
          <div className='name'>{ e.name }</div> 

          {/* <div className='treeModelChildRowSpaceLine'><div className={"line " + (e.__type ? "none" : "")}></div></div>  */}
        </div> }) }
      </div>
      
      <div className='treeModelRow'>
        <div className='' style={ { display: "flex", position: "absolute", top: "2px" } }>
          { getTree(1).map((e: TreeNode, i)=>{ 
            return <div key={ i } style={{width: "50px"}} className='treeModelChildRowSpaceLine'><div className={"line " + (e.__type ? "none" : "")}></div></div> 
          })}
        </div>
        { getTree(0).map((e: TreeNode, index: number, list: TreeNode[])=>{ return <div key={ index } style={ { width: 50 * e.child.length + "px" } } className='treeModel' onClick={ ()=> props.treeClick && props.treeClick(props.datas) }>
          { e.child.length > 0 ? 
            <div className='treeModelChildRowSpace'>
              <div className='treeModelChildRowSpaceLeft'></div>
              <div className='treeModelChildRowSpaceRight'></div>
            </div> : ""
          }
          { e.icon ? 
            <div className='icon' title={e.name} style={ { backgroundImage: `url(${e.icon})`, backgroundSize: "100% 100%" } }></div> :  
            <div className='icon' title={e.name}></div>}
          <div className='name'>{ e.name }</div> 
          {/* { e.child.length > 0 ? 
            <div className='treeModelChildRowSpaceLine'><div className={"line " + (index == 0 || index == list.length - 1 ? "none" : "")}></div></div> : ""
          } */}
            <div className='treeModelChildRowSpaceLine last'><div className={"line " + (e.__type ? "none" : "")}></div></div> 
        </div> }) 
        }
      </div>

      <div className='treeModelRow'>
        { getTree(-1).map((e: TreeNode, i)=>{ return <div key={i} style={ { width: getWidth(), marginLeft: getMargin() } } className='treeModel' onClick={ ()=> props.treeClick && props.treeClick(props.datas) }>
          { e.child.length > 0 ? 
            <div className='treeModelChildRowSpace'>
              <div className='treeModelChildRowSpaceLeft'></div>
              <div className='treeModelChildRowSpaceRight'></div>
            </div> : ""
          }
          { e.icon ? 
            <div className='icon' title={e.name} style={ { backgroundImage: `url(${e.icon})`, backgroundSize: "100% 100%" } }></div> :  
            <div className='icon' title={e.name}></div>}
          <div className='name'>{ e.name }</div> 
        </div> }) }
      </div>
    </CoreDeviceTreeRowDiv>
  );
}

export default CoreDeviceTreeBox;
