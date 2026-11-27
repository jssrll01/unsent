import { Link, useParams } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import NotFound from './NotFound.jsx';
import { chapterById, entryKey, pad } from '../lib/chapters.js';
import { allEntries } from '../lib/db.js';
import { useLoad } from '../lib/useLoad.js';

export default function Chapter() {
  const { chapter } = useParams();
  const ch = chapterById(chapter);
  const { data, error, retry } = useLoad(allEntries, []);
  if (!ch) return <NotFound />;
  if (error) return <Alert message="The chapter could not be loaded." onRetry={retry} />;
  const map = new Map((data || []).map((e) => [e.key, e]));
  const nums = Array.from({ length: ch.count }, (_, i) => pad(i + 1));
  return (
    <section>
      <p className="eyebrow">Chapter {ch.id}</p>
      <h1>{ch.title}</h1>
      <ul className="num-grid">
        {nums.map((n) => {
          const e = map.get(entryKey(ch.id, n));
          const done = !!(e && e.body.trim());
          return (
            <li key={n}>
              <Link className={done ? 'num done' : 'num'} to={`/chapter/${ch.id}/entry/${n}`} title={done ? e.title : 'Not written yet'}>
                {n}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
