import React from 'react';
import { Col, Row } from 'antd';
import { formatLabel } from '@alpha/app/topic-tj/utils/utils'
import styles from './info.module.scss';

/* eslint-disable-next-line */
export interface InfoItemDecorator {
  /** 文本 */
  label?: string;
  /** col span */
  span?: number;
  /** col offset */
  offset?: number;
  /** 固定宽度 */
  width?: number;
  /** 内容 */
  text?: any;
  /** id */
  props?: string;
  /** 自定义内容 */
  customerValue?: React.ReactNode;
}

export interface InfoProps {
  infos: InfoItemDecorator[][];
  rowClassName?: string;
  divider?: boolean;
  title?: string;
}

export function Info(props: InfoProps) {
  const hasSetSpan = (items: InfoItemDecorator[]) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].span !== undefined) {
        return true;
      }
    }
    return false;
  }
  return (
    <div className={styles['container']}>
        {props.infos.map((items, index) => {
          let span: number = 1;
          if (!hasSetSpan(items)) {
            span = 24 / items.length;
          }
          return (
            <Row className={props.rowClassName} key={index.toString()}>
              {items.map((item, index2) => {
                let style: React.CSSProperties = {};
                if (item.width) {
                  style = {
                    ...style,
                    width: `${item.width}px`,
                  };
                }
                return (
                  <Col style={style} span={item.span || span} offset={item.offset} key={index2.toString()}>
                    {item.customerValue ? item.customerValue
                      : <div className={styles['ant-form-text']}>
                        <span className={styles['label']}>{formatLabel(item.label as string)}</span>
                        <span className={styles['text']}>{item.text}</span>
                        </div>}
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </div>
  );
}

export default Info;
