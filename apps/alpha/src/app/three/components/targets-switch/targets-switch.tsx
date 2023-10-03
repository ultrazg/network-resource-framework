import css from './targets-switch.module.scss';

import { TARGET_COLOR } from '@alpha/constants';
import { Column } from '../../elements/column';
import { Cuboid } from '../../elements/cuboid';

export interface TargetsSwitchProps {
  targets: Array<any> | [];
  current: string;
  type: string;
  switchTarget: Function;
}

export function TargetsSwitch(props: TargetsSwitchProps) {
  return (
    <div className={css['type']}>
      {props.targets.length > 0 &&
        props.targets.map((item: any, index) => {
          return (
            <div
              className={`${css['item']} ${
                props.current === item.key ? css['active'] : ''
              }`}
              key={`sub-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                props.switchTarget(item.key, index);
              }}
            >
              {props.type == 'column' && (
                <Column color={TARGET_COLOR[index % TARGET_COLOR.length]} />
              )}
              {props.type == 'cuboid' && (
                <Cuboid color={TARGET_COLOR[index % TARGET_COLOR.length]} />
              )}
              {item.name}
              <div
                className={[
                  css['border_corner'],
                  css['border_corner_left_top'],
                ].join(' ')}
              ></div>
              <div
                className={[
                  css['border_corner'],
                  css['border_corner_right_top'],
                ].join(' ')}
              ></div>
              <div
                className={[
                  css['border_corner'],
                  css['border_corner_left_bottom'],
                ].join(' ')}
              ></div>
              <div
                className={[
                  css['border_corner'],
                  css['border_corner_right_bottom'],
                ].join(' ')}
              ></div>
            </div>
          );
        })}
    </div>
  );
}

export default TargetsSwitch;
