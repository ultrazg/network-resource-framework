import React, { useEffect, useState } from 'react';

import css from './header.module.scss';
import logo from './logo.svg';
import background from './background.svg';
import { url } from 'inspector';

/* eslint-disable-next-line */
export interface HeaderProps {
  title?: string;
  back?: boolean;
  children?: any;
  titleStyle?: object;
  hideTime?: boolean;
}

export function Header(props: HeaderProps) {
  const [time, setTime] = useState('12:18:55');
  const [date, setDate] = useState('MON 2021-03-01');
  const [weather, setWeather] = useState('北京 8℃ 多云');
  const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

  useEffect(() => {
    const updateClock = () => {
      const date = new Date();

      setTime(
        `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        }`
      );

      setDate(
        `${date.getFullYear()}.${
          date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1
        }.${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${
          week[date.getDay()]
        }.`
      );
    };

    updateClock();
    const clock = setInterval(() => {
      updateClock();
    }, 1000);

    return () => {
      clearInterval(clock);
    };
  }, []);
  return (
    <header style={{ background: `url(${background})`, zIndex: '22' }}>
      <div className={css['back']}>{props.children}</div>
      {props.title ? (
        <div
          className={css['name']}
          style={{
            color: '#00feff',
            ...props.titleStyle,
          }}
        >
          {props.title}
        </div>
      ) : (
        <div className={css['name']}>
          <div className={css['logo']}>
            <img src={logo} className="material-icons" alt="" />
          </div>
          <div>网络资源可视化中心</div>
        </div>
      )}

      <div
        className={css['info-block']}
        style={{ display: props.hideTime ? 'none' : 'flex' }}
      >
        <div className={css['date']}>{date}</div>
        <div className={css['weather']}>{weather}</div>
        <div className={css['time']}>{time}</div>
      </div>
      {/* 预先加载图标字体 */}
      <span
        className="iconfont-message icon-el-icon-error"
        style={{ color: 'transparent', width: '0', height: '0', opacity: 0 }}
      ></span>
      <span
        className="iconfont icon-zuobiaodian2"
        style={{ color: 'transparent', width: '0', height: '0', opacity: 0 }}
      ></span>
    </header>
  );
}

export default Header;
