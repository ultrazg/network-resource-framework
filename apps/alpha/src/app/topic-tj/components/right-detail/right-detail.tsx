import { useState, useRef, useEffect } from 'react';
import styles from './right-detail.module.scss';

/* eslint-disable-next-line */
export interface RightDetailProps {
  children?: React.ReactNode;
  style?: any;
}

export function RightDetail(props: RightDetailProps) {
  const [isShow, SetIsShow] = useState(true);
  const hidePannel = (isShow: boolean) => {
    SetIsShow(!isShow);
  };
  return (
    <div className={styles['container']}>
      <div
        className={
          styles['details-body'] +
          ' ' +
          `${!isShow && styles['listHide']}`
        }
        style={{
          ...props.style,
          width: (props.style?.width).toString() || '400px',
          height: (props.style?.height).toString() || 'auto',
        }}
      >
        {props.children}
        {/* 收起/展开 */}
        <div
          className={
            styles['disappear'] + ' ' + `${!isShow && styles['disappears']}`
          }
          onClick={() => hidePannel(isShow)}
        >
          <div className={styles['arrow']}>
            <div
              className={`${isShow ? styles['hide'] : styles['inner']}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightDetail;
