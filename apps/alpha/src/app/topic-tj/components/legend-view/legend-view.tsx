import legendCss from './legend-view.module.scss';
import hexin from '../../datas-network/images/icons/hexin.svg';

/* eslint-disable-next-line */
export interface LegendViewProps {
  iconList: IconListProps[];
  left?: string;
}
interface IconListProps {
  legendName: string;
  iconName?: string;
  iconColor?: string;
  iconList?: any;
  type: string;
  imgStyle?: any;
}

export function LegendView(props: LegendViewProps) {
  return (
    <div className={legendCss['wirelessNetworkLeged']} style={{ left: props.left}}>
      <div className={legendCss['right-icon-row']}>
        <div className={legendCss['right-icon-item']}>
          {
            props.iconList.map((item, index) => {
              return (
                <div className={legendCss['icon-item']} key={item.legendName + index}>
                  {
                    item.type == 'icon' &&
                    <svg
                      className='icon svg-icon'
                      width='16px'
                      height='20px'
                      aria-hidden='true'
                      style={{
                        width: '16px',
                        height: '20px',
                      }}>
                      <use xlinkHref={'#' + `${item.iconName}`}></use>
                  </svg>}
                  {item.type == 'line' && <em className={legendCss['icon-line']} style={{ borderColor: item.iconColor }}></em>}
                  {item.type == 'img' && item.imgStyle && <img className={legendCss['icon-img']} src={item.imgStyle.src || ''} style={{ ...item.imgStyle }}></img>}

                  {item.type == 'svg' && item.imgStyle && <img className={legendCss['icon-img']} src={item.imgStyle.src} width={24} height={24} alt=''/> }
                  <span className={legendCss['right-icon-label']}> {item.legendName} </span>
                </div>
              )
            })

          }

        </div>
      </div>
    </div>
  );
}

export default LegendView;
