// 活动管理：改造自作业五 todo-app
// 数据结构：{ id, text, done }，存于 localStorage['xh_activities']

const actForm = document.getElementById('act-form');
const actInput = document.getElementById('act-input');
const actTip = document.getElementById('act-tip');
const actList = document.getElementById('act-list');
const actFilters = document.querySelectorAll('.act-filter');

let activities = JSON.parse(localStorage.getItem('xh_activities') || '[]');
let actFilter = 'all'; // all / active / done

const saveAct = () => localStorage.setItem('xh_activities', JSON.stringify(activities));

function renderActivities() {
  actList.innerHTML = '';
  const shown = activities.filter(a =>
    actFilter === 'all' ? true : actFilter === 'active' ? !a.done : a.done
  );
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item text-muted';
    li.textContent = activities.length === 0 ? '暂无活动，添加一个吧' : '没有符合条件的活动';
    actList.appendChild(li);
    return;
  }
  shown.forEach(a => {
    const li = document.createElement('li');
    li.className = 'list-group-item' + (a.done ? ' done' : '');
    li.innerHTML = `
      <span class="act-text">${a.text}</span>
      <span class="badge ${a.done ? 'bg-success' : 'bg-warning text-dark'} me-2">${a.done ? '已完成' : '进行中'}</span>
      <button class="btn btn-sm btn-outline-danger act-del" data-id="${a.id}">删除</button>
    `;
    actList.appendChild(li);
  });
}

actForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = actInput.value.trim();
  if (text === '') { actTip.textContent = '活动名称不能为空'; return; }
  activities.unshift({ id: Date.now().toString(), text, done: false });
  saveAct();
  actTip.textContent = '';
  actInput.value = '';
  renderActivities();
});

actList.addEventListener('click', e => {
  if (e.target.classList.contains('act-text')) {
    const id = e.target.parentElement.querySelector('.act-del').dataset.id;
    const a = activities.find(x => x.id === id);
    if (a) { a.done = !a.done; saveAct(); renderActivities(); }
  }
  if (e.target.classList.contains('act-del')) {
    if (!confirm('确定删除这个活动吗？')) return;
    activities = activities.filter(a => a.id !== e.target.dataset.id);
    saveAct();
    renderActivities();
  }
});

actFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    actFilters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    actFilter = btn.dataset.filter;
    renderActivities();
  });
});

renderActivities();
