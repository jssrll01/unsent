const KEY = 'unsent-theme';

export function getTheme() {
  try { return localStorage.getItem(KEY) || 'light'; } catch { return 'light'; }
}

export function applyTheme(t) {
  const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

export function setTheme(t) {
  try { localStorage.setItem(KEY, t); } catch { /* storage blocked, theme lasts this session */ }
  applyTheme(t);
}
