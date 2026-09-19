// 自习室查询：按楼层 / 开放状态筛选
// 数据写死在数组中，模拟后端返回

const rooms = [
  { id: 'A101', name: '图书馆一楼自习室A', floor: 1, open: true,  seats: 80,  current: 65 },
  { id: 'A102', name: '图书馆一楼自习室B', floor: 1, open: true,  seats: 60,  current: 40 },
  { id: 'A201', name: '图书馆二楼自习室',   floor: 2, open: true,  seats: 100, current: 88 },
  { id: 'A301', name: '图书馆三楼自习室',   floor: 3, open: false, seats: 120, current: 0  },
  { id: 'B101', name: '教学楼B101',         floor: 1, open: true,  seats: 50,  current: 30 },
  { id: 'B201', name: '教学楼B201',         floor: 2, open: true,  seats: 50,  current: 45 },
  { id: 'C301', name: '教学楼C301',         floor: 3, open: true,  seats: 40,  current: 10 }
];

const listEl = document.getElementById('room-list');
const countEl = document.getElementById('room-count');
const floorSelect = document.getElementById('filter-floor');
const openSelect = document.getElementById('filter-open');

function render() {
  const floor = floorSelect.value;        // 空字符串表示全部
  const open = openSelect.value;          // 'true' / 'false' / ''

  const filtered = rooms.filter(r => {
    if (floor && String(r.floor) !== floor) return false;
    if (open !== '' && String(r.open) !== open) return false;
    return true;
  });

  countEl.textContent = `共 ${filtered.length} 间`;

  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="col-12"><div class="alert alert-warning">没有符合条件的自习室</div></div>';
    return;
  }

  listEl.innerHTML = filtered.map(r => {
    const ratio = r.seats > 0 ? Math.round(r.current / r.seats * 100) : 0;
    const badge = r.open
      ? '<span class="badge bg-success">开放</span>'
      : '<span class="badge bg-secondary">关闭</span>';
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">${r.name}</h5>
              ${badge}
            </div>
            <p class="text-muted mb-1">编号：${r.id} · ${r.floor}楼</p>
            <p class="mb-1">座位：${r.current} / ${r.seats}</p>
            <div class="progress" style="height: 8px;">
              <div class="progress-bar" role="progressbar" style="width: ${ratio}%"></div>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// 任一筛选条件变化即重渲染
floorSelect.addEventListener('change', render);
openSelect.addEventListener('change', render);

render();
