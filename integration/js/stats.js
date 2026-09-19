// 使用统计：加载 data.json 渲染各自习室使用量柱状图
// 图表包含：标题、单位、数据来源

(async function () {
  const chartEl = document.getElementById('usage-chart');
  const sourceEl = document.getElementById('chart-source');
  if (!chartEl) return;

  let data;
  try {
    const res = await fetch('data.json');
    data = await res.json();
  } catch (err) {
    console.error('加载 data.json 失败：', err);
    sourceEl.textContent = '数据加载失败，请检查网络或 data.json 是否存在。';
    return;
  }

  const names = data.rooms.map(r => r.name);
  const usages = data.rooms.map(r => r.usage);

  const chart = echarts.init(chartEl);
  chart.setOption({
    title: {
      text: '各自习室近7日使用量',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: p => `${p[0].name}<br/>使用量：${p[0].value} ${data.unit}`
    },
    grid: { left: 50, right: 30, bottom: 60, top: 60 },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: { rotate: 20 }
    },
    yAxis: {
      type: 'value',
      name: `使用量（${data.unit}）`
    },
    series: [{
      name: '使用量',
      type: 'bar',
      data: usages,
      itemStyle: { color: '#0d6efd' },
      label: { show: true, position: 'top' }
    }]
  });

  sourceEl.textContent = `数据来源：${data.source}　|　单位：${data.unit}`;

  // 窗口尺寸变化时重绘
  window.addEventListener('resize', () => chart.resize());
})();
