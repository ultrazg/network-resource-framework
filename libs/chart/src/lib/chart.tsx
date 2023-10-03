import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { merge } from 'lodash';

import css from './chart.module.scss';

export interface ChartProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  option: Object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  data?: Object;
}

export function Chart(props: ChartProps) {
  const chartRef = useRef(null);

  useEffect(() => {
    const option = props.data
      ? merge(props.option, props.data)
      : JSON.parse(JSON.stringify(props.option));

    const chartIns = echarts.getInstanceByDom(
      chartRef.current as unknown as HTMLElement
    );
    if (chartIns) {
      chartIns.setOption(option, true);
    } else {
      const chart = echarts.init(
        chartRef.current as unknown as HTMLElement,
        {},
        { renderer: 'svg' }
      );
      chart.setOption(option, true);
    }
  }, [props.data]);

  return (
    <>
      <div className={css['chart']} ref={chartRef}></div>
    </>
  );
}

export default Chart;
