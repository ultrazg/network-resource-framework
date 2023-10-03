import css from '../wireless-network.module.scss';

/* eslint-disable-next-line */
export interface ButtonGroupProps {
  setValue: Function;
  target: string;
  names: string[];
  top?: string;
  width?: string;
  allowEmpty?: boolean;
}

export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <>
      <div
        className={css['type']}
        style={{
          top: `${props.top ? props.top : '30px'}`,
          width: `${props.width ? props.width : '360px'}`,
        }}
      >
        {props.names.map((t, index) => {
          return (
            <div
              className={`${css['item']} ${
                props.target === t ? css['active'] : ''
              }`}
              key={t}
              onClick={() => {
                let value = t;
                if (props.allowEmpty) value = t === props.target ? '' : t;
                props.setValue(value);
              }}
            >
              {t}
              {['border_corner_left_top', 'border_corner_right_top', 'border_corner_left_bottom', 'border_corner_right_bottom'].map(data => {
              return (<div
                key={data}
                className={[
                  css['border_corner'],
                  css[data],
                ].join(' ')}
              ></div>)})}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ButtonGroup;
