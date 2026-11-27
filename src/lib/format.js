export function fmtDate(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d || '')) return '';
  return new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}
