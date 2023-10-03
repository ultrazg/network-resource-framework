// 资源总揽组件
import styled from 'styled-components';
import Icon01 from '../images/icon01.png';
import Icon02 from '../images/icon02.png';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore,{ EffectCoverflow, Autoplay } from "swiper"
import "swiper/css"
import "swiper/scss/effect-fade"
import { getResourcesAll } from '../../api/wirelessNetwork';
import SectionTitle from '@alpha/app/modal-view/components/section-title';
/* eslint-disable-next-line */
SwiperCore.use([ Autoplay ]);

interface SingleList {
  stationNum?:string;
  villageNum?:string;
  bbu?:string;
  rru?:string;
  du?:string;
  cu?:string;
  aau?:string;
  type?:string;
  title?:string;
}
const ListWrapper = styled.div`
  width: 420px;
  .swiper{
    padding-top:60px;
  }
  .swiper-slide {
    box-sizing: border-box;
    opacity: 0;
    z-index:1;
    height:256.26px;
    // border: 2px solid #1f74c6;
  }
  .swiper-slide-prev {
    opacity: 0.2;
    // transform: scale(0.8);
    z-index:10 !important
  }
  .swiper-slide-next {
    // transform: scale(0.8);
    opacity: 0.2;
    z-index:10 !important
  }
  .swiper-slide-active {
    margin-top:-60px;
    opacity: 1;
    z-index:100 !important;
    .header:before{
      width:70px;
      height: 60px;
      background: url(${Icon02}) center center no-repeat;
      background-size: 100% 100%;
    }
  }
`;

const SwiperDetail = styled.div`
  padding:6px;
  border: 2px solid #1f74c6 !important;
  height: 246.26px;
  // width: 220.48px;
  margin: 0 auto;
  background: linear-gradient(360deg, #074183, #023370);
  // box-shadow: -1px -1px 2px rgb(124 203 248 / 40%);
  border-image: linear-gradient(180deg,
      rgba(124, 203, 248, 0.4),
      rgba(70, 155, 238, 0.13)) 1 1;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height:59px;
    background: linear-gradient(135deg, #4f63de, #1f74c6);
    border-radius: 8px;
   // box-shadow: 0 2px 7px 0 rgba(15, 50, 90, 0.75);
    font-size: 27px;
    font-weight:800;
    color:#fff;
   // text-shadow: 0 5px 4px 0 rgba(15, 71, 125, 0.84);
    margin-bottom: 20px;
    &::before {
      display: inline-block;
      content: "";
      width:36px;
      height: 36px;
      background: url(${Icon01}) center center no-repeat;
      background-size: 100% 100%;
      margin-top: 7px;
      margin-right: 5px;
    }
  }
  .desc {
    padding: 0 14px;
    font-size:14px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    line-height: 20px;

    .label {
      // text-align: left;
      font-family: PingFangSC, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
    }

    .number {
      color: #8eeaff;
      font-size:16px;
      font-weight: 800;
      // font-family: PangMenZhengDao, sans-serif;
      // text-align: right;
    }
  }
`;
export function ResourceOverview() {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [dataList, setDataList] = useState<Array<any>>([]);
  useEffect(() => {
    getResourcesAll({}).then((res:any) => {
      let list: Array<any> = [];
      let networkType = [ "5G", "2G", "3G", "4G"];
      for (let j = 0; j < networkType.length; j++) {
        let obj:SingleList = {};
        let obj2:SingleList = {};
        for (let i in res.data) {
          let regFirst = new RegExp("^(dx)","i")
          let reg = new RegExp(".*" + networkType[j] + "$", "i");
          if (reg.test(i)) {
            // @ts-ignore
            obj[i.substring(0, i.length - 2)] = res.data[i];
          }
          if (regFirst.test(i) && reg.test(i)) {
            // @ts-ignore
            obj2[i.substring(2, i.length - 2)] = res.data[i];
          }
        }
        obj.type = networkType[j];
        obj.title = '联通' + networkType[j];
        if(obj2.stationNum){
          obj2.type = networkType[j];
          obj2.title = '电信' + networkType[j];
        }
        list.push(obj);
        if(obj2.title){
          list.push(obj2);
        }
      }
      setDataList(list)
    });
  }, []);

  const handleClickSwiper = (swiper: any) => {
    swiper?.slideToClickedSlide();
  }
  
  return (
    <>
    <SectionTitle title="资源总览" style={{ width: '420px' }}></SectionTitle>
     <ListWrapper style={{ marginTop: '30px' }}>
      <Swiper
        onSwiper={(swiper) => setSwiper(swiper)}
        modules={[EffectCoverflow]}
        loop={true} 
        slidesPerView={1.8}
        initialSlide={1}
        spaceBetween={50}
        effect={"coverflow"}
        autoplay={true}
        centeredSlides={true}
        onClick={handleClickSwiper}
        coverflowEffect={{
          rotate: 0,
          stretch: 160,
          depth: 100,
          modifier: 2,
          slideShadows: true
        }}
        >
        { dataList && dataList.map((item:any, index:number) => {
          return (<SwiperSlide key={index}>
            <SwiperDetail>
                <div className="header">{ item.title }</div>
                <div className="desc flexBox">
                  <div className="label">基站</div>
                  <div className="number">{ item.stationNum || 0 }</div>
                </div>
                <div className="desc flexBox">
                  <div className="label">小区</div>
                  <div className="number">{ item.villageNum || 0 }</div>
                </div>
                <div>
                  {item.type === '5G' ? ( <div>
                    <div className="desc flexBox">
                      <div className="label">CU</div>
                      <div className="number">{ item.cu || 0 }</div>
                    </div>
                    <div className="desc flexBox">
                      <div className="label">DU</div>
                      <div className="number">{ item.du || 0 }</div>
                    </div>
                    <div className="desc flexBox">
                      <div className="label">AAU</div>
                      <div className="number">{ item.aau || 0 }</div>
                    </div>
                  </div>) : (<div>
                    <div className="desc flexBox">
                      <div className="label">BBU</div>
                      <div className="number">{ item.bbu || 0 }</div>
                    </div>
                    <div className="desc flexBox">
                      <div className="label">RRU</div>
                      <div className="number">{ item.rru || 0 }</div>
                    </div>
                  </div>)}
                </div>
             </SwiperDetail>
           </SwiperSlide>
          );
        })
        }
      </Swiper>
      </ListWrapper>
    </>
  );
}

export default ResourceOverview;
