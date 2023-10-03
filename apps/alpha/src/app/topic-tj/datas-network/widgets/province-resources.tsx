// 资源总揽组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import css from '../datas-network.module.scss'
import { getDataNetWorkLeft } from '../../api/datasNetwork'
import { compareFun } from '../layer/function'
import {transformValue} from '../../utils/utils';
 interface ListDatas {
  resType?:string;
  counts?:number;
  protList?:Array<any>
}
export function ProvincialResources(props:any) {
  const [dataList, setDataList] = useState<any>({});
  const [currentItem, setCurrentItem] = useState<string>('left1');
  useEffect(() => {
    getDataNetWorkLeft({province : props.provinceId}).then((res:any) => {
      if(res.data){
        //左上角数据处理
        let newData:any = {}
        //城域网分类设备数数据排序处理
        let topDatas = res.data[2] && res.data[2].deviceList ? res.data[2].deviceList:null
        let compareArray = topDatas && topDatas.map((item:any)=>{
          let sortIndex = -1
          switch(item.resType){
            case 'CR':
              sortIndex = 1;
              break;
            case 'BRAS':
              sortIndex = 2;
              break;
            case 'SR':
              sortIndex = 3;
              break;
            case 'SW':
              sortIndex = 4;
              break;
            default:
          }
          return {
            ...item,
            sortIndex
          }
        })
        newData.top = compareArray && compareArray.length > 0?compareArray.sort(compareFun('sortIndex')):[]
        // IPRAN分类设备数数据排序处理
        let centerDatas = res.data[3] && res.data[3].deviceList ? res.data[3].deviceList:null
        let compareArrayCenter = centerDatas && centerDatas.map((item:any)=>{
          let sortIndex = -1
          switch(item.resType){
            case '核心层':
              sortIndex = 1;
              break;
            case '汇聚层':
              sortIndex = 2;
              break;
            case '接入层':
              sortIndex = 3;
              break;
            default:
          }
          return {
            ...item,
            sortIndex
          }
        })
        newData.center= compareArrayCenter && compareArrayCenter.length > 0?compareArrayCenter.sort(compareFun('sortIndex')):[]
        // I智能城域网分类设备数数据排序处理
        let fourArray:Array<any> = []
        let fourData = res.data[4] && res.data[4].deviceList ? res.data[4].deviceList:null
        let compareArrayBottom = fourData && fourData.map((item:any)=>{
          let sortIndex = -1
          switch(item.resType){
            case 'MCR':
              sortIndex = 1;
              break;
            case 'MER':
              sortIndex = 2;
              break;
            case 'MAR':
              sortIndex = 3;
              break;
            default: 
              sortIndex = -1;
          }
          return {
            ...item,
            sortIndex
          }
        })
        let resultDatas =compareArrayBottom && compareArrayBottom.length>0 ? compareArrayBottom.sort(compareFun('sortIndex')):[]
        newData.bottom = resultDatas.filter( (item:any) => item.sortIndex > 0)
        setDataList(newData)
        if(newData.top && newData.top[0].protList){
          props.setProResourceBottomHandle(newData.top[0].protList,'城域网',newData.top[0].resType)
        };
        
        //处理传入地图的数据
        let mapListDatas:Array<any> = []
        res.data[2] && res.data[2].mapList && mapListDatas.push({name:'城域网',mapList:res.data[2].mapList})
        res.data[3] && res.data[3].mapList && mapListDatas.push({name:'IPRAN',mapList:res.data[3].mapList})
        res.data[4] && res.data[4].mapList && mapListDatas.push({name:'智能城域网',mapList:res.data[4].mapList})
        mapListDatas && props.setResourceDataHandle(mapListDatas)
      }
    });
  }, []);
  const ChangeList = (pro:string, protList?:Array<any>,category?:string,name?:any)=>{
    setCurrentItem(pro)
    if(name){
      props.setProResourceBottomHandle(protList,category,name);
    }
  }
  return (
    <>
    <SectionTitle title="省份资源概览" style={{ width: '420px' }}></SectionTitle>
    { 
      dataList && 
      <div className={css['province-source-box']}>
        <h1 className={css['title']}>城域网分类设备数</h1> 
        <div className={`${css['main-cont']} ${css['main-cont01']}`}>
          {
            dataList.top && dataList.top.map((item:ListDatas,index:number)=>{
              return(
                <div className={`${css['content']} ${css[currentItem == `left${index + 1}` ? 'content-active':'']}`} key={index} onClick = {() => ChangeList(`left${index + 1}`, item.protList || [],'城域网',item.resType) }>
                  <div className={`${css['source-icon']} ${css[`source-icon-top${index + 1}`]}`} ></div>
                  <div className={css['list-item']}>
                    <span>{item.resType}</span>
                    <span>{transformValue(item.counts)}</span>
                    </div>
                </div>
              )
            })
          }
        </div>
        <h1>IPRAN分类设备数</h1>
        <div className={`${css['main-cont']}  ${css[currentItem.includes('center') ? 'main-add-top':'']}`}></div>
        <div className={css['main-cont']}>
        {
          dataList.center && dataList.center.map((item:ListDatas,index:number)=>{
            return(
              <div  className={`${css['content']} ${css[currentItem == `center${index + 1}` ? 'content-active':'']}`} key={index}  onClick = {() => ChangeList(`center${index + 1}`, item.protList || [],'IPRAN',item.resType)}>
                <div className={`${css['source-icon']} ${css[`source-icon-center${index + 1}`]}`} ></div>
                <div className={css['list-item']}>
                  <span>{item.resType}</span>
                  <span>{transformValue(item.counts)}</span>
                  </div>
              </div>
            )
          })
        }
        </div>
        <h1>智能城域网分类设备数</h1>
        <div className={`${css['main-cont']} ${css['main-cont03']} ${css[currentItem.includes('bottom') ? 'main-add-top':'']}`}>
        {
          dataList.bottom && dataList.bottom.map((item:ListDatas,index:number)=>{
            return(
              <div className={`${css['content']} ${css[currentItem == `bottom${index + 1}` ? 'content-active':'']}`}  key={index}  onClick = {() => ChangeList(`bottom${index + 1}`, item.protList || [],'智能城域网',item.resType)}>
                <div className={`${css['source-icon']} ${css[`source-icon-bottom${index + 1}`]}`} ></div>
                <div className={css['list-item']}>
                  <span>{item.resType}</span>
                  <span>{transformValue(item.counts)}</span>
                  </div>
              </div>
            )
          })
        }
        </div>
      </div>
     
    }
    
    </>
  );
}

export default ProvincialResources;
