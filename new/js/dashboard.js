// 数据看板：改造自作业六 dashboard
// ECharts 柱状图（月度参与人次）+ Chart.js 环形图（部门分布）
// 支持 ?demo=error 和 ?demo=empty 演示异常

const dashState = { data: null };
const demo = new URLSearchParams(location.search).get('demo');

async function loadDashboard() {
  const statusEl = document.getElementById('dash-status');
  statusEl.classList.add('d-none');
  try {
    if (demo === 'error') throw new Error('演示模式：模拟网络失败');
    const res = await fetch('data/club-stats.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    let data = await res.json();
    if (demo === 'empty') data = { ...data, participation: [], departments: [] };

    if (data.participation.length === 0) {
      statusEl.textContent = '暂无数据';
      statusEl.classList.remove('d-none');
      return;
    }
    dashState.data = data;
    document.getElementById('dash-subtitle').textContent = data.title;
    renderCards(data);
    renderBarChart(data);
    renderDoughnut(data);
    document.getElementById('dash-source').textContent = `数据来源：${data.source}　|　单位：${data.unit}`;
  } catch (err) {
    console.error('看板加载失败：', err);
    statusEl.textContent = '加载失败：' + err.message;
    statusEl.classList.remove('d-none');
  }
}

function renderCards(data) {
  const total = data.participation.reduce((s, n) => s + n, 0);
  const avg = Math.round(total / data.participation.length);
  const deptCount = data.departments.length;
  const peak = Math.max(...data.participation);
  const cards = [
    { label: '累计参与', value: total + ' ' + data.unit, color: 'primary' },
    { label: '月均参与', value: avg + ' ' + data.unit, color: 'success' },
    { label: '部门数量', value: deptCount + ' 个', color: 'info' },
    { label: '单月峰值', value: peak + ' ' + data.unit, color: 'warning' }
  ];
  document.getElementById('dash-cards').innerHTML = cards.map(c => `
    <div class="col-6 col-lg-3">
      <div class="card border-0 shadow-sm">
        <div class="card-body text-center">
          <p class="text-muted mb-1">${c.label}</p>
          <p class="fs-3 fw-bold text-${c.color} mb-0">${c.value}</p>
        </div>
      </div>
    </div>
  `).join('');
}

let barChart = null;
function renderBarChart(data) {
  if (barChart === null) barChart = echarts.init(document.getElementById('bar-chart'));
  barChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, bottom: 40, top: 30 },
    xAxis: { type: 'category', data: data.months },
    yAxis: { type: 'value', name: data.unit },
    series: [{
      type: 'bar', data: data.participation,
      itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#5c6bc0' }, { offset: 1, color: '#1a237e' }
      ])},
      label: { show: true, position: 'top' }
    }]
  });
}

let doughnutChart = null;
function renderDoughnut(data) {
  if (doughnutChart !== null) doughnutChart.destroy();
  const ctx = document.getElementById('doughnut-chart');
  const isMobile = window.innerWidth < 576;
  doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.departments.map(d => d.name),
      datasets: [{
        data: data.departments.map(d => d.count),
        backgroundColor: ['#5c6bc0', '#26c6da', '#ffca28', '#ef5350', '#66bb6a']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: isMobile ? 'bottom' : 'right' } }
    }
  });
}

window.addEventListener('resize', () => {
  if (barChart) barChart.resize();
});

loadDashboard();
