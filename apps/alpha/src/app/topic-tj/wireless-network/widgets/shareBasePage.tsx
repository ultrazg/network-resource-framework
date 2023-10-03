// 资源总揽组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { get5gRan } from '../../api/wirelessNetwork';
import { nationalAreaCode } from "@alpha/api/mapStyle";
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import scss from '../wireless-network.module.scss'
import numBgcPng from '../images/numBgc.png'
import { Autoplay, Mousewheel} from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import { simplifyProvinceName } from '@alpha/utils/commFunc';
import "swiper/css";
import "swiper/scss/effect-fade";
/* eslint-disable-next-line */
type PropsType = {
};

  
const TipBOx = styled.div`
  .tip-title{
    text-align: right;
    font-weight: 100;
    font-size: 12px;
    margin-top:16px;
    font-family: PingFangSC, PingFangSC-Regular, sans-serif;
    span{
      position:relative;
      display:inline-block;
    }
    span:before{
      content:'';
      position:absolute;
      left:-18px;
      top:3px;
      width: 10px;
      height: 10px;
      background-color: #1C90A5;
    }
    >:last-child{
      margin-left:25px
    }
     >:last-child:before {
       background-color: #2D78C2;
    }
  }
`;

const ContainerBox = styled.div`
width: 460px;
height: 480px;
margin-top: 16px;
// overflow-y: scroll;
.swiper{
  height: 480px
}
.comparison-box{
  font-size: 14px;
  display: flex;
  margin-bottom: 10px;
  >span,>em, >div{
    display: inline-block;
  }
  >:first-child {
      width: 160px;
      display: flex;
      align-items: center;
  }
  >:last-child {
      margin-left: 10px;
  }
  .comparison-sort{
    display: inline-block;
    overflow: hidden;
    text-align: center;
    font-size: 14px;
    width: 22px;
    height: 20px;
    line-height: 20px;
    background-image: url(${numBgcPng});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-family: YouSheBiaoTiHei, sans-serif;
    color: #00dbff;
  }
  .comparison-title{
    display: inline-block;
    width: 80px;
    padding-left: 16px;
    font-size: 14px;
    text-align: left;
    color: #2FC3FF;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .comparison-num{
    color: #ffffff;
    width: 80px;
    font-size: 12px;
    text-align: left;
  }
  .comparison-l-num{
      margin-top: 3px;
  }
  .comparison-line{
      margin-top: 3px;
      position: relative;
      background-color: #165EA6;
      height: 16px;
      width: 250px;
      // padding: 0  12px;
      //  border-radius: 10px;
      overflow: hidden;
      .lineInner {
          position: relative;
          // left: 0;
          height: 16px;
          // background: linear-gradient(
          //     270deg,
          //     #1edfff 2%,
          //     rgba(122, 235, 255, 0.16) 99%
          // );
          background-color: #10AEC8;
          .round {
              position: absolute;
              top: 0;
              right: 0;
              width: 0;
              height: 0;
              border-width: 0 0 7px 7px;
              border-style: solid;
              border-color: transparent transparent #203c5d;
          }
      }
      .comparison-left{
        position: absolute;
        left: 10px;
        top: 0px;
        font-size: 12px;
        color: #ffffff;
      }
      .comparison-right{
        position: absolute;
        right: 10px;
        font-size: 12px;
        top: 0px;
        color: #ffffff;
      }
  }
}
`;
export function ShareBasePage(props:any) {
  const [currentItem, setCurrentItem] = useState<any>('5G');
  const [dataPageList, setdataPageList] = useState<any>({});
  const [dataList, setDataList] = useState<any>([]);
  const [provinceCode, setprovinceCode] = useState<any>(1)
  useEffect(() => {
    get5gRan({}).then((res:any) => {
      let list: any = [];
      let provinceDataList: any = nationalAreaCode()
      let currentDate = currentItem == '5G'? res.data.wireless5gList : res.data.wireless4gList
      if(provinceCode && provinceCode !== '0'){
        // 处理市级名称
        list = currentDate.map((i:any)=>{
          let provinceC = ''
          provinceDataList.map((items:any)=>{
            if(i.provinceCode == items.code){
              provinceC = items.label
            }
          })
          return{
            ...i,
            cityName:i.cityName
            // cityName: provinceC?i.cityName.replace(provinceC,''):i.cityName
          }
        })
        setDataList(list)
        setdataPageList(res.data)
        return
      }  
    });
  }, []);
  const ChangeList = (pro:string)=>{
    setCurrentItem(pro)
    if(pro == '5G'){
      setDataList(dataPageList.wireless5gList)
    }else{
      setDataList(dataPageList.wireless4gList)
    }
  }
  return (
    <>
     <SectionTitle title="共建共享基站" style={{ width: '460px' }}>
      <div className={ scss['title-cont']}>
        <span className={ scss[currentItem =='4G' ? 'activeClass':'']} onClick = {() => ChangeList('4G') } >4G</span>
        <span className={ scss[currentItem =='5G' ? 'activeClass':'']} onClick = {() => ChangeList('5G') }>5G</span>
      </div>
     </SectionTitle>
     <TipBOx>
        <div className='tip-title'>
          <span>联通</span>
          <span>电信</span>
        </div>
    
      <ContainerBox>
      { dataList &&
        <Swiper
          modules={[Autoplay,Mousewheel]}
          mousewheel={true}
          grabCursor={true}
          slidesPerView={15}
          direction={"vertical"}
          centeredSlides={false}
          onSwiper={
            (swiper)=>{
              //鼠标悬浮暂停效果
              swiper.$el[0].addEventListener('mouseover',()=>swiper.autoplay.stop());
              //鼠标移开后继续自动滚屏效果
              swiper.$el[0].addEventListener('mouseleave',()=>swiper.autoplay.start());
            }
          }
        >
          {dataList && dataList.map((item: any, index: number) => {
            return (
              <SwiperSlide key={index}>
                <div className="comparison-box"  key={index}>
                  <div>
                    <span className="comparison-sort">{index +1}</span>
                    <span className="comparison-title">{simplifyProvinceName(item.provinceName)}</span>
                    <span className="comparison-num">{item.anum}</span>
                  </div>
                  <div className="comparison-line"  >
                    <div className="lineInner" style={{width:item.unRate + '%'}}>
                    </div>
                    <em className="comparison-left">{item.unRate}%</em>
                      <em className="comparison-right">{item.chRate}%</em>
                  </div>
            {/* <span className="comparison-num comparison-l-num">{item.bnum}</span> */}
                </div>
              </SwiperSlide>
            )
          })
          }
        </Swiper>
      }
      </ContainerBox>
    </TipBOx>
    </>
  );
}

export default ShareBasePage;
