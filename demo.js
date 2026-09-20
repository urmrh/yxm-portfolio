'use strict';
const storageKey = 'hxy-focus-v1';
const seed = () => [
  {id:'demo-1', title:'梳理页面交互', category:'设计', state:'todo'},
  {id:'demo-2', title:'构建响应式页面', category:'开发', state:'doing'},
  {id:'demo-3', title:'记录新的灵感', category:'学习', state:'doing'},
  {id:'demo-4', title:'开始今天的专注时间', category:'学习', state:'completed'}
];
const states = {todo:'待开始',doing:'进行中',completed:'已完成'};
const categories = ['开发','设计','学习'];
let tasks = seed();
const statusEl = document.getElementById('status');
try {
  const saved = localStorage.getItem(storageKey);
  if (saved !== null) {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length > 1000 || parsed.some(t => !t || typeof t.id !== 'string' || typeof t.title !== 'string' || t.title.length > 80 || !Object.hasOwn(states,t.state) || !categories.includes(t.category)) || new Set(parsed.map(t=>t.id)).size !== parsed.length) throw new Error('Invalid data');
    tasks = parsed;
  }
} catch { statusEl.textContent = '本地数据不可用，已载入示例；接下来的操作仍可继续。'; }
function save(message) {
  try { localStorage.setItem(storageKey, JSON.stringify(tasks)); statusEl.textContent = message; }
  catch { statusEl.textContent = message + ' 当前浏览器无法保存，刷新后可能丢失。'; }
  render();
}
function render() {
  const query = document.getElementById('search').value.trim().toLowerCase();
  document.getElementById('total').textContent = tasks.length;
  document.getElementById('active').textContent = tasks.filter(t=>t.state==='doing').length;
  document.getElementById('done').textContent = tasks.filter(t=>t.state==='completed').length;
  for (const state of Object.keys(states)) {
    const list = document.getElementById(state);
    list.replaceChildren();
    const filtered = tasks.filter(t=>t.state===state && (t.title+' '+t.category).toLowerCase().includes(query));
    document.getElementById(state==='completed'?'done-count':state+'-count').textContent = filtered.length;
    if (!filtered.length) {
      const empty = document.createElement('p'); empty.className='empty'; empty.textContent=query?'没有匹配的任务':'这里还没有任务'; list.append(empty);
    }
    for (const task of filtered) {
      const card=document.createElement('article'); card.className='task';
      const category=document.createElement('span'); category.className='category'; category.textContent=task.category;
      const title=document.createElement('h3'); title.textContent=task.title;
      const actions=document.createElement('div'); actions.className='task-actions';
      const select=document.createElement('select'); select.setAttribute('aria-label','更改任务状态：'+task.title);
      for (const [value,label] of Object.entries(states)) {const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);}
      select.value=task.state;
      select.addEventListener('change',()=>{task.state=select.value;save('任务已移至「'+states[task.state]+'」。');const next=[...document.querySelectorAll('.task-actions select')].find(el=>el.getAttribute('aria-label')==='更改任务状态：'+task.title);if(next)next.focus();});
      const remove=document.createElement('button'); remove.type='button';remove.textContent='删除';remove.setAttribute('aria-label','删除任务：'+task.title);
      remove.addEventListener('click',()=>{if(window.confirm('删除任务「'+task.title+'」？')){tasks=tasks.filter(t=>t.id!==task.id);save('任务已删除。');document.getElementById('task-title').focus();}});
      actions.append(select,remove);card.append(category,title,actions);list.append(card);
    }
  }
}
document.getElementById('task-form').addEventListener('submit',event=>{
  event.preventDefault();const input=document.getElementById('task-title');const title=input.value.trim();
  if(!title){statusEl.textContent='请输入任务名称，不能只填写空格。';input.focus();return;}
  if(tasks.length>=1000){statusEl.textContent='演示最多保存 1000 个任务，请先删除部分任务。';return;}
  tasks.push({id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),title,category:document.getElementById('task-category').value,state:'todo'});
  input.value='';document.getElementById('search').value='';save('新任务已添加到「待开始」。');input.focus();
});
document.getElementById('search').addEventListener('input',render);
document.getElementById('reset').addEventListener('click',()=>{if(window.confirm('将清除当前任务并恢复四条示例数据，确定重置吗？')){tasks=seed();document.getElementById('search').value='';save('已恢复演示数据。');}});
render();
