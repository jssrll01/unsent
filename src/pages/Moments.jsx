import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Alert from '../components/Alert.jsx';
import EntryRow from '../components/EntryRow.jsx';
import { CHAPTERS } from '../lib/chapters.js';
import { allEntries } from '../lib/db.js';
import { fmtDate } from '../lib/format.js';
import { useLoad } from '../lib/useLoad.js';

export default function Moments() {
  const { data, error, loading, retry } = useLoad(allEntries, []);
  if (error) return <Alert message="Your moments could not be loaded." onRetry={retry} />;
  if (loading) return <div className="boot" aria-busy="true" />;
  const list = data
    .filter((e) => e.pinned && e.body.trim())
    .sort((a, b) => a.chapter - b.chapter || a.num.localeCompare(b.num));
  if (!list.length) {
    return (
      <section className="empty">
        <h1>No moments kept yet</h1>
        <p>Open an entry and tap the bookmark to keep a moment you never want to lose.</p>
        <Link className="btn primary" to={`/chapter/${CHAPTERS[0].id}`}>
          <BookOpen size={18} /> Open Chapter {CHAPTERS[0].id}
        </Link>
      </section>
    );
  }
  return (
    <section>
      <p className="eyebrow">Moments</p>
      <h1>Kept close</h1>
      <ul className="list">
        {list.map((e) => <EntryRow key={e.key} e={e} extra={fmtDate(e.date)} />)}
      </ul>
    </section>
  );
}
