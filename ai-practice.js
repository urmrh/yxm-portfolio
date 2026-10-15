document.getElementById('year').textContent = new Date().getFullYear();

const suggestionButton = document.getElementById('show-suggestion');
const suggestionResult = document.getElementById('suggestion-result');
const announcement = document.getElementById('demo-announcement');

suggestionButton.addEventListener('click', () => {
  const isVisible = suggestionButton.getAttribute('aria-expanded') === 'true';
  suggestionButton.setAttribute('aria-expanded', String(!isVisible));
  suggestionResult.hidden = isVisible;
  suggestionButton.innerHTML = isVisible
    ? '查看预设建议 <span>↗</span>'
    : '收起预设建议 <span>↑</span>';
  announcement.textContent = isVisible
    ? '预设建议已收起；未保存任何内容。'
    : '已显示固定演示建议；未调用模型，也未保存内容。';
});

const subscriptionButton = document.getElementById('subscription-toggle');
const subscriptionStatus = document.getElementById('subscription-status');

subscriptionButton.addEventListener('click', () => {
  const isSubscribed = subscriptionButton.getAttribute('aria-pressed') === 'true';
  subscriptionButton.setAttribute('aria-pressed', String(!isSubscribed));
  subscriptionButton.textContent = isSubscribed ? '开启示意' : '暂停示意';
  subscriptionStatus.textContent = isSubscribed
    ? '尚未开启 · 仅切换本页示意状态'
    : '示意已开启 · 不会发送真实提醒';
  announcement.textContent = isSubscribed
    ? '订阅示意已暂停；没有通知被发送。'
    : '订阅示意已开启；没有连接真实通知服务。';
});
