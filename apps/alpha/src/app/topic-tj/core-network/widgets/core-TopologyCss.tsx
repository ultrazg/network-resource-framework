import styled from 'styled-components';
import bg1 from '../images/bg1.svg';
import bg2 from '../images/bg2.svg';
import bg3 from '../images/bg3.svg';
import bg4 from '../images/bg4.svg';
import bg5 from '../images/bg5.svg';
import bg6 from '../images/bg6.svg';
import bg7 from '../images/bg7.svg';
import building from '../images/building.svg';
import title1 from '../images/text_icon.svg';
import title2 from '../images/text_icon2.svg';
import arrow from '../images/active_icon.svg';
import line1 from '../images/line1.png';
import line2 from '../images/line2.png';
import psLine1 from '../images/psLine1.png';
import psLine2 from '../images/psLine2.png';
import psLine3 from '../images/psLine3.png';
import psLine4 from '../images/psLine4.png';
import psLine5 from '../images/psLine5.png';
import psLine6 from '../images/psLine6.png';
import psLine7 from '../images/psLine7.png';
import psLine_5G_BSF from '../images/five_5g_1.png';
import psLine_5G_AM from '../images/five_5g_2.png';
import psLine_5G_UDM from '../images/five_5g_3.png';
import psLine_5G_SMFF from '../images/five_5g_4.png';
import psLine_5G_UPF from '../images/five_5g_5.png';
import psLine_5G_NSSF from '../images/five_5g_6.png';
import psLine_5G_PCF from '../images/five_5g_9.png';

import psLine_5G_SBC from '../images/IMS_5g_1.png';
import psLine_5G_S_I_CSCF from '../images/IMS_5g_2.png';
import psLine_5G_MGCF from '../images/IMS_5g_3.png';
import psLine_5G_IMMGW from '../images/IMS_5g_4.png';
import psLine_5G_AS from '../images/IMS_5g_5.png';
const TopologyView = styled.div`          
    margin:0;
    padding:0;
    p{
      margin-block-start: 16px;
      margin-block-end: 16px;
    }
    .Topology{
        position: relative;
        margin-top: 170px;
        .header{
            width: 62px;
            height: 62px;
            top: 17px;
            left: 621px;
            position:absolute;
            cursor: pointer;
            z-index:999;
        }
        .bottom{
          width: 62px;
          height: 59px;
          bottom: 17px;
          left: 401px;
          position:absolute;
          cursor: pointer;
          z-index:999;
        } 
        .bg{
            width:1185.5px;
            height:686.86px;
            background-size: 100% 100%;
        }
        .buildingBg{
          background: url(${building}) no-repeat center center;
          z-index:998;
          position: absolute;
          top: -10px;
          left: -26px;
        }
        .bg1{
            background: url(${bg1}) no-repeat center center;
        }
        .bg2{
            background: url(${bg2}) no-repeat center center;
        }
        .bg3{
            background: url(${bg3}) no-repeat center center;
        }
        .bg4{
            background: url(${bg4}) no-repeat center center;
        }
        .bg5{
            background: url(${bg5}) no-repeat center center;
        }
        .bg6{
            background: url(${bg6}) no-repeat center center;
        }
        .bg7{
          background: url(${bg7}) no-repeat center center;
          position: absolute;
        }
        .title{
            width:49.12px;
            height:17.19px;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
            background: url(${title1}) no-repeat center center;
            background-size: 100% 100%;
            position:absolute;
            cursor: pointer;
            z-index:999;
        }
        .activeTitle{
            width:49.12px;
            height:17.19px;
            text-align: center;
            line-height: 17.19px;
            font-size: 12px;
            background: url(${title2}) no-repeat center center;
            background-size: 100% 100%;
            position:absolute;
            cursor: pointer;
        }
        .title1{
            left: 381.55px;
            top: 68px;
        }
        .title2{
            left: 85.52px;
            top: 482.76px;
            transform: rotate(29.72deg);
        }
        .title3{
            left: 616.18px;
            top: 579.4px;
            transform: rotate(29.92deg);
        }
        .title4{
            left: 853px;
            top: 268.65px;
            transform: rotate(29.92deg);
        }
        .title5{
          left: 189px;
          top: 464.65px;
          transform: rotate(29.92deg);
          z-index:1000;
        }
        >p{
            position:absolute;
            padding:0;
            margin:0;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            height:83px;
            border-radius: 36px;
            cursor: pointer;
            z-index:999;
            span{
                font-size: 14px;
                font-weight: 400;
                position: relative;
                padding: 0 16px;
                &::before,&::after{
                  position: absolute;
                  top:4px;
                  content: '';
                  width: 11px;
                  height: 10px;
                  background: url(${arrow}) no-repeat center center;
                  background-size: 100% 100%;
                  opacity:0;
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
        .activeClass{
            position: relative;
            padding: 0 16px;
            color: #FFB41F;
            font-weight: 700;
            &::before,&::after{
              position: absolute;
              top:4px;
              content: '';
              width: 11px;
              height: 10px;
              background: url(${arrow}) no-repeat center center;
              background-size: 100% 100%;
              opacity:1;
            }
            &::after{
              right: 0;
            }
            &::before{
              left: 0;
              transform: rotate(180deg);
            }
        }
        .headerBall{
          position: absolute;
          width:1185.5px;
          height:686.86px;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: 114px;
            left: 471px;
            animation: headerBall1 5s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: 114px;
            left: 471px;
            animation: headerBall1 5s linear .35s infinite;
          }
          p:nth-of-type(3){
            top: 114px;
            left: 471px;
            animation: headerBall1 5s linear .6s infinite;
          }
          p:nth-of-type(4){
            top: 114px;
            left: 471px;
            animation: headerBall1 5s linear .85s infinite;
          }
          @keyframes headerBall1{
            0% {
              top: 116px;
              left: 471px;
            }
            100% {
              top: 42px;
              left: 617px;
            }
          }
          p:nth-of-type(5){
            top: 311px;
            left: 373px;
            animation: headerBall2 10s linear .1s infinite;
          }
          p:nth-of-type(6){
            top: 311px;
            left: 373px;
            animation: headerBall2 10s linear .35s infinite;
          }
          p:nth-of-type(7){
            top: 311px;
            left: 373px;
            animation: headerBall2 10s linear .6s infinite;
          }
          p:nth-of-type(8){
            top: 311px;
            left: 373px;
            animation: headerBall2 10s linear .85s infinite;
          }
          @keyframes headerBall2{
            0% {
              top: 311px;
              left: 373px;
            }
            100% {
              top: 63px;
              left: 645.5px;
            }
          }
          p:nth-of-type(9){
            top: 356px;
            left: 811.6px;
            animation: headerBall3 10s linear .1s infinite;
          }
          p:nth-of-type(10){
            top: 356px;
            left: 811.6px;
            animation: headerBall3 10s linear .35s infinite;
          }
          p:nth-of-type(11){
            top: 356px;
            left: 811.6px;
            animation: headerBall3 10s linear .6s infinite;
          }
          p:nth-of-type(12){
            top: 356px;
            left: 811.6px;
            animation: headerBall3 10s linear .85s infinite;
          }
          @keyframes headerBall3{
            0% {
              top: 356px;
              left: 811.6px;
            }
            100% {
              top: 63px;
              left: 652.6px;
            }
          }
          p:nth-of-type(13){
            top: 97px;
            left: 895px;
            animation: headerBall4 5s linear .1s infinite;
          }
          p:nth-of-type(14){
            top: 97px;
            left: 895px;
            animation: headerBall4 5s linear .3s infinite;
          }
          p:nth-of-type(15){
            top: 97px;
            left: 895px;
            animation: headerBall4 5s linear .5s infinite;
          }
          p:nth-of-type(16){
            top: 97px;
            left: 895px;
            animation: headerBall4 5s linear .7s infinite;
          }
          @keyframes headerBall4{
            0% {
              top: 97px;
              left: 895px;
            }
            100% {
              top: 41.5px;
              left: 681px;
            }
          }
        }
        .bottomBall{
          position: absolute;
          width:1185.5px;
          height:686.86px;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: 143px;
            left: 302px;
            animation: bottomBall1 15s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: 143px;
            left: 302px;
            animation: bottomBall1 15s linear .22s infinite;
          }
          p:nth-of-type(3){
            top: 143px;
            left: 302px;
            animation: bottomBall1 15s linear .34s infinite;
          }
          p:nth-of-type(4){
            top: 143px;
            left: 302px;
            animation: bottomBall1 15s linear .46s infinite;
          }
          @keyframes bottomBall1{
            0% {
              top: 143.3px;
              left: 302px;
            }
            25%{
              top: 143.3px;
              left: -1px;
            }
            65%{
              top: 632.5px;
              left: -1px;
            }
            100% {
              top: 633px;
              left: 392px;
            }
          }
          p:nth-of-type(5){
            top: 488px;
            left: 303.6px;
            animation: bottomBall2 4s linear .1s infinite;
          }
          p:nth-of-type(6){
            top: 488px;
            left: 303.6px;
            animation: bottomBall2 4s linear .32s infinite;
          }
          p:nth-of-type(7){
            top: 488px;
            left: 303.6px;
            animation: bottomBall2 4s linear .54s infinite;
          }
          p:nth-of-type(8){
            top: 488px;
            left: 303.6px;
            animation: bottomBall2 4s linear .76s infinite;
          }
          @keyframes bottomBall2{
            0% {
              top: 488px;
              left: 303.6px;
            }
            100% {
              top: 633px;
              left: 392.6px;
            }
          }
          p:nth-of-type(9){
            top: 537.6px;
            left: 615.6px;
            animation: bottomBall3 4s linear .1s infinite;
          }
          p:nth-of-type(10){
            top: 537.6px;
            left: 615.6px;
            animation: bottomBall3 4s linear .32s infinite;
          }
          p:nth-of-type(11){
            top: 537.6px;
            left: 615.6px;
            animation: bottomBall3 4s linear .54s infinite;
          }
          p:nth-of-type(12){
            top: 537.6px;
            left: 615.6px;
            animation: bottomBall3 4s linear .76s infinite;
          }
          @keyframes bottomBall3{
            0% {
              top: 537.6px;
              left: 615.6px;
            }
            100% {
              top: 631px;
              left: 467.6px;
            }
          }
          p:nth-of-type(13){
            top: 177px;
            left: 1156px;
            animation: bottomBall4 15s linear .1s infinite;
          }
          p:nth-of-type(14){
            top: 177px;
            left: 1156px;
            animation: bottomBall4 15s linear .22s infinite;
          }
          p:nth-of-type(15){
            top: 177px;
            left: 1156px;
            animation: bottomBall4 15s linear .34s infinite;
          }
          p:nth-of-type(16){
            top: 177px;
            left: 1156px;
            animation: bottomBall4 15s linear .46s infinite;
          }
          @keyframes bottomBall4{
            0% {
              top: 177px;
              left: 1156px;
            }
            3%{
              top: 177px;
              left: 1183.4px;
            }
            43%{
              top: 632px;
              left: 1183.4px;
            }
            100% {
              top: 632px;
              left: 466.4px;
            }
          }
        }
        .line1{
          position: absolute;
          width: 164.5px;
          height: 117px;
          top: 151px;
          left: 264px;
          background: url(${line1}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            top: 110px;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            animation: actionAnimation1 6s linear .1s infinite;
          }
          p:nth-of-type(2){
            animation: actionAnimation1 6s linear .35s infinite;
          }
          p:nth-of-type(3){
            animation: actionAnimation1 6s linear .6s infinite;
          }
          p:nth-of-type(4){
            animation: actionAnimation1 6s linear .85s infinite;
          }
          @keyframes actionAnimation1{
            0% {
              left: 1px;
              top: 110px;
            }
            15% {
                left: 1px;
                top: 79px;
            }
            43% {
                left: 55px;
                top: 79px;
            }
            82% {
                left: 55px;
                top: -4px;
            }
            100% {
                left: 79px;
                top: -16.5px;
            }
          }
          p:nth-of-type(5){
            top: -11px;
            left: 101px;
            animation: actionAnimation2 3s linear .1s infinite;
          }
          p:nth-of-type(6){
            top: -11px;
            left: 101px;
            animation: actionAnimation2 3s linear .37s infinite;
          }
          p:nth-of-type(7){
            top: -11px;
            left: 101px;
            animation: actionAnimation2 3s linear .64s infinite;
          }
          p:nth-of-type(8){
            top: -11px;
            left: 101px;
            animation: actionAnimation2 3s linear .91s infinite;
          }
          @keyframes actionAnimation2{
            0% {
              top: 3px;
              left: 162.8px;
            }
            30% {
              top: 14.5px;
              left: 144px;
            }
            100% {
              top: -11px;
              left: 101px;
            }
          }    
        }
        .line2{
          position: absolute;
          width: 62.5px;
          height: 30.5px;
          top: 156px;
          left: 362px;
          background: url(${line2}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            top: -16px;
            left: 0px;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            animation: actionAnimation3 3s linear .1s infinite;
          }
          p:nth-of-type(2){
            animation: actionAnimation3 3s linear .37s infinite;
          }
          p:nth-of-type(3){
            animation: actionAnimation3 3s linear .64s infinite;
          }
          p:nth-of-type(4){
            animation: actionAnimation3 3s linear .91s infinite;
          }
          @keyframes actionAnimation3{
            0% {
              top: -16px;
              left: 0px;
            }
            70% {
              top: 10px;
              left: 42px;
            }
            100% {
              top: 1px;
              left: 58px;
            }
          }   
        }
        .psLine1{
          position: absolute;
          width: 201.5px;
          height: 150.5px;
          top: 270.5px;
          left: 53px;
          background: url(${psLine1}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: 5px;
            left: 199px;
            animation: psLineAnimation1_1 6s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: 5px;
            left: 199px;
            animation: psLineAnimation1_1 6s linear .28s infinite;
          }
          p:nth-of-type(3){
            top: 5px;
            left: 199px;
            animation: psLineAnimation1_1 6s linear .46s infinite;
          }
          p:nth-of-type(4){
            top: 5px;
            left: 199px;
            animation: psLineAnimation1_1 6s linear .64s infinite;
          }
          @keyframes psLineAnimation1_1{
            0% {
              top: 5px;
              left: 199px;
            }
            20% {
              top: -15.5px;
              left: 162px;
            }
            95% {
              top: 75.5px;
              left: 2px;
            }
            100% {
              top: 86.5px;
              left: 11px;
            }
          }
          p:nth-of-type(5){
            top: 131px;
            left: 83px;
            animation: psLineAnimation1_2 1.8s linear .1s infinite;
          }
          p:nth-of-type(6){
            top: 131px;
            left: 83px;
            animation: psLineAnimation1_2 1.8s linear .4s infinite;
          }
          p:nth-of-type(7){
            top: 131px;
            left: 83px;
            animation: psLineAnimation1_2 1.8s linear .7s infinite;
          }
          p:nth-of-type(8){
            top: 131px;
            left: 83px;
            animation: psLineAnimation1_2 1.8s linear 1s infinite;
          }
          @keyframes psLineAnimation1_2{
            0% {
              top: 131px;
              left: 83px;
            }
            100% {
              top: 110px;
              left: 51px;
            }
          }
        }
        .psLine2{
          position: absolute;
          width: 182.5px;
          height: 92.5px;
          top: 297px;
          left: 157px;
          background: url(${psLine2}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: 56px;
            left: 176px;
            animation: pslineAnimation2 5s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: 56px;
            left: 176px;
            animation: pslineAnimation2 5s linear .3s infinite;
          }
          p:nth-of-type(3){
            top: 56px;
            left: 176px;
            animation: pslineAnimation2 5s linear .5s infinite;
          }
          p:nth-of-type(4){
            top: 56px;
            left: 176px;
            animation: pslineAnimation2 5s linear .7s infinite;
          }
          @keyframes pslineAnimation2{
            0% {
              top: 56px;
              left: 176px;
            }
            3% {
              top: 52px;
              left: 179px;
            }
            80% {
              top: -16px;
              left: 59px;
            }
            100% {
              top: 1.6px;
              left: 33px;
            }
          }
          p:nth-of-type(5){
            top: 67px;
            left: 1.6px;
            animation: pslineAnimation2_1 1.5s linear .1s infinite;
          }
          p:nth-of-type(6){
            top: 67px;
            left: 1.6px;
            animation: pslineAnimation2_1 1.5s linear .32s infinite;
          }
          p:nth-of-type(7){
            top: 67px;
            left: 1.6px;
            animation: pslineAnimation2_1 1.5s linear .54s infinite;
          }
          p:nth-of-type(8){
            top: 67px;
            left: 1.6px;
            animation: pslineAnimation2_1 1.5s linear .76s infinite;
          }
          @keyframes pslineAnimation2_1{
            0% {
              top: 67px;
              left: 2.6px;
            }
            100% {
              top: 25px;
              left: 8px;
            }
          }
        }
        .psLine3_1{
          position: absolute;
          width: 7px;
          height: 47px;
          top: 379px;
          left: 252px;
          background: url(${psLine3}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            top: 110px;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: 24px;
            left: 1.3px;
            animation: pslineAnimation3_1 1.5s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: 24px;
            left: 1.3px;
            animation: pslineAnimation3_1 1.5s linear .34s infinite;
          }
          p:nth-of-type(3){
            top: 24px;
            left: 1.3px;
            animation: pslineAnimation3_1 1.5s linear .58s infinite;
          }
          p:nth-of-type(4){
            top: 24px;
            left: 1.3px;
            animation: pslineAnimation3_1 1.5s linear .82s infinite;
          }
          @keyframes pslineAnimation3_1{
            0% {
              top: 24px;
              left: 1.3px;
            }
            100% {
              top: -15px;
              left: 3.3px;
            }
          }
        }
        .psLine3_2{
          position: absolute;
          width: 7px;
          height: 47px;
          top: 379px;
          left: 252px;
          background: url(${psLine3}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: -15px;
            left: 3.3px;
            animation: pslineAnimation3_2 1.5s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: -15px;
            left: 3.3px;
            animation: pslineAnimation3_2 1.5s linear .34s infinite;
          }
          p:nth-of-type(3){
            top: -15px;
            left: 3.3px;
            animation: pslineAnimation3_2 1.5s linear .58s infinite;
          }
          p:nth-of-type(4){
            top: -15px;
            left: 3.3px;
            animation: pslineAnimation3_2 1.5s linear .82s infinite;
          }
          @keyframes pslineAnimation3_2{
            0% {
              top: -15px;
              left: 3.3px;
            }
            100% {
              top: 24px;
              left: 1.3px;
            }
          }
        }
        .psLine4{
          position: absolute;
          width: 615px;
          height: 341.5px;
          top: 213px;
          left: 303px;
          background: url(${psLine4}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: -16px;
            left: 611px;
            animation: pslineAnimation4 10s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: -16px;
            left: 611px;
            animation: pslineAnimation4 10s linear .25s infinite;
          }
          p:nth-of-type(3){
            top: -16px;
            left: 611px;
            animation: pslineAnimation4 10s linear .4s infinite;
          }
          p:nth-of-type(4){
            top: -16px;
            left: 611px;
            animation: pslineAnimation4 10s linear .55s infinite;
          }
          @keyframes pslineAnimation4{
            0% {
              top: -16px;
              left: 611px;
            }
            10% {
              top: -16px;
              left: 550px;
            }
            15% {
              top: 16px;
              left: 550px;
            }
            100% {
              top: 119px;
              left: 58px;
            }
          }
          p:nth-of-type(5){
            top: 232px;
            left: 392px;
            animation: pslineAnimation4_2 9s linear .1s infinite;
          }
          p:nth-of-type(6){
            top: 232px;
            left: 392px;
            animation: pslineAnimation4_2 9s linear .3s infinite;
          }
          p:nth-of-type(7){
            top: 232px;
            left: 392px;
            animation: pslineAnimation4_2 9s linear .5s infinite;
          }
          p:nth-of-type(8){
            top: 232px;
            left: 392px;
            animation: pslineAnimation4_2 9s linear .7s infinite;
          }
          @keyframes pslineAnimation4_2{
            0% {
              top: 232px;
              left: 392px;
            }
            5% {
              top: 225px;
              left: 377.6px;
            }
            10% {
              top: 204px;
              left: 377.6px;
            }
            70%{
              top: 204px;
              left: 126.6px;
            }
            80%{
              top: 167px;
              left: 126.6px;
            }
            100% {
              top: 125.6px;
              left: 55px;
            }
          }
          p:nth-of-type(9){
            top: 148px;
            left: 4px;
            animation: pslineAnimation4_3 1.8s linear .1s infinite;
          }
          p:nth-of-type(10){
            top: 148px;
            left: 4px;
            animation: pslineAnimation4_3 1.8s linear .34s infinite;
          }
          p:nth-of-type(11){
            top: 148px;
            left: 4px;
            animation: pslineAnimation4_3 1.8s linear .58s infinite;
          }
          p:nth-of-type(12){
            top: 148px;
            left: 4px;
            animation: pslineAnimation4_3 1.8s linear .82s infinite;
          }
          @keyframes pslineAnimation4_3{
            0% {
              top: 148px;
              left: 4px;
            }
            100% {
              top: 121px;
              left: 39px;
            }
          }
        }
        .psLine5{
          position: absolute;
          width: 154px;
          height: 86px;
          top: 297px;
          left: 192px;
          background: url(${psLine5}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: 38px;
            left: 151px;        
            animation: pslineAnimation5_1 1.8s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: 38px;
            left: 151px;        
            animation: pslineAnimation5_1 1.8s linear .34s infinite;
          }
          p:nth-of-type(3){
            top: 38px;
            left: 151px;        
            animation: pslineAnimation5_1 1.8s linear .58s infinite;
          }
          p:nth-of-type(4){
            top: 38px;
            left: 151px;        
            animation: pslineAnimation5_1 1.8s linear .82s infinite;
          }
          @keyframes pslineAnimation5_1{
            0% {
              top: 38px;
              left: 151px;          
            }
            100% {
              top: 66px;
              left: 114px;
            }
          }
          p:nth-of-type(5){
            top: 2px;
            left: 0px;        
            animation: pslineAnimation5_2 6s linear .1s infinite;
          }
          p:nth-of-type(6){
            top: 2px;
            left: 0px;       
            animation: pslineAnimation5_2 6s linear .35s infinite;
          }
          p:nth-of-type(7){
            top: 2px;
            left: 0px;        
            animation: pslineAnimation5_2 6s linear .6s infinite;
          }
          p:nth-of-type(8){
            top: 2px;
            left: 0px;       
            animation: pslineAnimation5_2 6s linear .85s infinite;
          }
          @keyframes pslineAnimation5_2{
            0% {
              top: 2px;
              left: 0px; 
            }
            20% {
              top: -15.7px;
              left: 28px;
            }
            97% {
              top: 51.3px;
              left: 148px;
            }
            100% {
              top: 57.3px;
              left: 143px;
            }
          }
        }
        .psLine6{
          position: absolute;
          width: 63.5px;
          height: 82px;
          top: 337px;
          left: 106px;
          background: url(${psLine6}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: -15px;
            left: 60px;
            animation: pslineAnimation6_1 1.5s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: -15px;
            left: 60px;
            animation: pslineAnimation6_1 1.5s linear .32s infinite;
          }
          p:nth-of-type(3){
            top: -15px;
            left: 60px;
            animation: pslineAnimation6_1 1.5s linear .54s infinite;
          }
          p:nth-of-type(4){
            top: -15px;
            left: 60px;
            animation: pslineAnimation6_1 1.5s linear .76s infinite;
          }
          @keyframes pslineAnimation6_1{
            0% {
              top: -15px;
              left: 60px;
            }
            100% {
              top: 32px;
              left: 54px;
            }
          }
          p:nth-of-type(5){
            top: 42px;
            left: 0px;
            animation: psLineAnimation6_2 1.8s linear .1s infinite;
          }
          p:nth-of-type(6){
            top: 42px;
            left: 0px;
            animation: psLineAnimation6_2 1.8s linear .4s infinite;
          }
          p:nth-of-type(7){
            top: 42px;
            left: 0px;
            animation: psLineAnimation6_2 1.8s linear .7s infinite;
          }
          p:nth-of-type(8){
            top: 42px;
            left: 0px;
            animation: psLineAnimation6_2 1.8s linear 1s infinite;
          }
          @keyframes psLineAnimation6_2{
            0% {
              top: 42px;
              left: 0px;
            }
            100% {
              top: 62px;
              left: 31px;
            }
          }
        }
        .psLine7{
          position: absolute;
          width: 283px;
          height: 231px;
          top: 147px;
          left: 62px;
          background: url(${psLine7}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            top: -13px;
            left: 273px;
            animation: psLineAnimation7 6s linear .1s infinite;
          }
          p:nth-of-type(2){
            top: -13px;
            left: 273px;
            animation: psLineAnimation7 6s linear .35s infinite;
          }
          p:nth-of-type(3){
            top: -13px;
            left: 273px;
            animation: psLineAnimation7 6s linear .6s infinite;
          }
          p:nth-of-type(4){
            top: -13px;
            left: 273px;
            animation: psLineAnimation7 6s linear .85s infinite;
          }
          @keyframes psLineAnimation7{
            0% {
              top: -13px;
              left: 273px;
            }
            18% {
                top: -3px;
                left: 257.8px;
            }
            57% {
                top: 82.6px;
                left: 257.8px;
            }
            85% {
                top: 82.6px;
                left: 208px;
            }
            100% {
                top: 97px;
                left: 208px;
            }
          }
          p:nth-of-type(5){
            top: 203px;
            left: 5px;
            animation: psLineAnimation7_2 6s linear .1s infinite;
          }
          p:nth-of-type(6){
            top: 203px;
            left: 5px;
            animation: psLineAnimation7_2 6s linear .3s infinite;
          }
          p:nth-of-type(7){
            top: 203px;
            left: 5px;
            animation: psLineAnimation7_2 6s linear .5s infinite;
          }
          p:nth-of-type(8){
            top: 203px;
            left: 5px;
            animation: psLineAnimation7_2 6s linear .7s infinite;
          }
          @keyframes psLineAnimation7_2{
            0% {
              top: 203px;
              left: 5px;
            }
            5% {
                top: 198px;
                left: 5px;
            }
            80% {
                top: 105px;
                left: 150px;
            }
            100% {
                top: 125.4px;
                left: 182.5px;
            }
          }
        }
        .IPB{
          top: -6px;
          left: 563px;
          height: 0;
        }
        .wifi{
          top: 589px;
          left: 369px;
          height: 0;
          position: relative;
        }
        .MGW{
          top: 101px;
          left: 318px;      
        }
        .MSC-server{
          top: 100px;
          left: 381px;
        }
        .HLR{
          top: 243px;
          left: 223px;
        }
        .HSS{
          top:288px;
          left:314px;
        }
        .CG{
          top: 272px;
          left: 149px;
        }
        .SGW_PGW{
          top: 324px;
          left: 197px;
        }
        .MME{
          top:356px;
          left:275px;
        }
        .SGSN{
          top:320px;
          left:51px;
        }
        .GGSN{
          top: 366px;
          left: 121px;
        }
        .PCRF{
          top: 398px;
          left: 206px;
        }
        .IMMGW{
          top: 79px;
          left: 936px;
        }
        .MGCF{
          top: 98px;
          left: 1012px;
        }
        .AS{
          top: 108px;
          left: 835px;
        }
        .S_I_CSCF{
          top: 142px;
          left: 886px;
        }
        .SBC{
          top: 174px;
          left: 963px
        }
        .BSF{
          width: 72px;
          top: 356px;
          left: 842px;
        }
        .AMF{
          top: 362px;
          left: 751px;
        }
        .NSSF{
          width: 70px;
          top: 417px;
          left: 810px;
        }
        .UDM{
          top: 417px;
          left: 681px;
          width: 76px;
        }
        .PCF{
          width: 60px;
          height: 75px;
          top: 458px;
          left: 764px;
        }
        .UPF_U{
          height: 70px;
          width: 84px;
          top: 466px;
          left: 612px;
        }
        .SMFF_C{
          top: 502px;
          left: 675px;
          height: 70px;
        }
        .psLine_5G_UPF_U{
          position: absolute;
          width: 42px;
          height: 25px;
          bottom: 138px;
          right: 480px;
          background: url(${psLine_5G_UPF}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            left: 37px;
            top: 3px;
            animation: actionAnimationUPF1 1.5s linear .1s infinite;
          }
          p:nth-of-type(2){
            left: 37px;
            top: 3px;
            animation: actionAnimationUPF1 1.5s linear .35s infinite;
          }
          p:nth-of-type(3){
            left: 37px;
            top: 3px;
            animation: actionAnimationUPF1 1.5s linear .6s infinite;
          }
          p:nth-of-type(4){
            left: 37px;
            top: 3px;
            animation: actionAnimationUPF1 1.5s linear .85s infinite;
          }
          @keyframes actionAnimationUPF1{
            0% {
              left: 37px;
              top: 5px;
            }
            100% {
                left: -7px;
                top: -20px;
            }
          }
        }
        .psLine_5G_PCF{
          position: absolute;
          width: 179.5px;
          height: 144px;
          bottom: 116px;
          right: 267px;
          background: url(${psLine_5G_PCF}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            bottom: -6px;
            left: 3px;
            animation: actionAnimationPCF1 1.5s linear .1s infinite;
          }
          p:nth-of-type(2){
            bottom: -6px;
            left: 3px;
            animation: actionAnimationPCF1 1.5s linear .37s infinite;
          }
          p:nth-of-type(3){
            bottom: -6px;
            left: 3px;
            animation: actionAnimationPCF1 1.5s linear .64s infinite;
          }
          p:nth-of-type(4){
            bottom: -6px;
            left: 3px;
            animation: actionAnimationPCF1 1.5s linear .9s infinite;
          }
          @keyframes actionAnimationPCF1{
            0% {
              bottom: -5px;
              left: 3px;
            }
            100% {
              bottom: 23px;
              left: 47px;
            }
          }
          p:nth-of-type(5){
            bottom: 115px;
            left: 42px;
            animation: actionAnimationPCF2 1.5s linear .1s infinite;
          }
          p:nth-of-type(6){
            bottom: 111px;
            left: 42px;
            animation: actionAnimationPCF2 1.5s linear .35s infinite;
          }
          p:nth-of-type(7){
            bottom: 111px;
            left: 42px;
            animation: actionAnimationPCF2 1.5s linear .6s infinite;
          }
          p:nth-of-type(8){
            bottom: 111px;
            left: 42px;
            animation: actionAnimationPCF2 1.5s linear .85s infinite;
          }
          @keyframes actionAnimationPCF2{
            0% {
              bottom: 111px;
              left: 42px;
            }
            100% {
                bottom: 71px;
                left: 44.6px;
            }
          }
          p:nth-of-type(9){
            bottom: 123px;
            left: 132px;
            animation: actionAnimationPCF3 6s linear .1s infinite;
          }
          p:nth-of-type(10){
            bottom: 123px;
            left: 132px;
            animation: actionAnimationPCF3 6s linear .35s infinite;
          }
          p:nth-of-type(11){
            bottom: 123px;
            left: 132px;
            animation: actionAnimationPCF3 6s linear .6s infinite;
          }
          p:nth-of-type(12){
            bottom: 123px;
            left: 132px;
            animation: actionAnimationPCF3 6s linear .85s infinite;
          }
          @keyframes actionAnimationPCF3{
            0% {
              bottom: 123px;
              left: 132px;
            }
            5% {
              bottom: 114px;
              left: 127px;
            }
            40%{
              bottom: 85px;
              left: 176px;
            }
            100% {
              bottom: 16px;
              left: 66px;
            }
          }
        }
        .psLine_5G_NSSF{
          position: absolute;
          width: 42px;
          height: 25px;
          bottom: 221px;
          right: 353px;
          background: url(${psLine_5G_NSSF}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            left: 37px;
            top: 3px;
            animation: actionAnimationNSSF 1.8s linear .1s infinite;
          }
          p:nth-of-type(2){
            left: 37px;
            top: 3px;
            animation: actionAnimationNSSF 1.8s linear .35s infinite;
          }
          p:nth-of-type(3){
            left: 37px;
            top: 3px;
            animation: actionAnimationNSSF 1.8s linear .6s infinite;
          }
          p:nth-of-type(4){
            left: 37px;
            top: 3px;
            animation: actionAnimationNSSF 1.8s linear .85s infinite;
          }
          @keyframes actionAnimationNSSF{
            0% {
              left: -7px;
              top: -19.4px;
            }
            100% {
              left: 37px;
              top: 4.4px;
            }
          }
        }
        .psLine_5G_BSF{
          position: absolute;
          width: 264px;
          height: 297px;
          bottom: 150px;
          background: url(${psLine_5G_BSF}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            left: 0;
            bottom: -16px;
            animation: actionAnimation5G1 5s linear .1s infinite;
          }
          p:nth-of-type(2){
            left: 0;
            bottom: -16px;
            animation: actionAnimation5G1 5s linear .32s infinite;
          }
          p:nth-of-type(3){
            left: 0;
            bottom: -16px;
            animation: actionAnimation5G1 5s linear .54s infinite;
          }
          p:nth-of-type(4){
            left: 0;
            bottom: -16px;
            animation: actionAnimation5G1 5s linear .76s infinite;
          }
          @keyframes actionAnimation5G1{
            0% {
              left: 0;
              bottom: -16px;
            }
            60% {
                left: 109px;
                bottom: 52px;
            }
            88% {
                left: 57px;
                bottom: 82px;
            }
            100% {
                left: 78px;
                bottom: 104px;
            }
          }
          p:nth-of-type(5){
            animation: actionAnimation5G2 6s linear .1s infinite;
          }
          p:nth-of-type(6){
            animation: actionAnimation5G2 6s linear .3s infinite;
          }
          p:nth-of-type(7){
            animation: actionAnimation5G2 6s linear .5s infinite;
          }
          p:nth-of-type(8){
            animation: actionAnimation5G2 6s linear .7s infinite;
          }
          @keyframes actionAnimation5G2{
            0% {
              top: -12px;
              right: 57px;
            }
            7.5% {
                top: -3px;
                right: 41.6px;
            }
            50% {
                top: 99px;
                right: 41.6px;
            }
            74% {
                top: 99px;
                right: 114.6px;
            }
            86% {
                top: 148.6px;
                right: 114.6px;
            }
            100% {
                top: 158.6px;
                right: 160px;
            }
          } 
        }
        .psLine_5G_BSF_1{
          right: 116px;
        }
        .psLine_5G_BSF_2{
          right: 112px;
        }
        .psLine_5G_AMF{
          position: absolute;
          width: 81px;
          height: 49.5px;
          bottom: 205px;
          right: 353px;
          background: url(${psLine_5G_AM}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            left: 0;
            bottom: 4px;
            animation: actionAnimation5G3 1.4s linear .1s infinite;
          }
          p:nth-of-type(2){
            left: 0;
            bottom: 4px;
            animation: actionAnimation5G3 1.4s linear .35s infinite;
          }
          p:nth-of-type(3){
            left: 0;
            bottom: 4px;
            animation: actionAnimation5G3 1.4s linear .6s infinite;
          }
          p:nth-of-type(4){
            left: 0;
            bottom: 4px;
            animation: actionAnimation5G3 1.4s linear .85s infinite;
          }
          @keyframes actionAnimation5G3{
            0% {
              left: 0;
              bottom: 4.6px;
            }
            100% {
              left: 30px;
              bottom: 28.6px;
            }
          }
          p:nth-of-type(5){
            bottom: -22px;
            left: 32px;
            animation: actionAnimation5G4 2.2s linear .1s infinite;
          }
          p:nth-of-type(6){
            bottom: -22px;
            left: 32px;
            animation: actionAnimation5G4 2.2s linear .35s infinite;
          }
          p:nth-of-type(7){
            bottom: -22px;
            left: 32px;
            animation: actionAnimation5G4 2.2s linear .6s infinite;
          }
          p:nth-of-type(8){
            bottom: -22px;
            left: 32px;
            animation: actionAnimation5G4 2.2s linear .85s infinite;
          }
          @keyframes actionAnimation5G4{
            0% {
              bottom: -22px;
              left: 32px;
            }
            100% {
                bottom: 50px;
                left: 26px;
            }
          } 
          p:nth-of-type(9){
            right: 0;
            top: 14px;
            animation: actionAnimation5G5 1.4s linear .1s infinite;
          }
          p:nth-of-type(10){
            right: 0;
            top: 14px;
            animation: actionAnimation5G5 1.4s linear .35s infinite;
          }
          p:nth-of-type(11){
            right: 0;
            top: 14px;
            animation: actionAnimation5G5 1.4s linear .6s infinite;
          }
          p:nth-of-type(12){
            right: 0;
            top: 14px;
            animation: actionAnimation5G5 1.4s linear .85s infinite;
          }
          @keyframes actionAnimation5G5{
            0% {
              right: 0;
              top: 14px;
            }
            100% {
              right: 36px;
              top: -6.6px;
            }
          }
        }
        .psLine_5G_UDM{
          position: absolute;
          width: 441px;
          height: 274.5px;
          bottom: 131.2px;
          right: 402px;
          background: url(${psLine_5G_UDM}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            left: 15px;
            top: 58px;
            animation: actionAnimation5G6 9s linear .1s infinite;
          }
          p:nth-of-type(2){
            left: 15px;
            top: 58px;
            animation: actionAnimation5G6 9s linear .3s infinite;
          }
          p:nth-of-type(3){
            left: 15px;
            top: 58px;
            animation: actionAnimation5G6 9s linear .5s infinite;
          }
          p:nth-of-type(4){
            left: 15px;
            top: 58px;
            animation: actionAnimation5G6 9s linear .7s infinite;
          }
          @keyframes actionAnimation5G6{
            0% {
              left: 15px;
              top: 58px;
            }
            20% {
                left: 87px;
                top: 100px;
            }
            30% {
                left: 87px;
                top: 137px;
            }
            90% {
                left: 338px;
                top: 137px;
            }
            95% {
                left: 337px;
                top: 157px;
            }
            100% {
                left: 353px;
                top: 165.4px;
            }
          }
          p:nth-of-type(5){
            right: 0;
            bottom: 93px;
            animation: actionAnimation5G7 1.5s linear .1s infinite;
          }
          p:nth-of-type(6){
            right: 0;
            bottom: 93px;
            animation: actionAnimation5G7 1.5s linear .37s infinite;
          }
          p:nth-of-type(7){
            right: 0;
            bottom: 93px;
            animation: actionAnimation5G7 1.5s linear .64s infinite;
          }
          p:nth-of-type(8){
            right: 0;
            bottom: 93px;
            animation: actionAnimation5G7 1.5s linear .9s infinite;
          }
          @keyframes actionAnimation5G7{
            0% {
              right: -3px;
              bottom: 97.6px;
            }
            100% {
                right: 30px;
                bottom: 71px;
            }
          }
        }
        .psLine_5G_SMFF{
          position: absolute;
          width: 125px;
          height: 53px;
          bottom: 115px;
          right: 396px;
          background: url(${psLine_5G_SMFF}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            left: -7px;
            top: -18px;
            animation: actionAnimation5G8 1.5s linear .1s infinite;
          }
          p:nth-of-type(2){
            left: -7px;
            top: -18px;
            animation: actionAnimation5G8 1.5s linear .37s infinite;
          }
          p:nth-of-type(3){
            left: -7px;
            top: -18px;
            animation: actionAnimation5G8 1.5s linear .64s infinite;
          }
          p:nth-of-type(4){
            left: -7px;
            top: -18px;
            animation: actionAnimation5G8 1.5s linear .9s infinite;
          }
          @keyframes actionAnimation5G8{
            0% {
              left: -12px;
              top: -17px;
            }
            100% {
                left: 37px;
                top: 12px;
            }
          }
          p:nth-of-type(5){
            right: 0px;
            top: -4px;
            animation: actionAnimation5G9 1.5s linear .1s infinite;
          }
          p:nth-of-type(6){
            right: 0px;
            top: -4px;
            animation: actionAnimation5G9 1.5s linear .37s infinite;
          }
          p:nth-of-type(7){
            right: 0px;
            top: -4px;
            animation: actionAnimation5G9 1.5s linear .64s infinite;
          }
          p:nth-of-type(8){
            right: 0px;
            top: -4px;
            animation: actionAnimation5G9 1.5s linear .9s infinite;
          }
          @keyframes actionAnimation5G9{
            0% {
              right: 0px;
              top: -4px;
            }
            100% {
              right: 41px;
              top: 22px;
            }
          }
        }
        .five-box{
          width: 364px;
          height: 230px;
          bottom: 100px;
          right: 208px;
          position: absolute;
          p{
            position:absolute;
            padding:0;
            margin:0;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            height:83px;
            border-radius: 36px;
            cursor: pointer;
            z-index:999;
            span{
                font-size: 14px;
                font-weight: 400;
                position: relative;
                padding: 0 16px;
                &::before,&::after{
                  position: absolute;
                  top:4px;
                  content: '';
                  width: 11px;
                  height: 10px;
                  background: url(${arrow}) no-repeat center center;
                  background-size: 100% 100%;
                  opacity:0;
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
        }
        .psLine_5G_SBC{
          position: absolute;
          width: 167px;
          height: 238px;
          bottom: 231px;
          background: url(${psLine_5G_SBC}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            bottom: 0;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            animation: actionAnimation5G10 1s linear .2s infinite;
          }
          p:nth-of-type(2){
            animation: actionAnimation5G10 1s linear .4s infinite;
          }
          p:nth-of-type(3){
            animation: actionAnimation5G10 1s linear .6s infinite;
          }
          p:nth-of-type(4){
            animation: actionAnimation5G10 1s linear .8s infinite;
          }
          @keyframes actionAnimation5G10{
            0% {
              left: 28px;
              top: -16px;
            }
            100% {
              left: 55px;
              top: -3px;
            }
          }
          p:nth-of-type(5){
            animation: actionAnimation5G11 6s linear .1s infinite;
          }
          p:nth-of-type(6){
            animation: actionAnimation5G11 6s linear .3s infinite;
          }
          p:nth-of-type(7){
            animation: actionAnimation5G11 6s linear .5s infinite;
          }
          p:nth-of-type(8){
            animation: actionAnimation5G11 6s linear .7s infinite;
          }
          @keyframes actionAnimation5G11{
            0% {
              top: 182px;
              right: 160px;
            }
            20%{
              top: 172px;
              right: 114.6px;
            }
            40% {
              top: 123px;
              right: 114.6px;
            }
            64% {
              top: 123px;
              right: 41.6px;
            }
            92% {
              top: 22px;
              right: 41.6px;
            }
            100% {
              top: 11px;
              right: 57px;
            }
          } 
        }
        .psLine_5G_SBC_1{
          right: 116px;
        }
        .psLine_5G_SBC_2{
          right: 113px;
        }
        .psLine_5G_S_I_CSCF{
          position: absolute;
          width: 682px;
          height: 213px;
          top: 142px;
          right: 143px;
          background: url(${psLine_5G_S_I_CSCF}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            bottom: 0;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            animation: actionAnimation5G12 1s linear .2s infinite;
          }
          p:nth-of-type(2){
            animation: actionAnimation5G12 1s linear .4s infinite;
          }
          p:nth-of-type(3){
            animation: actionAnimation5G12 1s linear .6s infinite;
          }
          p:nth-of-type(4){
            animation: actionAnimation5G12 1s linear .8s infinite;
          }
          @keyframes actionAnimation5G12{
            0% {
              right: 160px;
              top: 29.5px;
            }
            100% {
              top: 46.6px;
              right: 131px;
            }
          }
          p:nth-of-type(5){
            animation: actionAnimation5G13 10s linear .1s infinite;
          }
          p:nth-of-type(6){
            animation: actionAnimation5G13 10s linear .22s infinite;
          }
          p:nth-of-type(7){
            animation: actionAnimation5G13 10s linear .34s infinite;
          }
          p:nth-of-type(8){
            animation: actionAnimation5G13 10s linear .46s infinite;
          }
          @keyframes actionAnimation5G13{
            0% {
              top: 190px;          
              left: 1px;
            }
            80% {
              top: 87px;
              left: 492.6px;
            }
            87%{
              top: 55px;
              left: 492.6px;
            }
            100%{
              left: 554.6px;
              top: 55px;
            }
          }
          p:nth-of-type(9){
            animation: actionAnimation5G14 1s linear .1s infinite;
          }
          p:nth-of-type(10){
            animation: actionAnimation5G14 1s linear .3s infinite;
          }
          p:nth-of-type(11){
            animation: actionAnimation5G14 1s linear .5s infinite;
          }
          p:nth-of-type(12){
            animation: actionAnimation5G14 1s linear .7s infinite;
          }
          @keyframes actionAnimation5G14{
            0% {
              right: 87px;
              top: 69px;
            }
            100%{
              right: 108px;
              top: 58.6px;
            }
          }
          p:nth-of-type(13){
            animation: actionAnimation5G15 2s linear .1s infinite;
          }
          p:nth-of-type(14){
            animation: actionAnimation5G15 2s linear .2s infinite;
          }
          p:nth-of-type(15){
            animation: actionAnimation5G15 2s linear .3s infinite;
          }
          p:nth-of-type(16){
            animation: actionAnimation5G15 2s linear .4s infinite;
          }
          @keyframes actionAnimation5G15{
            0% {
              right: 0px;
              top: 13.6px;
            }
            100%{
              right: 103px;
              top: 59px;
            }
          }
        }
        .psLine_5G_MGCF{
          position: absolute;
          width: 103px;
          height: 111px;
          top: 136px;
          right: 143px;
          background: url(${psLine_5G_MGCF}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            bottom: 0;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            animation: actionAnimation5G16 1s linear .15s infinite;
          }
          p:nth-of-type(2){
            animation: actionAnimation5G16 1s linear .3s infinite;
          }
          p:nth-of-type(3){
            animation: actionAnimation5G16 1s linear .45s infinite;
          }
          p:nth-of-type(4){
            animation: actionAnimation5G16 1s linear .6s infinite;
          }
          @keyframes actionAnimation5G16{
            0% {
              top: -15.6px;
              left: 52px;
            }
            100%{
              top: 5.6px;
              left: 93px;
            }
          }
          p:nth-of-type(5){
            animation: actionAnimation5G17 2s linear .15s infinite;
          }
          p:nth-of-type(6){
            animation: actionAnimation5G17 2s linear .3s infinite;
          }
          p:nth-of-type(7){
            animation: actionAnimation5G17 2s linear .45s infinite;
          }
          p:nth-of-type(8){
            animation: actionAnimation5G17 2s linear .6s infinite;
          }
          @keyframes actionAnimation5G17{
            0% {
              top: 63px;
              left: -2.6px;
            }
            100%{
              top: 19px;
              left: 97px;
            }
          }
        }
        .psLine_5G_IMMGW{
          position: absolute;
          width: 44px;
          height: 25px;
          top: 134px;
          right: 150px;
          background: url(${psLine_5G_IMMGW}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            bottom: 0;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            animation: actionAnimation5G18_1 1s linear .15s infinite;
          }
          p:nth-of-type(2){
            animation: actionAnimation5G18_1 1s linear .3s infinite;
          }
          p:nth-of-type(3){
            animation: actionAnimation5G18_1 1s linear .45s infinite;
          }
          p:nth-of-type(4){
            animation: actionAnimation5G18_1 1s linear .6s infinite;
          }
          @keyframes actionAnimation5G18_1{
            0% {
              top: 6px;
              left: 42px;
            }
            100%{
              top: -16px;
              left: 0px;
            }
          }
        }
        .psLine_5G_AS{
          position: absolute;
          width: 36px;
          height: 22px;
          top: 189px;
          right: 268px;
          background: url(${psLine_5G_AS}) no-repeat center center;
          background-size: 100% 100%;
          overflow: hidden;
          p{
            position: absolute;
            bottom: 0;
            width: 3.4px;
            height: 3.4px;
            background: #FFFFFF;
            border-radius: 50%;
            animation-fill-mode: none;
            animation-play-state: running;
            animation-iteration-count:infinite;
          }
          p:nth-of-type(1){
            animation: actionAnimation5G18 1s linear .15s infinite;
          }
          p:nth-of-type(2){
            animation: actionAnimation5G18 1s linear .3s infinite;
          }
          p:nth-of-type(3){
            animation: actionAnimation5G18 1s linear .45s infinite;
          }
          p:nth-of-type(4){
            animation: actionAnimation5G18 1s linear .6s infinite;
          }
          @keyframes actionAnimation5G18{
            0% {
              top: 7px;
              left: 42px;
            }
            100%{
              top: -16px;
              left: 0px;
            }
          }
        }
    }
`
export default TopologyView;