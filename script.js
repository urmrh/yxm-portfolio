document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('urmrhr@gmail.com');
    status.textContent = '邮箱已复制，期待你的来信。';
  } catch {
    status.textContent = '请长按或选中复制：urmrhr@gmail.com';
  }
});
