import React from 'react';

/**
 * 格式化Label
 * @param label 标签字符串
 */
export function formatLabel(label: string): React.ReactElement<any> {
  return <span className="label">{label || ''}：</span>;
}
/**
 * 数字转万
 * @param value 数字或者字符串
 */
export function transformValue(value: any, unit?:Boolean): React.ReactElement<any> {
  if(value - 10000 > 0){
    if(!unit) return <span>{(value/10000).toFixed(2) + '万'}</span>
    else return <span>{(value/10000).toFixed(2)}</span>
  }
  else{
    return <span>{value}</span>
  }
}
