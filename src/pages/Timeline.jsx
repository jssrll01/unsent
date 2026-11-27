import { Link } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import Alert from '../components/Alert.jsx';
import EntryRow from '../components/EntryRow.jsx';
import { CHAPTERS, pad } from '../lib/chapters.js';
import { allEntries } from '../lib/db.js';
import { fmtDate, monthLabel } from '../lib/format.js';
import { useLoad } from '../lib/useLoad.js';

export default function Timeline() {
  const { data, error, loading, retry } = useLoad(allEntries, []);
  if (error) return <Alert message="The timeline could not be loaded." onRetry={retry} />;
  if (loading) return <div className="boot" aria-busy="true" />;
  const list = data
    .filter((e) => e.body.trim())
    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999') || a.chapter - b.chapter || a.num.localeCompare(b.num));
  const groups = [];
  for (const e of list) {
    const ym = e.date ? e.date.slice(0, 7) : '';
    const last = groups[groups.length - 1];
    if (last && last.ym === ym) last.items.push(e);
    else groups.push({ ym, items: [e] });
  }
  if (!groups.length) {
    return (
      <section className="empty">
        <h1>The timeline begins with a first entry</h1>
        <p>Entries appear here in order, grouped by month.</p>
        <Link className="btn primary" to={`/chapter/${CHAPTERS[0].id}/entry/${pad(1)}/write`}>
          <PenLine size={18} /> Write entry {pad(1)}
        </Link>
      </section>
    );
  }
  return (
    <section>
      <p className="eyebrow">Timeline</p>
      <h1>In the order it happened</h1>
      {groups.map((g) => (
        <div key={g.ym || 'undated'}>
          <h2 className="group-title">{monthLabel(g.ym)}</h2>
          <ul className="list">
            {g.items.map((e) => <EntryRow key={e.key} e={e} extra={fmtDate(e.date)} />)}
          </ul>
        </div>
      ))}
    </section>
  );
}
