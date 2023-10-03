
// 核心网-资源上图
import styled from 'styled-components';
import { useEffect, useState } from 'react';
// import { getAllwebData } from '../../api/datasNetwork'
const ResourceTabWrapper = styled.div`
    margin: 22px 0 0 37px;
    img{
      width: 72px;
    }
    .bg{
      opacity: 0.5;
      height: 120px;
      border: 1px solid;
      box-sizing: border-box;
      background: linear-gradient(270deg, rgba(2,144,224,0) 0%, rgba(2,144,224,0.2) 100%);
      border-image: linear-gradient(to top left,rgba(2, 144, 224, 0.35), rgba(2, 144, 224, 0),rgba(2, 144, 224, 0.35)) 1;
    }
    .edge{
      position: absolute;
      top: 36px;
      width: 3px;
      height: 51px;
      background-size: 100%;
      &.edge2{
        transform: rotate(180deg);
        right: 0;
      }
    }
    .top-box{
      width: 462px;
      height: 120px;
      position: relative;
      .info-box{
        position: absolute;
        left: 46px;
        top: 23px;
        display: flex;
        align-items: center;
        .left{
          margin: 0 0 0 14px;
          width: 105px;
        }
        .name{
          font-size: 14px;
          color: #fff;
        }
        .num{
          color: rgba(0,254,255,1);
          font-size: 18px;
          font-family: PMZD;
          margin: 10px 0 0;
        }
        .line{
          width: 1px;
          height: 77px;
          background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1),rgba(255, 255, 255, 0));
          opacity: 0.5;
        }
        .right{
          width: 170px;
          margin: 0 0 0 25px;
        }
      }
    }
    
    pointer-events: auto;
    .datas-tab {
      display: flex;
      justify-content: center;
      .datas-tab-item {
        position: relative;
        width: 248px;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        color: #32C5FF;
        font-weight: bold;
        box-sizing: border-box;
        cursor: pointer;
        img {
            position: absolute;
            z-index: -1;
            width: 100%;
            height: 100%;
        }

        &:nth-child(1) {
          padding-left: 125px;
          margin-right: 8px;
          img {
            left: 0;
          }
        }

        &:nth-child(2) {
          padding-left: 43px;
          img {
            right: 0;
            transform: rotateY(180deg);
          }
        }

        &.active {
            color: #00FCFF;
        }
      }
    }
    .middle-box{
      display: flex;
      margin: 20px 0 0;
      .card{
        width: 211px;
        height: 120px;
        position: relative;
        &:first-child{
          margin: 0 42px 0 0;
        }
      }
      .right{
        width: 110px;
        margin: 0 0 0 10px;
      }
      .info-box{
        position: absolute;
        left: 6px;
        top: 23px;
        display: flex;
        align-items: center;
      }
      .name{
        font-size: 14px;
        color: #fff;
        span{
          color: rgba(0,254,255,1);
          font-size: 14px;
          font-family: PMZD;
          margin-left: 10px;
        }
      }
    }
    .bottom-box{
      width: 462px;
      height: 120px;
      margin: 20px 0 0;
      position: relative;
      .info-box{
        position: absolute;
        top: 12px;
        left: 64px;
        display: flex;
        align-items: center;
        img{
          width: 144px;
          height: 70px;
          margin: -8px 0 0;
        }
        .num{
          color: rgba(0,254,255,1);
          font-size: 20px;
          font-family: PMZD;
          text-align: center;
        }
        .right{
          color: rgba(255,255,255,1);
          font-size: 14px;
          line-height: 22px;
          margin: 0 0 0 17px;
        }
      }
    }
    .tabWrapper {
        width: 353px;
        height: 82px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        cursor: pointer;
        .tabItem {
            flex-shrink: 0;
            width: 77px;
            height: 32px;
            border-radius: 2px;
            opacity: 1;
            border: 1px solid rgba(0,124,255,0.45);
            background: rgba(0,124,255,0.03);
            .itemWrap {
                width: 55px;
                height: 32px;
                margin: 0 auto;
                display: flex;
                justify-content: space-around;
                align-items: center;
                .circle {
                    width: 10px;
                    height: 10px;
                    opacity: 1;
                    border: 1px solid rgba(0,230,255,0.6);
                    background: rgba(0,142,255,0.4);
                }
                .title {
                    opacity: 1;
                    color: rgba(35,130,178,1);
                    font-size: 12px;
                    font-weight: 400;
                    font-family: "Microsoft YaHei";
                }
            }
            // color: rgba(0,252,255,1);
            // border: 1px solid rgba(0,252,255,1);
        }
        .on {
            flex-shrink: 0;
            width: 77px;
            height: 32px;
            border-radius: 2px;
            opacity: 1;
            border: 1px solid rgba(0,252,255,1);
            background: rgba(0,124,255,0.03);
            .itemWrap {
                width: 55px;
                height: 32px;
                margin: 0 auto;
                display: flex;
                justify-content: space-around;
                align-items: center;
                .circle {
                    width: 10px;
                    height: 10px;
                    opacity: 1;
                    border: 1px solid rgba(0,252,255,1);
                    background: rgba(0,142,255,0.4);
                }
                .title {
                    opacity: 1;
                    color: rgba(0,252,255,1);
                    font-size: 12px;
                    font-weight: 400;
                    font-family: "Microsoft YaHei";
                }
            }
        }
        position: absolute;
    top: 85px;
    left: 50%;
    transform: translateX(-50%);
    
    .tabWrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 353px;
        .tabItem {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 77px;
            height: 32px;
            margin-bottom: 18px;
            font-size: 12px;
            color: #2382B2;
            border-radius: 2px;
            border: 1px solid rgba(0, 124, 255, 0.45);
            background: rgba(0,124,255,0.03);
            box-sizing: border-box;
            cursor: pointer;

            &.active {
                color: #00FCFF;
                border-color: #00FCFF;
                .spot {
                    border-color: rgba(0,230,255,1);
                    background: rgba(1,28,141,0.35);
                }
            }

            .spot {
                width: 10px;
                height: 10px;
                margin-right: 7px;
                border-radius: 5px;
                border: 1px solid rgba(0,230,255,0.6);
                background: rgba(0,142,255,0.4);
                box-sizing: border-box;
            }
            
        }
    }
    }
`
export function ResourceTab() {
    const [tabIndex, setTabIndex] = useState<number>(0);
    const areaList = [
        '西南', '东部', '南部', '西北',
        '北部', '中部', '北京', '上海', 
    ]
    const changeTab = (index: number) => {
        setTabIndex(index)
    }
    useEffect(() => {
    // 请求数据
    //     getAllwebData({
    //         netWorkType: paramsIndex
    //     }).then((res:any) => {
    //         if(res.code == 200 && res.data)
    //         setFlowList(res.data);
    //         setBandwidth(res.data.bandwidth.slice(0, res.data.bandwidth.length - 4))
    //     });
    }, []);
    return (
        <>
            <ResourceTabWrapper>
                <div className="tabWrapper">
                    {areaList && areaList.map((item: any, index: number) => {
                        return (
                            <div key={index} 
                                className={`${tabIndex == index ? 'on' : 'tabItem'}`} 
                                onClick={()=>changeTab(index)}>
                                <div className="itemWrap">
                                    <div className="circle"></div>
                                    <div className="title">{item}</div>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </ResourceTabWrapper>
        </>
    );
}

export default ResourceTab;