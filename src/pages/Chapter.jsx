import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import NotFound from './NotFound.jsx';
import { chapterById, pad } from '../lib/chapters.js';
import { getEntry } from '../chapters/index.js';

export default function Chapter() {
  const { chapter } = useParams();
  const ch = chapterById(chapter);
  if (!ch) return <NotFound />;
  const nums = Array.from({ length: ch.count }, (_, i) => pad(i + 1));
  return (
    <section>
      <Link className="back" to="/"><ChevronLeft size={16} /> All chapters</Link>
      <p className="eyebrow">Chapter {ch.id}</p>
      <h1>{ch.title}</h1>
      <ul className="num-grid">
        {nums.map((n, i) => {
          const e = getEntry(ch.id, n);
          return (
            <li key={n} style={{ '--i': i }}>
              {e ? (
                <Link className="num done" to={`/chapter/${ch.id}/entry/${n}`} title={e.title}>{n}</Link>
              ) : (
                <span className="num" aria-disabled="true">{n}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
