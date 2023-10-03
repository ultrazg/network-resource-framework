// 全国数据质量组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import css from '../datas-network.module.scss'
import { resourceQualityDetails } from '../../api/datasNetwork'
import { compareFun } from '../layer/function'
 interface ListDatas {
 name?:string;
 value?:string;
 type?:string
}

export function DataQuality() {
  const [dataList, setDataList] = useState<Array<any>>([]);
  const [currentItem, setCurrentItem] = useState<string>('left1');
  const listObj = [{
      title:'城域网采集',
      subTitle:'数据完整性',
      value:30
  },{
    title:'IPRAN采集',
    subTitle:'数据完整性',
    value:10
  },{
    title:'UTN中继',
    subTitle:'电路完整性',
    value:40
  },{
    title:'城域网采集',
    subTitle:'数据准确性',
    value:80
  },{
    title:'IPRAN采集',
    subTitle:'数据准确性',
    value:60
  }]
  useEffect(() => {
    resourceQualityDetails({}).then((res:any) => {
      let newArray = []
      if(res.code == 200 && res.data && res.data.length > 0){
          newArray = res.data.map((item:any)=>{
            let sortIndex = -1, title = '', subTitle ='';
            switch(item.indicatorName){
              case '城域网采集数据完整率':
                sortIndex = 1;
                title = '城域网采集';
                subTitle = '数据完整率';
                break;
              case 'IPRAN采集数据完整性':
                sortIndex = 2;
                title = 'IPRAN采集';
                subTitle = '数据完整率';
                break;
              case 'UTN中继电路完整性':
                sortIndex = 3;
                title = 'UTN中继';
                subTitle = '电路完整率';
                break;
              case '城域网采集数据准确率':
                sortIndex = 4;
                title = '城域网采集';
                subTitle = '数据准确率';
                break;
              case 'IPRAN采集数据准确率':
                sortIndex = 5;
                title = 'IPRAN采集';
                subTitle = '数据准确率'
                break;
              default:
            }
            return {
              ...item,
              sortIndex,
              title,
              subTitle
            }
        })
      }   
      let compareArray  = newArray && newArray.length > 0 ?newArray.sort(compareFun('sortIndex')):[]
      let lastArray = compareArray.filter( (item:any) => item.sortIndex > 0)
      setDataList(lastArray)
    });

  }, []);
  return (
    <>
    <SectionTitle title="数据质量" style={{ width: '420px' }}></SectionTitle>
    <div className={css['data-quality-cont']}>
      {
        dataList && dataList.map((item:any, index:number)=>{
          return(
            <div className={css['detail-cont']} key={index} >
              <div className={css['top-content']}>
                <i className={css['num']}>{ item.rate }%</i>
                <span className={`${css['midd-icon']} ${css[`midd-icon${index + 1}`]} ${ item.rate == 100?css[`midd-icon-pre${index + 1}`]:''}`} style={{bottom:`${item.rate-13}%`}}></span>
                <span className={`${css['top-cont']} ${css[`top-cont${index + 1}`]}`}  style={{height:`${item.rate-13}%`}}></span>
              </div>
              <div className={css['bottom-cont']}>
                <p>{item.title}</p>
                <p>{item.subTitle}</p>
              </div>
            </div>
          )
        })
      }
    </div>
    </>
  );
}

export default DataQuality;
