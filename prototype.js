document.getElementById('year').textContent = new Date().getFullYear();

const initialJobs = [
  { company: '青禾科技', role: '产品助理', stage: 0, next: '完善作品集案例' },
  { company: '远山网络', role: '产品实习生', stage: 1, next: '周五跟进投递进度' },
  { company: '知行教育', role: '用户运营', stage: 2, next: '准备业务面试' },
  { company: '微光互联', role: '产品专员', stage: 3, next: '本轮流程已结束' }
];
const stages = ['待投递', '已投递', '面试中', '已结束'];
let jobs = initialJobs.map((job) => ({ ...job }));
let jobFilter = '全部';
let addedSample = false;
const jobStats = document.getElementById('job-stats');
const jobFilters = document.getElementById('job-filters');
const jobBoard = document.getElementById('job-board');
const jobStatus = document.getElementById('job-status');
const addJobButton = document.getElementById('add-job');

function renderJobs() {
  const nextCount = jobs.filter((job) => job.stage < 3).length;
  const interviewCount = jobs.filter((job) => job.stage === 2).length;
  jobStats.innerHTML =
    '<div class="job-stat"><span>跟进岗位</span><b>' + jobs.length + '</b></div>' +
    '<div class="job-stat"><span>待行动</span><b>' + nextCount + '</b></div>' +
    '<div class="job-stat"><span>面试中</span><b>' + interviewCount + '</b></div>';
  jobFilters.innerHTML = ['全部'].concat(stages).map((label) =>
    '<button type="button" class="job-filter' + (jobFilter === label ? ' active' : '') + '" data-job-filter="' + label + '" aria-pressed="' + (jobFilter === label) + '">' + label + '</button>'
  ).join('');
  jobBoard.innerHTML = stages.map((stage, index) => {
    const cards = jobs.filter((job) => job.stage === index && (jobFilter === '全部' || jobFilter === stage));
    const contents = cards.length ? cards.map((job) =>
      '<article class="job-card"><span class="job-card-company">' + job.company + '</span><div class="job-card-role">' + job.role + '</div><p class="job-card-next">下一步 · ' + job.next + '</p><button type="button" class="job-advance" data-advance="' + jobs.indexOf(job) + '">' + (index === 3 ? '移回待投递' : '推进到下一步') + '</button></article>'
    ).join('') : '<p class="job-empty">暂无岗位</p>';
    return '<section class="job-column" aria-label="' + stage + '岗位"><div class="job-column-head">' + stage + '<i>' + cards.length + '</i></div>' + contents + '</section>';
  }).join('');
  addJobButton.disabled = addedSample;
  addJobButton.textContent = addedSample ? '已添加演示岗位' : '＋ 添加演示岗位';
  jobBoard.querySelectorAll('[data-advance]').forEach((button) => {
    button.addEventListener('click', () => {
      const job = jobs[Number(button.dataset.advance)];
      job.stage = job.stage === 3 ? 0 : job.stage + 1;
      job.next = job.stage === 0 ? '补全简历与作品集' : job.stage === 1 ? '查看投递反馈' : job.stage === 2 ? '准备下一轮沟通' : '本轮流程已结束';
      jobStatus.textContent = job.company + '已更新为“' + stages[job.stage] + '”。';
      renderJobs();
    });
  });
  jobFilters.querySelectorAll('[data-job-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      jobFilter = button.dataset.jobFilter;
      renderJobs();
    });
  });
}
document.getElementById('add-job').addEventListener('click', () => {
  if (addedSample) return;
  jobs.push({ company: '溪云科技', role: '产品助理', stage: 0, next: '补全简历与作品集' });
  addedSample = true;
  jobStatus.textContent = '已添加一条虚构岗位，可点击卡片推进阶段。';
  renderJobs();
});
document.getElementById('job-reset').addEventListener('click', () => {
  jobs = initialJobs.map((job) => ({ ...job }));
  jobFilter = '全部';
  addedSample = false;
  jobStatus.textContent = '演示已重置。';
  renderJobs();
});
renderJobs();

const activities = [
  { id: 'career', category: '成长', date: '10月18日 · 14:00', title: '职业力工作坊', description: '和学长学姐一起拆解简历与面试准备。', location: '图书馆 · 创客空间', capacity: '还可报名 12 人' },
  { id: 'green', category: '校园', date: '10月20日 · 11:30', title: '校园无塑日', description: '从自带水杯开始，加入一天的绿色校园行动。', location: '中心广场 · 南门集合', capacity: '还可报名 28 人' },
  { id: 'run', category: '运动', date: '10月22日 · 19:00', title: '校园夜跑计划', description: '轻松跑完三公里，认识一起运动的新朋友。', location: '田径场 · 东看台', capacity: '还可报名 16 人' },
  { id: 'reading', category: '成长', date: '10月25日 · 15:00', title: '把阅读变成习惯', description: '用一小时共读一本短书，再交换一个新想法。', location: '图书馆 · 二楼研讨室', capacity: '还可报名 8 人' }
];
let activeActivityCategory = '全部';
let showBookings = false;
const registered = new Set();
const activityFilters = document.getElementById('activity-filters');
const activityList = document.getElementById('activity-list');
const activityStatus = document.getElementById('activity-status');
const bookingsButton = document.getElementById('my-bookings');

function renderActivities() {
  const categories = ['全部', '校园', '成长', '运动'];
  activityFilters.innerHTML = categories.map((category) =>
    '<button type="button" class="activity-filter' + (activeActivityCategory === category ? ' active' : '') + '" data-category="' + category + '" aria-pressed="' + (activeActivityCategory === category) + '">' + category + '</button>'
  ).join('');
  const visibleActivities = activities.filter((activity) => {
    const matchesCategory = activeActivityCategory === '全部' || activity.category === activeActivityCategory;
    return matchesCategory && (!showBookings || registered.has(activity.id));
  });
  activityList.innerHTML = visibleActivities.length ? visibleActivities.map((activity) => {
    const isRegistered = registered.has(activity.id);
    return '<article class="activity-card"><div class="activity-card-top"><span class="activity-category">' + activity.category + '</span><span class="activity-date">' + activity.date + '</span></div><h5>' + activity.title + '</h5><p class="activity-description">' + activity.description + '</p><div class="activity-location">⌖ ' + activity.location + '</div><div class="activity-card-bottom"><span class="activity-capacity">' + activity.capacity + '</span><button type="button" class="activity-signup' + (isRegistered ? ' registered' : '') + '" data-activity="' + activity.id + '" aria-pressed="' + isRegistered + '">' + (isRegistered ? '已报名 · 取消' : '我要报名') + '</button></div></article>';
  }).join('') : '<p class="activity-empty">这里还没有活动。<br>切换分类，继续发现新安排。</p>';
  bookingsButton.setAttribute('aria-pressed', String(showBookings));
  bookingsButton.innerHTML = (showBookings ? '全部活动' : '我的报名') + ' <b id="booking-count">' + registered.size + '</b>';
  activityFilters.querySelectorAll('[data-category]').forEach((button) => {
    button.addEventListener('click', () => {
      activeActivityCategory = button.dataset.category;
      renderActivities();
    });
  });
  activityList.querySelectorAll('[data-activity]').forEach((button) => {
    button.addEventListener('click', () => {
      const activity = activities.find((item) => item.id === button.dataset.activity);
      if (registered.has(activity.id)) {
        registered.delete(activity.id);
        activityStatus.textContent = '已取消“' + activity.title + '”的报名。';
      } else {
        registered.add(activity.id);
        activityStatus.textContent = '报名成功：' + activity.title + '。';
      }
      renderActivities();
    });
  });
}
bookingsButton.addEventListener('click', () => {
  showBookings = !showBookings;
  activeActivityCategory = '全部';
  activityStatus.textContent = showBookings ? '正在查看已报名活动。' : '正在查看全部活动。';
  renderActivities();
});
renderActivities();