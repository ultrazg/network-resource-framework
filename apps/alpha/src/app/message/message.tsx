import { CSSProperties, useEffect } from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import lodash from 'lodash';
import css from './message.module.scss';
import styled from 'styled-components';
import IconWrongTips from './images/wrong-tips-icon.svg';
import BgWrongTips from './images/wrong-tips-bg.svg';
import { contain } from 'echarts/types/src/scale/helper';

interface MessageProps {
  type: string;
  onClose: Function;
  content?: string;
  title?: string;
}

interface _MessageProps {
  content?: string;
  title?: string;
  style?: CSSProperties;
}
const messageIcon = (type: string) =>
  new Map([
    [
      'error',
      {
        icon: 'iconfont icon-error',
        color: '#dc3b45',
      },
    ],
    ['info', { icon: 'iconfont-message icon-el-icon-info', color: '#909399' }],
    [
      'warning',
      { icon: 'iconfont-message icon-el-icon-warning', color: '#E6A23C' },
    ],
    [
      'success',
      { icon: 'iconfont-message icon-el-icon-success', color: '#67C23A' },
    ],
  ]).get(type);

const TipsWrong = styled.div`
  background: url(${BgWrongTips}) center center no-repeat;
  background-size: 100% 100%;
  width: 279px;
  height: 42px;
  opacity: 0.81;
  filter: blur(0);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 24px rgba(237, 32, 45, 0.5);

  .tips-text {
    margin-left: 9px;
    line-height: 42px;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    text-shadow: 0 0 10px rgba(237, 32, 45);
  }
`;

function Message(props: MessageProps) {
  useEffect(() => {
    const time = setTimeout(props.onClose, 3000);
    return () => {
      time && clearTimeout(time);
    };
  }, []);
  return (
    <>
      {props.type === 'tips_wrong' ? (
        <TipsWrong>
          <img
            className="tips-icon"
            src={IconWrongTips}
            width={24}
            height={24}
            alt="!"
          ></img>
          <div className="tips-text">{props.content}</div>
        </TipsWrong>
      ) : (
        <div
          className={css['message-inner-container']}
          style={{
            background: messageIcon(props.type)?.color + '33',
            border: `1px solid ${messageIcon(props.type)?.color}`,
          }}
        >
          <div
            style={{
              color: messageIcon(props.type)?.color,
            }}
            className={[
              messageIcon(props.type)?.icon,
              css['message-icon'],
            ].join(' ')}
          ></div>
          <div
            style={{
              color: messageIcon(props.type)?.color,
            }}
          >
            {props.title ? props.title + ':' + props.content : props.content}
          </div>
        </div>
      )}
    </>
  );
}

const getContainer = (style?: any) => {
  const container = document.querySelector(
    '#customMessageWrapper'
  ) as HTMLElement;
  if (!container) {
    const _container = document.createElement('div');
    _container.id = 'customMessageWrapper';
    _container.className = css['message-outer-container'];
    if (style) {
      _container.style.top = style.top;
      _container.style.left = style.left;
    }
    document.getElementById('nr') !== null
      ? document.getElementById('nr')?.appendChild(_container)
      : document.body.appendChild(_container);

    return _container;
  } else {
    if (style) {
      container.style.top = style.top;
      container.style.left = style.left;
    } else {
      container.style.top = '50px';
      container.style.left = 'calc(50% - 140px)';
    }
  }

  return container;
};

const _message = (type: string) => (props: _MessageProps) => {
  const container = getContainer(props.style);

  const _dom = document.createElement('div');
  _dom.className = [css['message-container'], css['fly-in']].join(' ');

  if (type.includes('tips') && container.childElementCount > 0) {
    // tips类型页面上只显示一个
  } else {
    container.appendChild(_dom);
  }

  const handleClose = () => {
    _dom.className = [css['message-container'], css['fly-out']].join(' ');
    setTimeout(() => {
      unmountComponentAtNode(_dom);
      if (container.contains(_dom)) container.removeChild(_dom);
    }, 300);
  };
  render(
    <Message
      {...props}
      type={type}
      onClose={lodash.throttle(handleClose, 300)}
    />,
    _dom
  );
};
const tips_wrong = _message('tips_wrong');
const error = _message('error');
const warning = _message('warning');
const success = _message('success');
const info = _message('info');
export default {
  tips_wrong,
  error,
  warning,
  success,
  info,
};
