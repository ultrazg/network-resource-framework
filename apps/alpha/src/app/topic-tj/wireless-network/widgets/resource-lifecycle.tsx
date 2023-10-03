import styled from 'styled-components';
import { useEffect, useState } from 'react';
import wirei1 from '../images/wirei-1.abe6ee3.png';
import wirei2 from '../images/wirei-2.6213859.png';
import wirei3 from '../images/wirei-3.a01cf74.png';
import wirei4 from '../images/wirei-4.d529594.png';
import wirei5 from '../images/wirei-5.a5292f1.png';
import allow1 from '../images/allow_default.png';
import allow2 from '../images/allow_turndown.png';
import allow3 from '../images/wirea_3.png';
import allow4 from '../images/wirea_4.png';
import allow5 from '../images/allow_turnup.png';
import sourceLifeBg from '../images/sourceLifeBg.4b48bef.png';
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import { getResLife } from '../../api/wirelessNetwork';


const Month = styled.div`
  .month{
    width: 50px;
    height: 27px;
    background: -webkit-gradient(linear,right top,left top,from(rgba(19,47,140,0)),color-stop(47%,rgba(14,69,134,.63)),to(rgba(42,93,192,0)));
    background: linear-gradient(270deg,rgba(19,47,140,0),rgba(14,69,134,.63) 47%,rgba(42,93,192,0));
    font-size: 14px;
    font-family: PingFangSC,PingFangSC-Regular, sans-serif;
    font-weight: 400;
    text-align: center;
    color: #fff;
    line-height: 27px;
    margin-left: 8px;
  }
`

const ResourceBox = styled.div`
  * {
    padding: 0;
    margin: 0;
  }
  .sourceLife-container {
    position: absolute;
    right: 0;
    bottom: 8px;
    padding: 10px 0 0 70px;
    width: 513px;
    height: 360px;
    z-index: 10;
    .container-content {
      position: relative;
      width: 100%;
      height: calc(100% - -90px);
      background: url(${sourceLifeBg}) 50% no-repeat;
      background-size: 90% 58%;
      margin-top: 16px;
      .items {
        z-index: 66;
        width: 150px;
        position: absolute;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        .itemsTitle{
          width: 80px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: #fff;
          background-image: -webkit-gradient(linear,right top,left top,from(transparent),color-stop(rgba(0,106,158,.45)),to(transparent));
          background-image: linear-gradient(270deg,transparent,rgba(0,106,158,.45),transparent);
        }
        .msg{
          .pr-s{
            display: inline-block;
            width: 65px;
            padding-right: 2px;
            font-size: 14px;
            font-family: PingFangSC,PingFangSC-Regular, sans-serif;
            font-weight: 400;
            text-align: left;
            color: #52a9ea;
            line-height: 20px;
            margin-bottom: 3px;
          }
          .num{
            display: inline-block;
            font-size: 14px;
            font-family: PangMenZhengDao, sans-serif;
            text-align: left;
            color: #7affff;
            line-height: 16px;
          }
        }
      }
      .item1 {
        left: 72px;
        top: 25px;
        .itemsImg1 {
          width: 87px;
          height: 78px;
        }
      }
      .item2 {
        right: 74px;
        top: 6px;
        .itemsImg2 {
          width: 84px;
          height: 96px;
        }
      }
      .item3 {
        left: -47px;
        top: 143px;
        .itemsImg3 {
          width: 92px;
          height: 91px;
        }
      }
      .item4 {
        right: -44px;
        top: 136px;
        .itemsImg4 {
          width: 92px;
          height: 99px;
        }
      }
      .item5 {
        left: calc(50% - 76px);
        bottom: 22px;
        .itemsImg5 {
          width: 90px;
          height: 97px;
        }
      }
      .arrow{
        position: absolute;
      }
      .arrow1{
        width: 136px;
        height: 80px;
        left: 50%;
        top: 10px;
        background: url(${allow1}) 50% no-repeat;
        background-size: 68px 40px;
        animation: actionAnimation1 1.2s linear .1s infinite;
        animation-direction: normal;
        animation-fill-mode: none;
        animation-play-state: running;
        animation-name: actionAnimation1;
      }
      @keyframes actionAnimation1{
        0%{
          opacity: 0;
          -webkit-transform: translate3d(-111%,53%,0);
          transform: translate3d(-111%,53%,0);
        }
        50%{
          opacity: 1;
        }
        100%{
          opacity: 0;
          -webkit-transform: translate3d(10%,53%,0);
          transform: translate3d(10%,53%,0);
        }
      } 
      .arrow2{
        width: 112px;
        height: 66px;
        right: 20px;
        top: 28px;
        background: url(${allow2}) 50% no-repeat;
        background-size: 56px 33px;
        animation: actionAnimation2 1.2s linear .1s infinite;
        animation-direction: normal;
        animation-fill-mode: none;
        animation-play-state: running;
        animation-name: actionAnimation2;
      }
      @keyframes actionAnimation2{
        0%{
          -webkit-transform: translate3d(-46%,68%,0) rotate(-15deg);
          transform: translate3d(-46%,68%,0) rotate(-15deg);
          opacity: 0;
        }
        50%{
          opacity: 1;
        }
        100%{
          opacity: 0;
          -webkit-transform: translate3d(27%,186%,0) rotate(10deg);
          transform: translate3d(27%,186%,0) rotate(10deg);
        }
      }
      .arrow3{
        width: 120px;
        height: 60px;
        right: 55px;
        top: 200px;
        background: url(${allow3}) 50% no-repeat;
        background-size: 81px 43px;
        animation: actionAnimation3 1.2s linear .1s infinite;
        animation-direction: normal;
        animation-fill-mode: none;
        animation-play-state: running;
        animation-name: actionAnimation3;
      }
      @keyframes actionAnimation3{
        0%{
          -webkit-transform: translate3d(72%,60%,0) rotate(-15deg);
          transform: translate3d(72%,60%,0) rotate(-15deg);
          opacity: 0;
        }
        50%{
          opacity: 1;
        }
        100%{
          opacity: 0;
          -webkit-transform: translate3d(-63%,189%,0) rotate(10deg);
          transform: translate3d(-63%,189%,0) rotate(10deg);
        }
      }
      .arrow4{
        width: 120px;
        height: 60px;
        left: 102px;
        top: 208px;
        background: url(${allow4}) 50% no-repeat;
        background-size: 98px 36px;
        animation: actionAnimation4 1.2s linear .1s infinite;
        animation-direction: normal;
        animation-fill-mode: none;
        animation-play-state: running;
        animation-name: actionAnimation4;
      }
      @keyframes actionAnimation4{
        0%{
          -webkit-transform: translate3d(72%,197%,0) rotate(-15deg);
          transform: translate3d(72%,197%,0) rotate(-15deg);
          opacity: 0;
        }
        50%{
          opacity: 1;
        }
        100%{
          opacity: 0;
          -webkit-transform: translate3d(-71%,48%,0) rotate(10deg);
          transform: translate3d(-71%,48%,0) rotate(10deg);
        }
      }
      .arrow5{
        width: 124px;
        height: 88px;
        left: 20px;
        top: 37px;
        background: url(${allow5}) 50% no-repeat;
        background-size: 62px 44px;
          animation: actionAnimation5 1.2s linear .1s infinite;
          animation-direction: normal;
          animation-fill-mode: none;
          animation-play-state: running;
          animation-name: actionAnimation5;
      }
      @keyframes actionAnimation5{
        0%{
          -webkit-transform: translate3d(-32%,101%,0) rotate(326deg);
          transform: translate3d(-32%,101%,0) rotate(326deg);
          opacity: 0;
        }
        50%{
          opacity: 1;
        }
        100%{
          -webkit-transform: translate3d(25%,24%,0) rotate(365deg);
          transform: translate3d(25%,24%,0) rotate(365deg);
          opacity: 0;
        }
      }       
    }
   }
  }
`;


function ResourceLifecycle() {
  const [resourceList,setResourceList] = useState<any>({})
  useEffect(()=>{     
    getResLife({}).then((res) => {
      setResourceList(res.data)
    }) 
  },[])
  function GetMonthDate(){
    var nowdays = new Date();
    var month = nowdays.getMonth();
    return (
      <Month>
        <div className="month">{month}月</div>
      </Month>
    )
  }
  return (
    <>
      <SectionTitle title="资源生命周期" style={{ width: '513px'}}>
          <GetMonthDate></GetMonthDate>
      </SectionTitle>
      <ResourceBox>
      <div className="sourceLife-container">
          <div className="container-content">
            <div className="items item1">
              <div className="itemsTitle">割接</div>
              <img src={wirei1} className="itemsImg1" />
              <div className="msg">
                <p>
                  <span className="pr-s">资源数</span>
                  <span className="num">{resourceList.ofNetworkNum}</span>
                </p>
                <p>
                  <span className="pr-s">工单数</span>
                  <span className="num">{resourceList.ofNetworkONum}</span>
                </p>
              </div>
            </div>
            <div className="items item2">
              <div className="itemsTitle">搬迁</div>
              <img src={wirei2} className="itemsImg2" />
              <div className="msg">
                <p>
                  <span className="pr-s">资源数</span>
                  <span className="num">{resourceList.moveNum}</span>
                </p>
                <p>
                  <span className="pr-s">工单数</span>
                  <span className="num">{resourceList.moveONum}</span>
                </p>
              </div>
            </div>
            <div className="items item3">
              <div className="itemsTitle">入网交维</div>
              <img src={wirei3} className="itemsImg3" />
              <div className="msg">
                <p>
                  <span className="pr-s">资源数</span>
                  <span className="num">{resourceList.inNetworkNum}</span>
                </p>
                <p>
                  <span className="pr-s">工单数</span>
                  <span className="num">{resourceList.inNetworkONum}</span>
                </p>
              </div>
            </div>
            <div className="items item4">
              <div className="itemsTitle">替换</div>
              <img src={wirei4} className="itemsImg4" />
              <div className="msg">
                <p>
                  <span className="pr-s">资源数</span>
                  <span className="num">{resourceList.replaceNum}</span>
                </p>
                <p>
                  <span className="pr-s">工单数</span>
                  <span className="num">{resourceList.replaceONum}</span>
                </p>
              </div>
            </div>
            <div className="items item5">
              <div className="itemsTitle">退网</div>
              <img src={wirei5} className="itemsImg5" />
              <div className="msg">
                <p>
                  <span className="pr-s">资源数</span>
                  <span className="num">{resourceList.backoutNum}</span>
                </p>
                <p>
                  <span className="pr-s">工单数</span>
                  <span className="num">{resourceList.backoutONum}</span>
                </p>
              </div>
            </div>
            <div className="arrow arrow1"></div>
            <div className="arrow arrow2"></div>
            <div className="arrow arrow3"></div>
            <div className="arrow arrow4"></div>
            <div className="arrow arrow5"></div>
          </div>
        </div>
      </ResourceBox>
    </>
  );
}
export default ResourceLifecycle;
