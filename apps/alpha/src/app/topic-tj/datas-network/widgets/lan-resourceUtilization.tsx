import SectionTitle from '@alpha/app/modal-view/components/section-title';
import { useState,useEffect } from 'react';
import styled from 'styled-components';
import arrow1 from '../images/arrow1.png';
import arrow2 from '../images/arrow2.png';
import boxBg from '../images/boxBg.png';
import { getUtilizationList } from '../../api/datasNetwork';

const LanData = styled.div`
  *{
    mragin: 0;
    padding: 0;
  }
  .LanData{
    width: 589px;
    height: 236px;
    margin: 23px 0px 30px 23px;
    display: flex;
    flex-wrap: wrap;
    gap: 24px 0;
    overflow: auto;
    box-sizing: border-box;
    /*滚动条bai整体*/
    ::-webkit-scrollbar{
      width: 4px;
    }
    ::-webkit-scrollbar-track{
      background-color:transparent; /*滑道全部*/
    }
    ::-webkit-scrollbar-track-piece{
      background-color:transparent; /*滑道*/
    }
    ::-webkit-scrollbar-thumb{
      background-color:#153A73; /*滑动条表面*/
      border:none; /*滑动条边框*/
    }
    li{
      list-style:none;
      width: 175px;
      height: 130px;
      margin-right: 20px;
      position: relative;
      cursor: pointer;
      >div:nth-of-type(1){
        width: 169.76px;
        height: 35px;
        opacity: 0.59;
        position:absolute;
        background: url(${boxBg}) no-repeat center center;
        background-size: 100% 100%;
        top:5px;
      }
      >div:nth-of-type(2){
        width: 169.76px;
        height: 28px;
        line-height: 14px;
        position:absolute;
        left:4.24px;
        margin-top: 4px;
        padding-left: 14.76px; 
        box-sizing: border-box;
        overflow: hidden;
        span:nth-of-type(1){
          font-family: FZZDHJW--GB1-0, sans-serif;
          font-size: 12px;
          color: #00FCFF;
        }
        span:nth-of-type(2){
          font-size: 12px;
          color: #FFFFFF;
        }
      }
      >div:nth-of-type(3){
        width: 170px;
        height: 91px;
        background: linear-gradient(0deg, rgba(16,58,132,0.00) 0%, #173E83 100%);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #00C5F5;
        padding-left: 14.76px;
        box-sizing: border-box;
        position:absolute;
        left:5px;
        bottom:0;
        div{
          span{
            font-family: PangMenZhengDao, sans-serif;
            color: white;
            margin-left: 20px;
          }
        }
      }
    }
  }
`
const LanTitle = styled.div`
  .title-cont{
    width: 325px;
    height: 19px;
    display: inline-block;
    margin-top: 26px;
    margin-left:28px;
    span{
      font-size: 14px;
      font-family: FZZDHJW--GB1-0, sans-serif;
      color: #8E8E9E;
      text-align: center;
      line-height: 18px;
      font-weight: 400;
      position: relative;
      padding: 0 20px;
      margin-right: 20px;
      cursor: pointer;
      &::before,&::after{
        position: absolute;
        top:4px;
        content: '';
        width: 11px;
        height: 10px;
        background: url(${arrow1}) no-repeat center center;
        background-size: 100% 100%;
      }
      &::after{
        right: 0;
      }
      &::before{
        left: 0;
        transform: rotate(180deg);
      }
    }
    .activeClass{
      position: relative;
      padding: 0 20px;
      color: #fff !important;
      &::before,&::after{
        position: absolute;
        top:4px;
        content: '';
        width: 11px;
        height: 10px;
        background: url(${arrow2}) no-repeat center center;
        background-size: 100% 100%;
      }
      &::after{
        right: 0;
      }
      &::before{
        left: 0;
        transform: rotate(180deg);
      }
    }
  }
`;


function ResourceUtilization(props:any) {
  const [utilizationList,setUtilizationList] = useState<any>({})
  const [currentItem, setCurrentItem] = useState<any>('CR上联169 骨干网');
  const [dataList, setDataList] = useState<any>([]);
  useEffect(()=>{     
    getUtilizationList({province:props.provinceId}).then((res) => {
      if(res.code == '200'){
        setUtilizationList(res.data)
        setDataList(res.data[1])
      }
    }) 
  },[])
  const ChangeList = (pro: string) => {
    setCurrentItem(pro)
    if (pro == 'CR上联169 骨干网') {
      setDataList(utilizationList[1]);
    } else {
      setDataList(utilizationList[2]);
    }
  };
  const chooseTable = (item:any) => {
    props.selectedCityHandler(item.cityName,item.deviceName)
  }
  return (
    <>
      <SectionTitle title="城域网资源利用率" style={{ width: '408px' }} />
      <LanTitle>
        <div className='title-cont'>
            <span className={currentItem == 'CR上联169 骨干网' ? 'activeClass' : ''} onClick={() => ChangeList('CR上联169 骨干网')}>
            CR上联169 骨干网
            </span>
            <span className={currentItem == 'BRAS上联CR' ? 'activeClass' : ''} onClick={() => ChangeList('BRAS上联CR')}>
            BRAS上联CR
            </span>
        </div>
      </LanTitle>
      <LanData>
        <ul className='LanData'>
          {dataList && dataList.map((item: any, index: number) =>
          <li key={index} onClick={()=>chooseTable(item)}>
            <div></div>
            <div>
              <span>{item.cityName} </span> 
              {/* <a title={item.deviceName} style={{display:'block'}}> */}
                <span>{item.deviceName}</span>
              {/* </a>  */}
            </div>
            <div>
              <div>设备IP<span style={{color:'#ccc',fontFamily:'PingFangSC-Regular'}}>{item.deviceIp}</span></div>
              <div>上联带宽利用率<span>{item.intoValueRate}</span></div>
              <div>上联端口利用率<span>{item.intoProtRate}</span></div>
            </div>
          </li>)}
        </ul>
      </LanData>
    </>
  );
}
export default ResourceUtilization;
