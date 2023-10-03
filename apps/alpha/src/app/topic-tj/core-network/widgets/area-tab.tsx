
// 核心网-资源上图
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const AreaTabWrapper = styled.div`
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
`

interface AreaTabProps {
    areaValue: number;
    setAreaValue: (i: number) => void
}

export function AreaTab(props: AreaTabProps) {
    const tabs = ['西南', '东部', '南部', '西北', '北部', '中部', '北京', '上海']
    const [tabIndex, setTabIndex] = useState(0)

    const tabClick = (i: number) => {
        setTabIndex(i)
        props.setAreaValue(i)
    }

    useEffect(() => {
        // 地图点击单个省份时切换到对应大区tab
        props.areaValue !== tabIndex && setTabIndex(props.areaValue)
    }, [props.areaValue])

    return (
        <>
            <AreaTabWrapper>
                <div className="tabWrapper">
                    {
                        tabs.map((item, i) => {
                            return <div className={['tabItem', tabIndex === i ? 'active' : ''].join(' ')} key={i} onClick={() => tabClick(i)}>
                                <span className="spot"></span>
                                <span>{item}</span>
                            </div>
                        })
                    }
                </div>
            </AreaTabWrapper>
        </>
    );
}

export default AreaTab;