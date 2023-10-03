// 数据网-地市带宽流入流出
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { getStatisticsData } from '../../api/datasNetwork'
import "swiper/css";
import "swiper/scss/effect-fade";
import headerBcg from '../images/headerBcg.png'

const TableSwiper = styled.div`
  *{
    margin: 0;
    padding:0;
  }
  .swiper {
    height: 200px;
    width: 548px;
    margin: 0;
    padding-right:40px;
    overflow: auto;
    // box-sizing: border-box;
    /*滚动条bai整体*/
    ::-webkit-scrollbar{
      width:5px;
      height: 20px;
    }
    ::-webkit-scrollbar-track{
      background-color:transparent;/*滑道全部*/
    }
    ::-webkit-scrollbar-track-piece{
      background-color:transparent;/*滑道*/
    }
    ::-webkit-scrollbar-thumb{
      background-color:#233859;/*滑动条表面*/
      border:none;/*滑动条边框*/
    }
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 33px;
      box-sizing: border-box;
      width: 548px;
      &:nth-child(2n) {
        background-image: linear-gradient(270deg, rgba(42,141,210,0.10) 0%, rgba(26,121,214,0.22) 51%, rgba(36,135,221,0.10) 100%);
      }
      >div {
        opacity: 0.7;
        width: 18%;
        text-align: left;
        align-items: center;
        font-size: 14px;
        font-family: PingFangSC, sans-serif, sans-serif;
        font-weight: 400;
        color: #c0e7ff;
        line-height: 20px;
        white-space: nowrap;
        &:nth-child(1) {
          opacity: 1 !important;
          width: 30px;
        }
        &:nth-child(2) {
          overflow:hidden;
          text-overflow:ellipsis;
          width: 96px;
        }
        &:nth-child(3) {
          width: 60px;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        &:nth-child(4) {
          width: 56px;
        }
        &:nth-child(5) {
          width: 66px;
        }
        &:nth-child(6) {
          width: 66px;
        }
      }
    }
  }
  .num {
    font-family: "PangMenZhengDao", sans-serif;
    color: #51e6ff;
    font-size: 14px;
  }
  .tab-header {
    padding: 0;
    width: 548px;
    height: 50px;
    background: url(${headerBcg});
    background-size: 100% 100%;
    mix-blend-mode: normal;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 16px;
    font-weight: 600;
    li {
      text-align: left;
      color: #32C5FF;
      font-size: 14px;
      list-style: none;
      &:nth-child(1) {
        width: 30px;
      }
      &:nth-child(2) {
        width: 96px;
      }
      &:nth-child(3) {
        width: 60px;
      }
      &:nth-child(4) {
        width: 56px;
      }
      &:nth-child(5) {
        width: 66px;
      }
      &:nth-child(6) {
        width: 66px;
      }
    }
  }
  .contentWrap {
    width: 550px;
    height: 200px;
    display: block;
    flex-direction: column;
    justify-content: space-around;
    padding-right: 44px;
    overflow-y: scroll;
    ::-webkit-scrollbar{
      width:5px;
    }
    ::-webkit-scrollbar-track{
      background-color:transparent;/*滑道全部*/
    }
    ::-webkit-scrollbar-track-piece{
      background-color:transparent;/*滑道*/
    }
    ::-webkit-scrollbar-thumb{
      background-color:#233859;/*滑动条表面*/
      border:none;/*滑动条边框*/
    }
    li {
      display: flex;
      justify-content: space-around;
      opacity: 0.7;
      text-align: left;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC, sans-serif;
      font-weight: 400;
      color: #c0e7ff;
      white-space: nowrap;
      list-style: none;
      &:nth-child(2n) {
        background-image: linear-gradient(270deg, rgba(42,141,210,0.10) 0%, rgba(26,121,214,0.22) 51%, rgba(36,135,221,0.10) 100%);
      }
    }
  }
`;

export function provinceForm(props: any) {
  const [tableData, setTableData] = useState<any>([]);
  const header = ["地市", "客户名称", "业务号码", "网络类型", "流入带宽利用率", "流出带宽利用率"];
  useEffect(() => {
   
  }, []);
  
  return (
    <div>
      <TableSwiper>
        <ul className="tab-header">
          {header && header.map((item: any, index: number) => {
            return (
              <li key={index}>{item}</li>
            )
          })
          }
        </ul>
        <ul className='contentWrap'>
          {props.focusLinksList && props.focusLinksList.map((item: any, index: number) => {
            return (
              <li key={index} style={{lineHeight: '33.3px'}}>
                <div style={{opacity: 1, width:'30px'}}>{item.city}</div>
                <div style={{width:'96px',overflow:'hidden',textOverflow:'ellipsis'}}>{item.cusName}</div>
                <div style={{width:'60px',overflow:'hidden',textOverflow:'ellipsis'}}>{item.businessNumber}</div>
                <div style={{width:'56px'}}>{item.networkType}</div>
                <div style={{width:'63px'}}>{item.inBandwidthUtilization}%</div>
                <div style={{width:'63px'}}>{item.outBandwidthUtilization}%</div>
              </li>
            )
          })
          }
        </ul>
      </TableSwiper>
    </div>
  );
}

export default provinceForm;
