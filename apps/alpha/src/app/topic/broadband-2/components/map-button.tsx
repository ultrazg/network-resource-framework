import { useEffect, useState } from 'react';
import css from '../broadband.module.scss';

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
    </>
  );
}

export default ButtonGroup;
