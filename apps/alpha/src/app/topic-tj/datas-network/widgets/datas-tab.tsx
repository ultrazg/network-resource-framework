// 数据网-tab组件
import styled from 'styled-components';

import tabDefaultBg from '../../images/datas_tab_default_icon.png';
import tabActiveBg from '../../images/datas_tab_active_icon.png';

type PropsType = {
    dataIndex: number,
    setDataIndex: Function;
};

const DatasTabBox = styled.div`
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
`;

export function DatasTab(props: PropsType) {

    const tabCheck = (i: number) => {
        props.dataIndex !== i && props.setDataIndex(i)
    }

    return (
        <>
            <DatasTabBox>
                <div className="datas-tab">
                    <div
                        className={['datas-tab-item', props.dataIndex === 0 ? 'active' : ''].join(' ')}
                        onClick={() => tabCheck(0)}
                    >
                        <img src={props.dataIndex === 0 ? tabActiveBg : tabDefaultBg} alt="" />
                        <span>资源地图</span>
                    </div>
                    <div
                        className={['datas-tab-item', props.dataIndex === 1 ? 'active' : ''].join(' ')}
                        onClick={() => tabCheck(1)}
                    >
                        <img src={props.dataIndex === 1 ? tabActiveBg : tabDefaultBg} alt="" />
                        <span>网络示图</span>
                    </div>
                </div>
            </DatasTabBox>
        </>
    );
}

export default DatasTab;