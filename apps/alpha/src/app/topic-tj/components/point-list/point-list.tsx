import styles from './point-list.module.scss';

/* eslint-disable-next-line */
export interface PointListProps {
  datas: any[];
  className?: string;
  wrapClassNameRender?: (li: any) => void;
  iconClassNameRender?: (li: any) => void
}

export function PointList(props: PointListProps) {
  const { datas, className, wrapClassNameRender, iconClassNameRender} = props;
  if((datas && datas.length)) {
    return (
      <div
        className={`pointListContainer ${styles['container']} ${className}`}
      >
        {datas.map((li: any, i: number) => {
        return (<span
          className={`
            ${styles['point-wrap']}
            ${'point-wrap'}
            ${wrapClassNameRender?.(li)}
        
          `}
          title={li.portTermName || li.portTermNo}
          key={i}
        >
          <span
             className={`
             ${'point'}
             ${styles['point']}
             ${'tj-iconfont'}
             ${iconClassNameRender?.(li)}
           `}
          ></span>
        </span>)
        })}
      </div>
    )
  } else {
    return null
  }
}

export default PointList;
