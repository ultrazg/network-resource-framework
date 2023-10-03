import './core-deviceTree.module.scss';
import { useEffect, useState  } from 'react';
import styled from 'styled-components';

import bg from "./images/bg.png"
import bg1 from "./images/bg1.png"
import bg2 from "./images/bg2.png"
import bg3 from "./images/bg3.png"
import bgBox from '../../../images/dialogNewBg.png';



const CoreDeviceTreeBoxParentDiv = styled.div`
  background: url(${bgBox});
  background-size: 100% 100%;
  // position: absolute;
  left: 50%;
  top: 50%;
  width: 600px;
  height: 400px;
  // transform: translate(-50%,-50%);
  padding: 20px;

  .backIcon {
    opacity: 1;
    color: rgba(0,212,255,1);
    font-size: 12px;
    font-weight: 400;
    // font-family: "Microsoft YaHei";
    text-align: center;
    position: absolute;
    padding-left: 10px;

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

      &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 100%;
        width: 2px;
        height: 53px;
        opacity: 1;
        background: linear-gradient(180deg, #2191FC00, #2191FC);
        border-radius: 50px 50px 0px 0px;
      }
    }

    div.active {
      color: rgba(255,255,255,1);

      &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 100%;
        width: 2;
        height: 53px;
        opacity: 1;
        background: linear-gradient(180deg, #ffffff00, #ffffff);
        border-radius: 50px 50px 0px 0px;
      }
    }
  }

  .right {
    width: calc(100% - 100px);
    height: 100%;

    .icon {
      width: 60px;
      height: 60px;
      background: url(${bg1});
      background-size: 100% 100%;
      margin: auto;
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
  margin-bottom: 20px;
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
  tabs: Array<{ name: string, value: string }>,
  treeDatas: Array<Tree>,
  index: string
}

export function CoreDeviceTreeBox(props: CoreDeviceTreeBoxProps) {

  // 当前选择的tabs
  const [index, setIndex] = useState("网元");

  // treeData
  // const [treeDatas, setTreeDatas] = useState<Array<Tree>>(CoreDeviceTreeBox_tabs.map((e: any)=> CoreDeviceTreeBox_treeDatas(e.name)));

  useEffect(()=>{
    setIndex(props.index);
  }, [props.index]);

  return (
    <CoreDeviceTreeBoxParentDiv >
      <div className='backIcon' onClick={ ()=>{ props.callBack && props.callBack() } }> 返回 </div>
      {/* modelVisible={true}
      handleCancel={()=>{}}
      width="600px"
      bodyStyle={{ height: 'auto' }} */}
      <Title>GD_FJ_FZ_ISSFUEWR_C_ZX</Title>
      <CoreDeviceTreeBoxDiv>
        {/* 左边的列表 */}
        <div className='left'>
          { props.tabs.map((e: any, i: any)=>{ return <div key={i} onClick={ ()=>{ setIndex(e.value) } } className={ index === e.value ? "active" : "" }>{ e.name }</div> }) }
        </div>
        {/* 右边的树状图 */}
        <div className='right'>
          <div className='icon'></div>

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
  // [propName: string]: any
}

export interface Tree {
  data: Array<TreeNode>
  name: string
}

const CoreDeviceTreeDiv = styled.div`
  height:calc(100% - 60px);
  width: 100%;
  overflow: auto;
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

  .treeModelRow {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 14px;
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

    .line {
      width: 100%;
      position: relative;

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
    width: 50%;
    margin: auto;
    display: flex;
    justify-content: space-between;

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
    .icon {
      width: 50px;
      height: 50px;
      background: url(${bg});
      background-size: 100% 100%;
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

  const getTree = function(level: number){
    const datas = props.datas;
    const map = [];
    for( var i = level; i == 0; i-- ){
      if( datas.child ){
        map.push(...datas.child);
      }
    }
  }

  return (
    <CoreDeviceTreeRowDiv>
      {/* 第三层 */}
    </CoreDeviceTreeRowDiv>
  );
}

export default CoreDeviceTreeBox;
