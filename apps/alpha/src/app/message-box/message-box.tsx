import { unmountComponentAtNode, render } from 'react-dom';
import css from './message-box.module.scss';

import BackgroundImage from '@alpha/assets/images/message/background.png';
import IconExit from '@alpha/assets/images/message/X.png';
import IconLight from '@alpha/assets/images/message/lightbulb.png';
import IconMaintain from '@alpha/assets/images/message/maintain.png';
import IconAuthority from '@alpha/assets/images/message/authority.png';
import { useEffect } from 'react';

interface MessageBoxProps {
  icon?: string;
  content?: string;
  title?: string;
  type: string;
  onClose: Function;
}
interface _MessageBoxProps {
  icon?: string;
  content?: string;
  title?: string;
}
const messageIcon = (type: string) =>
  new Map([
    ['error', IconLight],
    ['info', IconAuthority],
    ['warning', IconMaintain],
    ['success', IconLight],
  ]).get(type);

function MessageBox(props: MessageBoxProps) {
  useEffect(() => {
    // 自动关闭
    const time = setTimeout(props.onClose, 5000);
    return () => {
      time && clearTimeout(time);
    };
  }, []);
  return (
    <div
      className={[css['message-container'], css['fly-in']].join(' ')}
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div
        className={css['exit-icon']}
        style={{ backgroundImage: `url(${IconExit})` }}
        onClick={() => {
          props.onClose();
        }}
      ></div>
      <div
        className={css['main-icon']}
        style={{
          backgroundImage: `url(${props.icon || messageIcon(props.type)})`,
        }}
      ></div>
      <div className={css['title']}>{props.title}</div>
      <div className={css['content']}>{props.content}</div>
    </div>
  );
}
const getContainer = () => {
  const container = document.querySelector('#customMessageBoxWrapper');
  if (!container) {
    const _container = document.createElement('div');
    _container.id = 'customMessageBoxWrapper';
    document.body.appendChild(_container);
    return _container;
  }
  return container;
};

const _message = (type: string) => (props: _MessageBoxProps) => {
  const container = getContainer();
  const _dom = document.createElement('div');
  container.appendChild(_dom);
  const handleClose = () => {
    _dom.className = [css['message-container'], css['fly-out']].join(' ');
    setTimeout(() => {
      unmountComponentAtNode(_dom);
      container.removeChild(_dom);
      container.className = '';
    }, 1300);
  };
  render(<MessageBox {...props} type={type} onClose={handleClose} />, _dom);
};
const error = _message('error');
const warning = _message('warning');
const success = _message('success');
const info = _message('info');
export default {
  error,
  warning,
  success,
  info,
};
