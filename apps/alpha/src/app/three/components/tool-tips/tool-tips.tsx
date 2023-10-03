import css from './tool-tips.module.scss';

import background from './background.svg';

export interface ToolTipsProps {
  name: string;
  targets: Array<any> | [];
  type: string;
  x: string | number;
  y: string | number;
}

export function ToolTips(props: ToolTipsProps) {
  return (
    <div
      id="tool-tips"
      className={css['pop']}
      style={{
        backgroundImage: `url(${background})`,
        left: `${props.x}px`,
        top: `${props.y}px`,
      }}
    >
      <div className={[css['title'], 'pop-title'].join(' ')}>
        {props.name} <span className="pop-sumvalue"></span>
      </div>
      {props.targets.map((item, index) => {
        return (
          <div key={`sub-${index}`} className={css['sub']}>
            <div
              className={
                props.type == 'cuboid'
                  ? css[`cube-${index}`]
                  : css[`column-${index}`]
              }
            >
              <div>
                <div></div>
              </div>
            </div>
            <div className={css['sub-name']}>{item.name}</div>
            <div className={`${css['sub-value']} ${css[`sub-value${index}`]}`}>
              123
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ToolTips;
