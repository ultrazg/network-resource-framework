// 宽带运营支撑组件
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import SectionTitle from '@alpha/app/modal-view/components/section-title';

import SwiperCore, { EffectCoverflow, Autoplay, Mousewheel} from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/scss/effect-fade";

import { postQualityPassQualityPassRatio, resourceQualityDetails, getTransferRuleDetailed, getTransferRuleResultList } from '../../api/quality-board';
import screen from '../images/screen.png';
import arrowUp from '../images/arrow-up.png';
import arrowDown from '../images/arrow-down.png';
import screenBottom from '../images/screen-bottom.png';
import detailListBg from '../images/detail_list_bg.png';
import detailListBgActive from '../images/detail_list_bg_active.png';
import listBefore from '../images/list_before.png';
import listAfter from '../images/list_after.png';
import listBeforeActive from '../images/list_before_active.png';
import listAfterActive from '../images/list_after_active.png';
import bgMenu1 from '../images/bg-menu1.png';
import bgMenu2 from '../images/bg-menu2.png';
import bgCard from '../images/bg-card.png';
import circleLight from '../images/circle-lignt.png';
import bgCircle from '../images/bg-circle.png';
import styles from './widgets.module.scss';
/* eslint-disable-next-line */
export interface OverViewProps {
  changeTitle: Function;
}

const SectionTip = styled.div`
  position: absolute;
  right: 60px;
  font-size: 16px;
  padding-right: 20px;
  top: 0;
  .num{
    font-family: "CAI300", sans-serif;
    font-style: italic;
    color: #0EEDFE;
    font-size: 24px;
    margin-right: 6px;
  }
`
const ScreenSwiper = styled.div`
  margin: 0 0 0 -30px;
  .swiper {
    width: 420px;
    .swiper-slide {
      box-sizing: border-box;
      height: 152px;
      background: url(${screen}) no-repeat center;
      background-size: 100%;
      opacity: 0;
      .inner {
        width: 100%;
        height: 152px;
        background: url(${screen}) no-repeat center;
        background-size: 100%;
        padding: 15px 0 0;
        box-sizing: border-box;
      }
    }
    .swiper-slide-prev {
      opacity: 0.1;
    }
    .swiper-slide-next {
      opacity: 0.1;
    }
    .swiper-slide-active {
      opacity: 1;
    }
    .info {
      padding: 0 23px;
      display: flex;
      >div {
        flex: 1;
        width: 50%;
        white-space: nowrap;
        line-height: 36px;
      }
      span {
        display: inline-block;
      }
      .name {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.8);
      }
      .num {
        margin-left: 7px;
        font-family: "CAI300", sans-serif;
        font-style: italic;
        font-weight: lighter;
        font-size: 22px;
      }
      .percent {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.8);
      }
      .raise {
        width: 8px;
        height: 12px;
        background: url(${arrowUp}) no-repeat center;
        background-size: 100%;
        margin-left: 5px;
        &.down {
          background: url(${arrowDown}) no-repeat center;
          background-size: 100%;
        }
      }
    }
    .line {
      width: 325px;
      height: 1px;
      background: linear-gradient(270deg,
          rgba(0, 133, 255, 0.0001) -3.08%,
          #00bbff 52.36%,
          rgba(0, 139, 255, 0.0001) 105.08%);
      margin: 0 auto;
    }
    .title {
      text-align: center;
      margin-top: 10px;
      .big-tt {
        font-family: "FZZD", sans-serif;
        font-size: 20px;
      }
      .big-num {
        font-size: 30px;
        font-family: "CAI300", sans-serif;
        font-style: italic;
        margin-left: 17px;
      }
      .unit {
        font-size: 16px;
        margin-left: 9px;
      }
    }
  }
  .screen-bottom {
    width: 337px;
    height: 48px;
    margin: 0 auto;
    background: url(${screenBottom}) no-repeat;
  }
`;
const TabSwiper = styled.div`
  *{
    margin: 0,padding:0;
  }
  margin: 0 0 0 -30px;
  .swiper{
    cursor: pointer;
    width: 400px;
    margin: 11px auto 22px;
  }
  .swiper-slide {
    background: #101c4c;
    border: 1px solid #007cff;
    box-shadow: inset 0px 0px 9px rgba(0, 122, 255, 0.5);
    border-radius: 2px;
    height: 31px;
    line-height: 31px;
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: #0657ac;
    color: #027fc5;
    .cube {
      display: none;
    }
  }
  .swiper-slide-active {
    opacity: 1;
    color: #00feff;
    background: #101c4c;
    border: 1px solid #00fffc;
    .cube {
      display: inline-block;
      width: 9px;
      height: 9px;
      background: linear-gradient(180deg, #00e2ff 0%, #00feff 98.86%);
      margin: 6px;
    }
  }
  .swiper-slide-prev,
  .swiper-slide-next {
    border-color: #007cff;
    color: #00a3ff;
  }
`;
const MenuBox = styled.div`
  *{
    margin: 0,padding:0;
  }
  margin: 0 0 0 -30px;
  .tab-menu {
    display: flex;
    height: 40px;
    margin-top: 25px;
    align-items: center;
    justify-content: center;
    li {
      width: 138px;
      margin: 0 10px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      span {
        width: 121px;
        display: block;
        height: 37px;
        line-height: 37px;
        background: url${bgMenu2}) no-repeat center;
        background-size: 100%;
        color: #4da3e1;
        transition: all 0.4s;
        font-size: 15px;
        text-align: center;
      }
      &.on {
        span {
          width: 138px;
          height: 40px;
          line-height: 40px;
          background: url(${bgMenu1}) no-repeat center;
          background-size: 100%;
          color: #00feff;
          font-size: 16px;
        }
      }
    }
  }
`;
const CardSwiper = styled.div`
  *{
    margin: 0,padding:0;
  }
  .swiper{
    height: 215px;
    margin-top: 10px;
    margin-left: 15px;
  }
  .swiper-slide {
    background: url(${detailListBg}) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    padding: 9px 14px;
    margin: 0 20px;
    height: 65px;
    width: 413px;
    box-sizing: border-box;
    .name {
      font-size: 14px;
      font-weight: 600;
      color: #87b3dc;
      &::before,
      &::after {
        display: inline-block;
        content: "";
        width: 17px;
        height: 16px;
      }
      &::before {
        background: url(${listBefore}) no-repeat;
        background-size: 100% auto;
        margin-right: 6px;
      }
      &::after {
        background: url(${listAfter}) no-repeat;
        background-size: 100% auto;
        margin-left: 6px;
      }
    }
    .table-body-style {
      display: flex;
      margin-left: 24px;
      .trow {
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        color: #fff;
        flex: 1;
        text-align: center;
        height: 30px;
        line-height: 28px;
        white-space: nowrap;
        &.num {
          font-family: "PangMenZhengDao", sans-serif;
          color: #0effea;
          font-size: 16px;
        }
        .progress {
          width: 210px;
          height: 12px;
          margin: 10px 13px 0 9px;
          span {
            display: block;
            background: linear-gradient(270deg, #02fbec 1.63%, #245ffc 100%);
            height: 12px;
          }
        }
      }
    }
    .detail {
      width: 50px;
      font-size: 12px;
      font-family: PingFang SC, PingFang SC-Medium, sans-serif;
      font-weight: 500;
      text-align: LEFT;
      color: #ffffff;
      line-height: 12px;
      cursor: pointer;
    }
    &:last-child {
      margin-bottom: 25px;
    }
    &.on {
      background: url(${detailListBgActive}) no-repeat;
      background-size: 100% 100%;
      margin: 0 0 0 8px;
      .name {
        &::before {
          background: url(${listAfterActive}) no-repeat;
          background-size: 100% auto;
          margin-right: 6px;
        }
        &::after {
          background: url(${listAfterActive}) no-repeat;
          background-size: 100% auto;
          margin-left: 6px;
        }
      }
    }
  }
`;
const CircleSwiper = styled.div`
  *{
    margin: 0,padding:0;
  }
  margin: 10px 0 0 -30px;
  .swiper {
    width: 440px;
    margin: 25px auto 0;
    .swiper-slide {
      background-size: 100%;
      box-sizing: border-box;
      width: 270px;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      opacity: 0;
      cursor: pointer;
    }
    .swiper-slide-prev,
    .swiper-slide-next {
      opacity: 0.5;
    }
    .swiper-slide-active {
      opacity: 1;
    }
    .box{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    .title {
      font-size: 16px;
      line-height: 22px;
      text-shadow: 0px 5px 4px #021750;
      font-family: 'Microsoft YaHei', sans-serif;
      position: absolute;
      top: 30px;
      left: 35px;
      width: 192px;
      margin: 0;
    }
  }
  .box-circle {
    width: 160px;
    height: 160px;
    padding: 24px;
    box-sizing: border-box;
    margin: 45px auto 0;
    position: relative;
    .num {
      margin: 0;
      position: absolute;
      color: #fff;
      font-size: 20px;
      text-align: center;
      width: 100%;
      top: 65px;
      left: 0;
      font-weight: 600;
      z-index: 9;
      font-family: "CAI300", sans-serif;
      font-style: italic;
    }
    .circle-light {
      width: 112px;
      height: 112px;
      margin: 0 auto;
      background: url(${circleLight}) no-repeat center;
      background-size: 100%;
    }
    .circle-cover {
      // transform: rotate(56deg);
      position: absolute;
      width: 120px;
      height: 120px;
      left: 20px;
      top: 20px;
      border-radius: 100%;
    }
    .light {
      position: absolute;
      top: 0;
      left: 0;
      width: 160px;
      height: 160px;
      background: url(${bgCircle}) no-repeat center;
      background-size: 100%;
    }
  }
`;
const TableSwiper = styled.div`
  *{
    margin: 0,padding:0;
  }
  margin: 0 0 0 -30px;
  .swiper {
    height: 200px;
    width: 100%;
    .swiper-slide {
      display: flex;
      align-items: center;
      height: 30px;
      box-sizing: border-box;
      border-width: 0 0 2px 0px;
      border-style: solid;
      border-color: rgba(55, 230, 232, 0.3);
      background: linear-gradient(180deg,
          rgba(0, 163, 255, 0.1) 0%,
          rgba(76, 214, 255, 2e-5) 51.67%,
          rgba(0, 163, 255, 0.1) 100%);
      >div {
        width: 18%;
        text-align: center;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC, sans-serif;
        font-weight: 400;
        color: #c0e7ff;
        line-height: 20px;
        white-space: nowrap;

        &:last-child {
          width: 32%;
        }
      }
    }
  }
  .flex{
    display: flex;
    align-items: center
  }
  .progress {
    width: 60px;
    height: 8px;
    background: #0e2985;
    margin: 5px;
    justify-content: flex-start;
    align-items: flex-start;
    span {
      background: linear-gradient(270deg, #00d1e2 0%, #3179da 100%);
      height: 8px;
      display: block;
    }
  }

  .num {
    font-family: "PangMenZhengDao", sans-serif;
    color: #51e6ff;
    font-size: 14px;
  }
  .tab-header {
    padding: 0;
    width: 100%;
    margin: 20px 0 0;
    height: 32px;
    line-height: 30px;
    background: linear-gradient(180deg,
        rgba(0, 163, 255, 0.5) 0%,
        rgba(76, 214, 255, 5e-5) 51.67%,
        rgba(0, 163, 255, 0.5) 100%);
    mix-blend-mode: normal;
    opacity: 0.5;
    border-width: 2px 0px;
    border-style: solid;
    border-color: #37e6e8;
    display: flex;
    li {
      text-align: center;
      color: #91c0e5;
      font-size: 14px;
      width: 17%;
      &:last-child {
        width: 32%;
      }
      list-style: none;
    }
  }
`;
export function OperateSupport(props:OverViewProps) {
  const [swiper1, setSwiper1] = useState<SwiperCore | null>(null);
  const [swiper2, setSwiper2] = useState<SwiperCore | null>(null);
  const [swiper3, setSwiper3] = useState<SwiperCore | null>(null);

  const [tabItemData, setTabItemData] = useState<any>([]);
  const [cardListData, setCardListData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [circleData, setCircleData] = useState<any>([]);
  const [firstIndex, setFirstIndex] = useState<any>(0);
  const [secondIndex, setSecondIndex] = useState<number>(0);
  const [menuIndex, setMenuIndex] = useState<number>(1);

  const changeTitle = (value:string) => {
    props.changeTitle(value)
  }
  const changeDetail = (index: number) => {
    setMenuIndex(index);
  }
  const changeTab = (index:number) => {
    if(swiper1 && swiper2){
      swiper2.slideToLoop(index);
      swiper1.slideToLoop(index);
      setFirstIndex(index);
    }
  }
  const getCardList = (index:number) => {
    if(tabItemData.length > 0){
      resourceQualityDetails({
        specialityId: tabItemData[index].specialityId,
        dayType: 'day'
      }).then((res: any) => {
        if (res.code == '200' && res.data && res.data.length > 0) {
          setCardListData(res.data);
          setSecondIndex(0);
          getTableData(res.data[0].indicatorId);
          getCircleData(res.data[0].indicatorId);
        }
      });
    }
  }
  const getTableData = (indicatorId:any) => {
    getTransferRuleDetailed({
      indicatorId: indicatorId,
      dayType: 'day',
      type: 2
    }).then((res: any) => {
      if (res.code == '200' && res.data && res.data.length > 0) {
        setTableData(res.data);
      }
    });
  }
  const getCircleData = (indicatorId:any) => {
    getTransferRuleResultList({
      indicatorId: indicatorId,
      areaCode: ''
    }).then((res: any) => {
      if (res.code == '200' && res.data && res.data.length > 0) {
        setCircleData(res.data);
      }
    });
  }
  const header = ["省分", "稽核总量", "正常数", "异常数", "达标率"];
  useEffect(() => {
    //请求数据
    postQualityPassQualityPassRatio({}).then((res: any) => {
      if (res.code == '200' && res.data && res.data.length > 0) {
        setTabItemData(res.data);
        changeTitle(res.data[4].speciality);
        resourceQualityDetails({
          specialityId: res.data[0].specialityId,
          dayType: 'day'
        }).then((res: any) => {
          if (res.code == '200' && res.data && res.data.length > 0) {
            setCardListData(res.data);
            getTransferRuleDetailed({
              indicatorId: res.data[0].indicatorId,
              dayType: 'day',
              type: 2
            }).then((res: any) => {
              if (res.code == '200' && res.data && res.data.length > 0) {
                setTableData(res.data);
              }
            });
            getTransferRuleResultList({
              indicatorId: res.data[0].indicatorId,
              areaCode: ''
            }).then((res: any) => {
              if (res.code == '200' && res.data && res.data.length > 0) {
                setCircleData(res.data);
              }
            });
          }
        });
      }
    });
  }, []);
  

  return (
    <div className={styles['container']}>
      <SectionTitle
        title="专业稽核总览"
        style={{ width: '420px', margin: '0 0 30px -30px' }}
      ></SectionTitle>
      {tabItemData.length>0 && 
        <SectionTip>
            <span>全国达标率：</span>
            <span className="num">{tabItemData[firstIndex].resNormalNum}</span>
            <span>%</span>
        </SectionTip>
      }
      <ScreenSwiper>
        <Swiper
          onSwiper={(swiper) => setSwiper1(swiper)}
          modules={[EffectCoverflow]}
          centeredSlides={true}
          slidesPerView={1.3}
          initialSlide={2}
          effect={"coverflow"}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 110,
            depth: 160,
            modifier: 2,
            slideShadows: true
          }}
          onSlideChange={(swiper) => {
            const index = swiper.realIndex;
            if(swiper2){
              swiper2.slideToLoop(index);
              setFirstIndex(index);
              getCardList(index);
            }
            if(tabItemData.length>0){
              changeTitle(tabItemData[index].speciality)
            }
          }
          }
        >
          {tabItemData && tabItemData.map((item: any, index: number) => {
            return (
              <SwiperSlide key={index}>
                <div className="inner">
                  <div className="info">
                    <div>
                      <span className="name">达标省分</span>
                      <span className="num">{item.provinceNormalNum}</span>
                    </div>
                    <div>
                      <span className="name">昨日环比</span>
                      <span className={`raise ${item.reteProvinceNumRate - 0 > 0 ? 'up' : ''}`}></span>
                      <span className="num">{item.reteProvinceNumRate}</span>
                      <span className="percent">%</span>
                    </div>
                  </div>
                  <div className="line"></div>
                  <div className="info">
                    <div>
                      <span className="name">资源质量</span>
                      <span className="num">{item.resNormalNum}</span>
                      <span className="percent">%</span>
                    </div>
                    <div>
                      <span className="name">昨日环比</span>
                      <span className={`raise ${item.resNormalNumRate - 0 > 0 ? 'up' : ''}`}></span>
                      <span className="num">{item.resNormalNumRate}</span>
                      <span className="percent">%</span>
                    </div>
                  </div>
                  <div className="title">
                    <span className="big-tt">{item.speciality}</span>
                    <span className="big-num">{item.totalNum}</span>
                    {item.hasWan && <span className="unit">万</span>}
                  </div>
                </div>
              </SwiperSlide>
            );
          })
          }
        </Swiper>
        <div className="screen-bottom"></div>
      </ScreenSwiper>
      <TabSwiper>
        <Swiper
          onSwiper={(swiper) => setSwiper2(swiper)}
          modules={[EffectCoverflow]}
          loop={true}
          centeredSlides={true}
          slidesPerView={5}
          initialSlide={5}
          effect={"coverflow"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 2,
            slideShadows: true
          }}
          onSlideChange={(swiper: any) => {
            let index = swiper.realIndex;
            if(swiper1){
              swiper1.slideToLoop(index);
            }
          }}
        >
          {tabItemData && tabItemData.map((item: any, index: number) => {
            return (
              <SwiperSlide key={index} onClick={() => changeTab(index)}>
                <span className="cube"></span>
                <span>{item.speciality}</span>
              </SwiperSlide>
            )
          })
          }
        </Swiper>
      </TabSwiper>

      <SectionTitle
        title="专业稽核指标"
        style={{ width: '400px', margin: '40px 0 30px' }}
      ></SectionTitle>
      <CardSwiper>
        <Swiper
          modules={[Mousewheel]}
          mousewheel={true}
          grabCursor={true}
          slidesPerView={3}
          direction={"vertical"}
          centeredSlides={false}
          spaceBetween={10}
          onClick={(swiper: any) => {
            let index = swiper.clickedIndex;
            // console.log(index)
            setSecondIndex(index);
            getTableData(cardListData[index].indicatorId);
            getCircleData(cardListData[index].indicatorId);
          }}
        >
          {cardListData && cardListData.map((item: any, i: number) => {
            return (
              <SwiperSlide key={i} className={secondIndex==i ? 'on':''}>
                <div className="name">{item.indicatorName}</div>
                <div className="table-body-style">
                  <div className="trow">稽核成功率</div>
                  <div className="trow">
                    <div className="progress">
                      <span style={{ width: item.rate + '%' }}></span>
                    </div>
                  </div>
                  <div className="trow num">{item.rate}%</div>
                </div>
              </SwiperSlide>
            )
          })
          }
        </Swiper>
      </CardSwiper>
      <MenuBox>
        <ul className="tab-menu">
          <li className={menuIndex == 0 ? 'on' : ''} onClick={() => changeDetail(0)}>
            <span>稽核细项</span>
          </li>
          <li className={menuIndex == 1 ? 'on' : ''} onClick={() => changeDetail(1)}>
            <span>省分统计</span>
          </li>
        </ul>
      </MenuBox>
      {menuIndex == 0 && circleData.length>0 && 
      <CircleSwiper>
        <Swiper
          onSwiper={(swiper) => setSwiper3(swiper)}
          modules={[EffectCoverflow,Autoplay]}
          centeredSlides={true}
          slidesPerView={1.7}
          autoplay={{
            delay: 3500,
            pauseOnMouseEnter: true
          }}
          effect={"coverflow"}
          coverflowEffect={{
            rotate: 0,
            stretch: 80,
            depth: 10,
            modifier: 2,
            slideShadows: true
          }}
          preventClicksPropagation={false}
          onClick={(swiper: any) => {
            let index = swiper.clickedIndex;
            if(swiper3){
              swiper3.slideToLoop(index);
            }
          }}
        >
          {circleData && circleData.map((item: any, index: number) => {
            return (
              <SwiperSlide key={index}>
                <img src={bgCard} width="100%"/>
                <div className="box">
                  <p className="title">{ item.ruleName }</p>
                  <div className="box-circle">
                    <p className="num">{ item.rate }%</p>
                    <div className="circle-light"></div>
                    <div className="circle-cover">
                      <div className="left"></div>
                      <div className="right"></div>
                    </div>
                    <div className="light"></div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })
          }
        </Swiper>
      </CircleSwiper>
      }
      {menuIndex == 1 && tableData.length>0 && 
      <TableSwiper>
        <ul className="tab-header">
          {header && header.map((item: any, index: number) => {
            return (
              <li key={index}>{item}</li>
            )
          })
          }
        </ul>
        <Swiper
          modules={[Autoplay,Mousewheel]}
          autoplay={{
            delay: 1000,
            stopOnLastSlide: false,//如果设置为true，当切换到最后一个slide时停止自动切换
            disableOnInteraction: false,
          }}
          mousewheel={true}
          grabCursor={true}
          slidesPerView={7}
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
          {tableData && tableData.map((item: any, index: number) => {
            return (
              <SwiperSlide key={index}>
                <div>{item.province}</div>
                <div>{item.totalNum}</div>
                <div>{item.successNum}</div>
                <div>{item.failNum}</div>
                <div className="flex">
                  <div className="progress">
                    <span style={{ width: item.successRate + '%' }}></span>
                  </div>
                  <span className="num">{item.successRate}%</span>
                </div>
              </SwiperSlide>
            )
          })
          }
        </Swiper>
      </TableSwiper>
      }
    </div>
  );
}

export default OperateSupport;
