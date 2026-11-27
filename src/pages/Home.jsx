import { Link } from 'react-router-dom';
import { BookOpen, PenLine } from 'lucide-react';
import Alert from '../components/Alert.jsx';
import { CHAPTERS, NOVEL_TITLE, TAGLINE, pad } from '../lib/chapters.js';
import { allEntries } from '../lib/db.js';
import { useLoad } from '../lib/useLoad.js';

export default function Home() {
  const { data, error, loading, retry } = useLoad(allEntries, []);
  if (error) return <Alert message="Your entries could not be loaded." onRetry={retry} />;
  const ch = CHAPTERS[0];
  const written = new Set((data || []).filter((e) => e.body.trim()).map((e) => e.key));
  let next = 1;
  while (next <= ch.count && written.has(`${ch.id}-${pad(next)}`)) next += 1;
  return (
    <section className="cover">
      <p className="eyebrow">A diary novel</p>
      <h1>{NOVEL_TITLE}</h1>
      <blockquote className="tagline">{TAGLINE}</blockquote>
      <div className="cover-actions">
        <Link className="btn primary" to={`/chapter/${ch.id}`}>
          <BookOpen size={18} /> Open Chapter {ch.id}
        </Link>
        {next <= ch.count && (
          <Link className="btn" to={`/chapter/${ch.id}/entry/${pad(next)}/write`}>
            <PenLine size={18} /> Write entry {pad(next)}
          </Link>
        )}
      </div>
      <p className="meta">{loading ? '' : `${written.size} of ${ch.count} entries written`}</p>
    </section>
  );
}
