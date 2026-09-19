// 成员管理：改造自作业五 manager-app
// 数据结构：{ id, name, sid, dept }，存于 localStorage['xh_members']

const memForm = document.getElementById('mem-form');
const memName = document.getElementById('mem-name');
const memSid = document.getElementById('mem-id');
const memDept = document.getElementById('mem-dept');
const memTip = document.getElementById('mem-tip');
const memList = document.getElementById('mem-list');
const memSearch = document.getElementById('mem-search');

let members = JSON.parse(localStorage.getItem('xh_members') || '[]');
let memKeyword = '';

const saveMem = () => localStorage.setItem('xh_members', JSON.stringify(members));

function renderMembers() {
  memList.innerHTML = '';
  const shown = members.filter(m =>
    m.name.includes(memKeyword) || m.sid.includes(memKeyword) || m.dept.includes(memKeyword)
  );
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item text-muted';
    li.textContent = members.length === 0 ? '暂无成员' : '没有找到匹配的成员';
    memList.appendChild(li);
    return;
  }
  shown.forEach(m => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
      <span><strong>${m.name}</strong> · ${m.sid} · <span class="text-muted">${m.dept}</span></span>
      <button class="btn btn-sm btn-outline-danger mem-del" data-id="${m.id}">删除</button>
    `;
    memList.appendChild(li);
  });
}

memForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = memName.value.trim();
  const sid = memSid.value.trim();
  const dept = memDept.value.trim() || '未分配';
  if (name === '') { memTip.textContent = '姓名不能为空'; return; }
  if (!/^\d{10}$/.test(sid)) { memTip.textContent = '学号需为10位数字'; return; }
  members.push({ id: Date.now().toString(), name, sid, dept });
  saveMem();
  memTip.textContent = '';
  memForm.reset();
  renderMembers();
});

memList.addEventListener('click', e => {
  if (!e.target.classList.contains('mem-del')) return;
  if (!confirm('确定删除这位成员吗？')) return;
  members = members.filter(m => m.id !== e.target.dataset.id);
  saveMem();
  renderMembers();
});

memSearch.addEventListener('input', e => {
  memKeyword = e.target.value.trim();
  renderMembers();
});

renderMembers();
