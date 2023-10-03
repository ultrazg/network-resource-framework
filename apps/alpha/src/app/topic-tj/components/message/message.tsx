import styles from './message.module.scss';
import { message } from 'antd';
/* eslint-disable-next-line */
export interface MessageProps {
  content: any;
  className?: string;
  style?: object;
  key?: string;
  duration?: number;
  top?: number;
}

export function Message(props: MessageProps) {
  message.config(props);
  message.open(props);
}
Message.defaultProps = {
	className: styles['messageStyle']
}
export default Message;
