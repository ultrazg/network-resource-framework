import './parallel-nav.module.scss';
import bottom from './image/bottom@2x.png';
import IconPlan from './image/plan.svg';
import IconConstructionRectification from './image/construction-rectification.svg';
import IconMaintain from './image/maintain.svg';
import IconOptimisation from './image/optimisation.svg';
import IconOperation from './image/operation.svg';
import ActiveLine from './image/operation.svg';
import css from './parallel-nav.module.scss';
import ActiveBg from './image/ac-bg@2x.png';
import Bg from './image/bg@2x.png';
import styled from 'styled-components';
import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import OperationSchedule from '@alpha/app/topic/operation-schedule/operation-schedule';
import { OUT_URL } from '@alpha/utils/constants';
import SignalDedicated from '@alpha/app/topic/signal-dedicated-line/signal-dedicated-line';
import Broadband from '@alpha/app/topic/broadband-2/broadband';

interface MenuItemChildrenObj {
  name: string;
  title?: string;
  icon: string;
  url?: string;
  component?: JSX.Element;
}

interface MenuItemObj {
  name: string;
  icon: string;
  children: MenuItemChildrenObj[];
}

/* eslint-disable-next-line */
export interface ParallelNavProps {
  jump: (src: string, name: string) => void;
  show: Function;
  customMenu?: MenuItemObj[];
  setSelectedName?: React.Dispatch<React.SetStateAction<string>>;
  style?: CSSProperties;
  currentType?: string;
}

const Inner = styled.div`
  display: flex;
  justify-content: center;
  .bg {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 72px;
    height: 57px;
    text-align: center;
    line-height: 80px;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    background: url(${Bg}) center center/100% 100% no-repeat;
    .sub-menu-name {
      margin-bottom: -15px;
      width: 48px;
      height: fit-content;
      line-height: 17px;
      white-space: nowrap;
    }
    &:hover {
      // cursor: pointer;
        // background: url(${ActiveBg}) center center/100% 100% no-repeat;
    }
  }
`;

const MenuList = styled.div`
  width: 400px;
  display: flex;
  justify-content: space-between;

  .menu-item {
    margin-top: 9px;
    transform: translateX(4px);
    overflow: hidden;
    display: flex;

    .icon {
      box-sizing: border-box;
      border-left: 1px solid transparent; //防止drop-shadow主体超出视线隐藏后阴影消失
      border-right: 1px solid transparent;
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }

    .menu-name {
      display: inline-block;
      line-height: 14px;
      font-size: 14px;
      font-weight: 0;

      white-space: nowrap;
      font-family: FZZDHJW, sans-serif;
    }

    .preset {
      color: #4bfbfe;
    }

    .active-line {
      display: none;
      width: 60px;
      height: 4px;
      object-fit: cover;
    }
  }
`;

const mockMenus: MenuItemObj[] = [
  {
    name: '规划',
    icon: IconPlan,
    children: [],
  },
  {
    name: '建设',
    icon: IconConstructionRectification,
    children: [],
  },
  {
    name: '维护',
    icon: IconMaintain,
    children: [
      {
        name: '质量看板',
        title: '宽带专题',
        icon: '',
        // component: <Broadband />,
      },
      {
        name: '无线网优',
        title: '号线专题',
        icon: '',
        // component: <SignalDedicated />,
      },
      {
        name: '订单治理',
        title: OUT_URL.circuit.title,
        icon: '',
        // url: OUT_URL.circuit.url,
      },
      {
        name: '预检预修',
        title: OUT_URL.importCustomCircuit.title,
        icon: '',
        // url: OUT_URL.importCustomCircuit.url,
      },
      {
        name: '光衰治理',
        title: OUT_URL.flowMonitor.title,
        icon: '',
        // url: OUT_URL.flowMonitor.url,
      },
      // {
      //   name: '调度<br/>运营',
      //   icon: '',
      //   component: <OperationSchedule />,
      //   title: '调度运营专题',
      // },
      // {
      //   name: '订单<br/>治理',
      //   icon: '',
      //   component: <OrderDiagnoseView/>,
      //   title: 'BO协同订单治理',
      // },
    ],
  },
  {
    name: '优化',
    icon: IconOptimisation,
    children: [],
  },
  {
    name: '运营',
    icon: IconOperation,
    children: [],
  },
];

export function ParallelNav(props: ParallelNavProps) {
  const [selectedMenu, setSelectedMenu] = useState<MenuItemObj>();

  const menuList = useMemo<MenuItemObj[]>(() => {
    if (props.customMenu) return props.customMenu;
    else return mockMenus;
  }, [props.customMenu]);
  const subMenu = useMemo<MenuItemChildrenObj[] | undefined>(() => {
    if (selectedMenu && selectedMenu.children) {
      return selectedMenu.children;
    } else {
      return undefined;
    }
  }, [selectedMenu]);

  useEffect(() => {
    if (props.customMenu) {
      setSelectedMenu(props.customMenu[0]);
    } else {
      setSelectedMenu(mockMenus[2]);
    }
  }, []);

  useEffect(() => {
    if(selectedMenu && props.currentType!== selectedMenu.name) {
      let now  = props.customMenu?.find(t => t.name === props.currentType);
      if(now) {
        setSelectedMenu(now);
      }
    }
  }, [props.currentType]);

  function handleMenuSelect(menu: MenuItemObj, index: number) {
    setSelectedMenu(menu);
    props.setSelectedName && props.setSelectedName(menu.name);
  }

  return (
    <>
      {/*
      <Inner>
        {subMenu &&
          subMenu.map((item, idx) => {
            return (
              <div
                className={'bg'}
                key={`children-${idx}`}
                onClick={() => {
                  item.url && props.jump(item.url, item.title || item.name);
                  item.component &&
                    props.show(item.component, item.title || item.name);
                }}
              >
                <div
                  className="sub-menu-name"
                  dangerouslySetInnerHTML={{ __html: item.name || 'test' }}
                ></div>
              </div>
            );
          })}
      </Inner>
      */}

      <div className={css[`bottom`]}>
        <div
          className={css[`wrapper`]}
          style={{
            background: `url(${bottom}) center center/120% 100% no-repeat`,
          }}
        >
          <MenuList style={props.style}>
            {menuList.map((item, idx) => {
              return (
                <div
                  onClick={() => {
                    handleMenuSelect(item, idx);
                  }}
                  className={`menu-item`}
                  key={`parent-${idx}`}
                >
                  <div>
                    {item.icon.includes('iconfont') ? (
                      <div
                        className={
                          selectedMenu && selectedMenu.name === item.name
                            ? 'preset'
                            : ''
                        }
                      >
                        <span className={item.icon}></span>
                        <div
                          className={'menu-name'}
                          style={{ marginLeft: '8px' }}
                        >
                          {' '}
                          {item.name}
                        </div>
                      </div>
                    ) : (
                      <>
                        <img className={'icon'} src={item.icon}></img>
                        <div className={'menu-name preset'}>{item.name}</div>
                      </>
                    )}
                  </div>
                  <img
                    className={'active-line'}
                    src={ActiveLine}
                    width={'60px'}
                    height={'4px'}
                  ></img>
                </div>
              );
            })}
          </MenuList>
        </div>
      </div>
    </>
  );
}

export default ParallelNav;
