import styles from './spin.module.scss';
import { forwardRef } from 'react';
import { Spin } from 'antd';
import { CustomSIze } from '@alpha/app/topic-tj/components/tables/tables'

/* eslint-disable-next-line */
export interface SpinProps {
  loading?: boolean;
  noData?: boolean;
  children?: React.ReactNode;
  className?: string;
  ref?: any
}

const handleDataHad = (props: SpinProps) => {
  return (
    props.noData ? <CustomSIze /> : props.children
  )
}

export const SpinConten = forwardRef((props: SpinProps, ref?: any) => {
  return (
    <div className={`${styles['SpinContenContainer']} ${props.className}`} ref={ref}>
    {props.loading ? <Spin spinning={props.loading} wrapperClassName={'spinContainer'}>
      {props.children}
    </Spin> : 
      handleDataHad(props)}
    </div>
  )
})
export function SpinContainer(props: SpinProps) {

  return (
    <div className={`${styles['container']} ${props.className}`}>
      {props.loading ?
        <div className={`spinLoading ${styles['loading']}`}>
          <Spin />
        </div> : 
        handleDataHad(props)
      }
    </div>
  );
}

export default SpinContainer;
