import styles from './desc-list.module.scss';

/* eslint-disable-next-line */
interface Datas {
  name: string;
  icon?: string;
  color?: string;
}
export interface DescListProps {
  datas: Datas[]
}

export function DescList(props: DescListProps) {
  return (
    <div className={styles['container']}>
      {
        props.datas.map((item: Datas) => {
          return (
            <div className={styles['desc-item']} key={item.name}>
              <span className={`
                ${item.icon && `tj-iconfont`}
                ${item.icon}
                ${!item.icon && item.color &&  styles['roundRect']}
                `}
                style={{ background: !item.icon && item.color || '', color: item.icon && item.color }}
                ></span>
              <span className={styles['name']}>{item.name}</span>
            </div>
          )
        })
      }
    </div>
  );
}

export default DescList;
