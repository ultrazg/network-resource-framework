import React, { useEffect, useRef } from 'react';

import './animate-number.module.scss';

import * as d3 from 'd3';

export interface AnimateNumberProps {
  fontFamily?: string;
  value: number;
  color: string;
  size: number;
  duration: number;
  toFixed?: number; // 仅作为标志位, 0 作为整数，任意值 作为小数
}

export function AnimateNumber(props: AnimateNumberProps) {
  const animateNumRef = useRef(null);

  useEffect(() => {
    const t = d3.transition().duration(props.duration);

    d3.select(animateNumRef.current)
      .transition(t as unknown as string)
      .text(props.value)
      .attr('style', function () {
        return props.fontFamily
          ? `font-size: ${props.size}px; color: ${props.color}; font-family: ${props.fontFamily}`
          : `font-size: ${props.size}px; color: ${props.color};`;
      })
      .tween('d', function () {
        const val = Number(props.value);
        const i = d3.interpolateNumber(0, val);
        return (t) => {
          if (props.toFixed) {
            d3.select(this).text(i(t).toLocaleString());
          } else {
            d3.select(this).text(Math.ceil(i(t)).toLocaleString());
          }
        };
      });
  }, [props.value]);
  return (
    <>
      <span ref={animateNumRef}>{props.value}</span>
    </>
  );
}

export default AnimateNumber;
