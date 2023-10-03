import css from './modal-view.module.scss';
import Background from '@alpha/assets/images/platform-view/bg.png';
import BackgroundInner from '@alpha/assets/border@2x.png';
import IconArrow from '@alpha/assets/images/message/back.png';
import Header from '../header/header';
import { CSSProperties, useEffect, useMemo, useState } from 'react';

/* eslint-disable-next-line */
export interface ModalViewProps {
  show: boolean;
  fn: Function;
  children?: any;
  title?: string;
  backText?: string;
  ifDisableFilter?: boolean;
  style?: CSSProperties;
  modalType?: 'fixed';
}

export function ModalView(props: ModalViewProps) {
  const modalStyle: CSSProperties = useMemo(() => {
    let temp: CSSProperties = {
      background: `url(${Background}) center / cover no-repeat`,
    };
    if (props.show && props.ifDisableFilter) {
      temp.animation = 'none';
    }
    if (props?.modalType === 'fixed') {
      temp.position = 'fixed';
    }
    return temp;
  }, [props]);
  return (
    <div
      className={`${css['modal-overlay']} ${
        props.show ? css['open'] : css['hide']
      }`}
      style={modalStyle}
    >
      <div
        className={css['modal-wrap']}
        style={{
          background: `url(${BackgroundInner}) center / cover no-repeat`,
        }}
      >
        <Header
          title={props.title}
          titleStyle={{ fontFamily: 'FZZD', marginTop: '16px' }}
        >
          {/* 子节点css样式未生效，生效样式在header文件中.back */}

          <div
            onClick={(e) => {
              // setVisible(false);
              // setTimeout(() => {
              //   props.fn();
              // }, 300);
              props.fn();
              e.stopPropagation();
            }}
          >
            <img
              src={IconArrow}
              alt="back"
              width="16px"
              height="16px"
              style={{ height: '20px' }}
            />
            <span
              style={{
                marginLeft: '4px',
                verticalAlign: 'top',
              }}
            >
              {props.backText ? props.backText : '首页'}
            </span>
          </div>
        </Header>
        <div className={css['modal-content']} style={props.style}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default ModalView;
