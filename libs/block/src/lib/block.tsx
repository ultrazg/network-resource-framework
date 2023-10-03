import React, { Fragment } from 'react';

import css from './block.module.scss';

export interface BlockProps {
  blockStyle: any;
  blockCorner: boolean;
  blockBackground: boolean;
  title?: string;
  subTitle?: string;
  children: any;
  id?: string;
}

export function Block(props: BlockProps) {
  return (
    <div
      className={props.blockBackground ? 'block background' : 'block'}
      style={props.blockStyle}
      id={props.id ? props.id : ''}
    >
      <div className={'box'}>
        {props.blockCorner && (
          <Fragment>
            <div className={`tl corner`}></div>
            <div className={`tr corner`}></div>
            <div className={`br corner`}></div>
            <div className={`bl corner`}></div>
          </Fragment>
        )}

        <div className={props.blockCorner ? 'content' : 'default'}>
          {props.title && (
            <div
              className={'title'}
              dangerouslySetInnerHTML={{ __html: props.title }}
            ></div>
          )}
          {props.subTitle && (
            <div className={'sub-title'}>{props.subTitle}</div>
          )}

          <div className={'area'}>{props.children}</div>
        </div>
      </div>
    </div>
  );
}

export default Block;
