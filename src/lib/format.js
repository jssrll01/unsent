export function fmtDate(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d || '')) return '';
  return new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}

export function monthLabel(ym) {
  if (!/^\d{4}-\d{2}$/.test(ym || '')) return 'Undated';
  return new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', timeZone: 'UTC',
  });
}

export const today = () => new Date().toLocaleDateString('en-CA');

export function wordCount(t) {
  const s = (t || '').trim();
  return s ? s.split(/\s+/).length : 0;
}
