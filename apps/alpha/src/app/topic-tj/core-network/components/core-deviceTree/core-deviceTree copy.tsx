import './core-deviceTree.module.scss';
import { useEffect, useState, useMemo  } from 'react';
import styled from 'styled-components';

export interface CoreDeviceTreeBoxProps {
  
}

const CoreDeviceTreeBoxDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 500px;
  height: 400px;
  background: #ffffff;
  display: flex;
  transform: translate(-50%,-50%);

  .left {
    width: 100px;
    height: 100%;
    display: flex;
    color: #000000;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    flex-shrink: 0;
  }

  .right {
    width: 100%;
    height: 100%;
  }
`

export function CoreDeviceTreeBox(props: CoreDeviceTreeBoxProps) {

  return (
    <CoreDeviceTreeBoxDiv>
      {/* 左边的列表 */}
      <div className='left'>
        <div>网元</div>
        <div>虚拟机</div>
        <div>物理机</div>
        <div>机架</div>
      </div>
      {/* 右边的树状图 */}
      <div className='right'>
        <CoreDeviceTree></CoreDeviceTree>
      </div>
    </CoreDeviceTreeBoxDiv>
  );
}

/* eslint-disable-next-line */
export interface CoreDeviceTreeProps {

}

// var point: any = null;

interface TreeNode {
  name: string,
  icon: string,
  child?: Array<TreeNode>
}

interface Tree {
  data: Array<TreeNode>
}

const CoreDeviceTreeDiv = styled.div`
  height:100%;
  width: 100%;


`

export function CoreDeviceTree(props: CoreDeviceTreeProps) {

  // 树状图渲染列表
  const [treeData, setTreeData] = useState<Tree|null>({
    data: [{
      name: "第一级",
      icon: "",
      child: [{
        name: "第二级1",
        icon: "",
        child: [{
          name: "第三级1",
          icon: "",
          child: []
        },{
          name: "第三级2",
          icon: "",
          child: []
        },{
          name: "第三级3",
          icon: "",
          child: []
        }]
      },{
        name: "第二级2",
        icon: "",
        child: [{
          name: "第三级4",
          icon: "",
          child: []
        },{
          name: "第三级5",
          icon: "",
          child: []
        }]
      }]
    }]
  });

  return (
    <CoreDeviceTreeDiv>
      { treeData && <CoreDeviceTreeRow datas={treeData.data}></CoreDeviceTreeRow> }
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
    justify-content: space-around;
    align-items: center;
  }

  .treeModelChildRowSpace {
    border: solid 1px #000000;
  }

  .treeModel {
    width: 50px;
    height: 50px;
    color: #000000;
    border: solid 1px;
  }
`

interface CoreDeviceTreeRowProps {
  datas: Array<TreeNode>
  parentNode?: TreeNode
}

export function CoreDeviceTreeRow(props: CoreDeviceTreeRowProps) {

  return (
    <CoreDeviceTreeRowDiv>
      {/* { props.parentNode && <div className='treeModelChildRowSpace'></div>} */}
      <div className='treeModelRow'>
        { props.datas && props.datas.map((e)=>{
          return <div className='treeModel'> { e.name } </div>
        }) }
      </div>
      <div className='treeModelChildRow'>
        { props.datas.length > 0 && props.datas.map((e)=>{
          return e.child ? <CoreDeviceTreeRow datas={e.child} parentNode={e}></CoreDeviceTreeRow> : ""
        }) }
      </div>
    </CoreDeviceTreeRowDiv>
  );
}

export default CoreDeviceTreeBox;
