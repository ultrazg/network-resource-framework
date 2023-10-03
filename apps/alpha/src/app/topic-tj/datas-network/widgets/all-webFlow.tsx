
// 数据网-网络示图全网流量模块
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { getAllwebData } from '../../api/datasNetwork'
import {transformValue} from '../../utils/utils';
import allweb1 from '../images/allweb1.png'
import allweb2 from '../images/allweb2.png'
import allweb3 from '../images/allweb3.png'
import allweb4 from '../images/allweb4.png'
import allweb5 from '../images/allweb5.png'

// 接收传参
type PropsType = {
  tabIndex: number;
};
const FlowWrapper = styled.div`
    width: 479.49px;
    display: flex;
    flex-direction: column;
    margin: 23px 0 20px;
    .flow-list {
        width: 456.5px;
        height: 114px;
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        li {
            width: 74px;
            // display: flex;
            // justify-content: space-around;
            // align-items: center;
            text-align: center;
            .rate {
                width: 100%;
                height: 18px;
                font-family: PangMenZhengDao, sans-serif;
                font-size: 18px;
                color: #00FCFF;
            }
            .imgBox {
                position: relative;
                width: 74px;
                height: 60px;
                .icon{
                    display: block;
                    width: 100%;
                    height: 100%;
                    &.icon1{
                        background: url(${allweb1}) no-repeat center;
                        background-size: 100%;
                    }
                    &.icon2{
                        background: url(${allweb2}) no-repeat center;
                        background-size: 100%;
                    }
                    &.icon3{
                        background: url(${allweb3}) no-repeat center;
                        background-size: 100%;
                    }
                    &.icon4{
                        background: url(${allweb4}) no-repeat center;
                        background-size: 100%;
                    }
                    &.icon5{
                        background: url(${allweb5}) no-repeat center;
                        background-size: 100%;
                    }
                }
            }
            .title {
                width: 72px;
                margin: 5px auto 0;
                height: 34px;
                line-height: 16px;
                font-family: PingFangSC-Regular, sans-serif;
                font-weight: 400;
                font-size: 12px;
                color: #52B9FF;
            }
        }
    }
`
export function AllwebFlow(props: PropsType) {
    const [flowList, setFlowList] = useState<any>([]);
    const [bandwidth, setBandwidth] = useState<any>([]);
    const paramsIndex = (props.tabIndex+1).toString()
    useEffect(() => {
    // 请求数据
        getAllwebData({
            netWorkType: paramsIndex
        }).then((res:any) => {
            if(res.code == 200 && res.data) {
                setFlowList(res.data);
                setBandwidth(res.data.bandwidth.slice(0, res.data.bandwidth.length - 4))
            }
        });
    }, [paramsIndex]);
    return (
        <>
            <FlowWrapper>
                <ul className="flow-list">
                    <li>
                        <div className="rate">{bandwidth}</div>
                            <div className="imgBox">
                                <i className={`icon icon1`}></i>
                            </div>
                        <div className="title">带宽</div>
                    </li>
                    <li>
                        <div className="rate">{transformValue(flowList.inFlow)}</div>
                        {/* <div className="rate">{flowList.inFlow}</div> */}
                            <div className="imgBox">
                                <i className={`icon icon2`}></i>
                            </div>
                        <div className="title">峰值流入流量(gbits)</div>
                    </li>
                    <li>
                        <div className="rate">{transformValue(flowList.outFlow)}</div>
                        {/* <div className="rate">{flowList.outFlow}</div> */}
                            <div className="imgBox">
                                <i className={`icon icon3`}></i>
                            </div>
                        <div className="title">峰值流出流量(gbits)</div>
                    </li>
                    <li>
                        <div className="rate">{transformValue(flowList.inFlowUtilization)}</div>
                        {/* <div className="rate">{flowList.inFlowUtilization}</div> */}
                            <div className="imgBox">
                                <i className={`icon icon4`}></i>
                            </div>
                        <div className="title">流入流量带宽利用率</div>
                    </li>
                    <li>
                        <div className="rate">{flowList.outFlowUtilization}</div>
                            <div className="imgBox">
                                <i className={`icon icon5`}></i>
                            </div>
                        <div className="title">流出流量带宽利用率</div>
                    </li>
                </ul>
            </FlowWrapper>
        </>
    );
}

export default AllwebFlow;