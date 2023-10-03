import * as echarts from 'echarts';
import 'echarts-liquidfill';
export const resetSize = (chartDom, change = true) => {
  const zoom = (1 / window.innerWidth) * 1920;
  chartDom.style.zoom = zoom;
  chartDom.style.transform = 'scale(' + 1 / zoom + ')';
  chartDom.style.transformOrigin = '0%0%';
  if (change) chartDom.style.width = zoom * 100 + '%';

  window.addEventListener('resize', () => {
    if (chartDom) {
      chartDom.style.zoom = zoom;
      chartDom.style.transform = 'scale(' + 1 / zoom + ')';
      chartDom.style.transformOrigin = '0%0%';
      if (change) chartDom.style.width = zoom * 100 + '%';
    }
  });
};

export const chartInit = (chart, chartDom) => {
  if (chart != null && chart != '' && chart != undefined) {
    chart.dispose(); //销毁
  }
  chart = echarts.init(chartDom);

  chart.showLoading({
    text: '加载中...',
    color: '#0EFCFF',
    textColor: '#0EFCFF',
    maskColor: 'rgba(255, 255, 255, 0)',
    zlevel: 0,
  });

  return chart;
};
