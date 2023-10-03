import devNameCss from './dev-name.module.scss';
import xiaoqu from '../assets/images/xiaoqu.png';

/* eslint-disable-next-line */
export interface DevNameProps {
  devName: string;

}

export function DevName(props: DevNameProps) {
  return (
    <div className={devNameCss['dev-essen-name']} title={props.devName}>
      <img src={xiaoqu} alt='name' />
      <span>{props.devName}</span>
    </div>
  );
}

export default DevName;
