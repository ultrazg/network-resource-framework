import { useEffect, useState, useRef } from 'react';
import css from './iframe-modal.module.scss';

import Header from '../header/header';
import IconArrow from '@alpha/assets/images/message/back.png';
import { useDispatch, useSelector } from 'react-redux';
import { setIframeHide } from '../redux/iframe.slice';

/* eslint-disable-next-line */
export interface IframeModalProps {
  fn: Function; // 关闭页面后的回调函数
}

export const IFRAME_BACKGROUND = [
  {
    name: '专线流量监控',
    key: 'zxlljk',
  },
  {
    name: '无线网',
    key: 'wxw',
  },
  {
    name: '机房',
    key: 'jf',
  },
  {
    name: '楼宇',
    key: 'ly',
  },
  {
    name: '电路呈现',
    key: 'dl',
  },
  {
    name: '数据治理质量看板',
    key: 'zlkb',
  },
  {
    name: '重点客户电路',
    key: 'zdkhdl',
  },
  {
    name: '光缆网',
    key: 'glw',
  },
  {
    name: '传输网',
    key: 'csw',
  },
  {
    name: '数据网',
    key: 'sjw',
  },
  {
    name: '接入网',
    key: 'jrw',
  },
  {
    name: '核心网',
    key: 'hxw',
  },
  {
    name: '天津市东丽区空港IDC机房三号楼',
    key: 'shl',
  },
  {
    name: '订单总览',
    key: 'ddlb',
  },
];

export function IframeModal(props: IframeModalProps) {
  const iframeRef = useRef(null);

  const [frameLoaded, setFrameLoaded] = useState(false);

  const reduxIframeResource = useSelector(
    (state: any) => state.reduxIframeResource
  );
  const dispatch = useDispatch();

  function onLoadHandler() {
    console.log(`${reduxIframeResource.title} iframe loaded`);

    // setFrameLoaded(true);
  }

  function getIframeClass(name: string) {
    let filter = IFRAME_BACKGROUND.filter((item) => item.name == name);

    return filter && filter.length ? filter[0].key : 'csw';
  }

  useEffect(() => {
    setFrameLoaded(true);
  }, [reduxIframeResource.url]);

  return (
    <>
      <div
        className={`${css['modal-overlay']} ${
          reduxIframeResource.ifShow ? css['open'] : ''
        }`}
        style={
          reduxIframeResource.iframeStyle
            ? reduxIframeResource.iframeStyle
            : undefined
        }
      >
        <div
          className={`${css['modal-wrap']} iframe-modal`}
          style={{
            zIndex: 99,
          }}
        >
          <Header
            title={reduxIframeResource.title}
            titleStyle={{ fontFamily: 'FZZD', marginTop: '16px' }}
          >
            <div
              className={css['modal-header-back']}
              onClick={(e) => {
                dispatch(setIframeHide());
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
                {reduxIframeResource.backText
                  ? reduxIframeResource.backText
                  : '首页'}
              </span>
            </div>
          </Header>
          <div
            style={{
              marginTop: '-84px',
              width: '100%',
              height: 'calc(100% + 84px - 76px)', //补充margin的向上偏移，再去除头部的高度
            }}
            className={'iframe'}
            ref={iframeRef}
          >
            {!frameLoaded && (
              <div
                className={`iframe-loading`}
              ></div>
            )}
            {/* 去掉 props.show 以用于iframe预加载 */}
            {/* 首页加载慢，先关闭iframe的预加载 */}
            {reduxIframeResource.ifShow && reduxIframeResource.url && (
              <iframe
                id="iframeModal"
                src={reduxIframeResource.url}
                frameBorder="0"
                width={'100%'}
                height={'100%'}
                onLoad={onLoadHandler}
                sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation allow-downloads"
              >
                加载数据失败
              </iframe>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default IframeModal;
