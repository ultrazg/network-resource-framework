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
import { useEffect, useState } from 'react';
import OperationSchedule from '@alpha/app/topic/operation-schedule/operation-schedule';
import { OUT_URL } from '@alpha/utils/constants';
import SignalDedicated from '@alpha/app/topic/signal-dedicated-line/signal-dedicated-line';
import { Link, Route, Routes, useRoutes } from 'react-router-dom';
import { getTopicUrl } from '@alpha/app/routes';

/* eslint-disable-next-line */
export interface ParallelNavProps {
  jump: (src: string, name: string) => void;
  show: Function;
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
      cursor: pointer;
      background: url(${ActiveBg}) center center/100% 100% no-repeat;
    }
  }
`;

const MenuList = styled.div`
  width: 346px;
  display: flex;
  justify-content: space-between;
  .menu-item {
    margin-top: 9px;
    width: 60px;
    transform: translateX(4px);
    overflow: hidden;
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
      width: 30px;
      height: 14px;
      line-height: 14px;
      font-size: 14px;
      color: #4bfbfe;
      letter-spacing: 0;
      white-space: nowrap;
    }
    .active-line {
      display: none;
      width: 60px;
      height: 4px;
      object-fit: cover;
    }
  }
`;

const menus: {
  name: string;
  icon: string;
  children: {
    name: string;
    title?: string;
    icon: string;
    url?: string;
    component?: string;
  }[];
}[] = [
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
        name: '号线<br/>专题',
        title: '号线专题',
        icon: '',
        component: getTopicUrl('号线专题'),
      },
      {
        name: '电路<br/>呈现',
        title: OUT_URL.circuit.title,
        icon: '',
        url: OUT_URL.circuit.url,
      },
      {
        name: '重点客户<br/>电路',
        title: OUT_URL.importCustomCircuit.title,
        icon: '',
        url: OUT_URL.importCustomCircuit.url,
      },
      {
        name: '专线流量<br/>监控',
        title: OUT_URL.flowMonitor.title,
        icon: '',
        url: OUT_URL.flowMonitor.url,
      },
      {
        name: '调度<br/>运营',
        icon: '',
        title: '调度运营专题',
        component: getTopicUrl('调度运营'),
      },
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
  const [menu, setMenu] = useState('');
  const [submenu, setSubmenu] = useState(menus[0].children);

  useEffect(() => {
    setMenu('优化');
    setSubmenu(menus[2].children);
  }, []);

  const selectMenu = (name: string, index: number) => {
    setMenu(name);
    setSubmenu([]);
    setTimeout(() => {
      // setSubmenu(menus[index].children);
      // 暂时取消关联
      setSubmenu(menus[2].children);
    }, 300);
  };
  return (
    <>
      <Inner>
        {submenu.map((item, idx) => {
          return (
            <div
              className={'bg'}
              key={`children-${idx}`}
              onClick={() => {
                item.url && props.jump(item.url, item.title || item.name);
                item.component && props.show(item.component);
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
      <div className={css[`bottom`]}>
        <div
          className={css[`wrapper`]}
          style={{
            background: `url(${bottom}) center center/100% 100% no-repeat`,
          }}
        >
          <MenuList>
            {menus.map((item, idx) => {
              return (
                <div
                  onClick={() => {
                    // selectMenu(item.name,idx);
                  }}
                  className={`menu-item`}
                  key={`parent-${idx}`}
                >
                  <div>
                    <img className={'icon'} src={item.icon}></img>
                    <div className={'menu-name'}>{item.name}</div>
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
