import { allEntries } from './db.js';
import { CHAPTERS, NOVEL_TITLE } from './chapters.js';
import { fmtDate } from './format.js';

async function collect() {
  const list = (await allEntries()).filter((e) => e.body.trim());
  return CHAPTERS.map((c) => ({
    c,
    items: list.filter((e) => e.chapter === c.id).sort((a, b) => a.num.localeCompare(b.num)),
  })).filter((g) => g.items.length);
}

function build(groups, md) {
  const out = [md ? `# ${NOVEL_TITLE}` : NOVEL_TITLE, ''];
  for (const { c, items } of groups) {
    out.push(md ? `## Chapter ${c.id}: ${c.title}` : `CHAPTER ${c.id}: ${c.title}`, '');
    for (const e of items) {
      out.push(md ? `### Entry ${e.num}: ${e.title}` : `Entry ${e.num}: ${e.title}`);
      if (e.date) out.push(md ? `*${fmtDate(e.date)}*` : fmtDate(e.date));
      out.push('', e.body, '');
    }
  }
  return out.join('\n');
}

export async function exportNovel(kind) {
  const groups = await collect();
  if (!groups.length) throw new Error('There is nothing written to export yet.');
  const md = kind === 'md';
  const blob = new Blob([build(groups, md)], { type: md ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = md ? 'the-stranger-who-felt-like-home.md' : 'the-stranger-who-felt-like-home.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
