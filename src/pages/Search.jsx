import { useMemo, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Alert from '../components/Alert.jsx';
import EntryRow from '../components/EntryRow.jsx';
import { allEntries } from '../lib/db.js';
import { useLoad } from '../lib/useLoad.js';

const MAX = 64;

function snippet(body, term) {
  const i = body.toLowerCase().indexOf(term);
  if (i < 0) return '';
  const s = Math.max(0, i - 50);
  return (s > 0 ? '… ' : '') + body.slice(s, i + term.length + 70).replace(/\s+/g, ' ') + ' …';
}

export default function Search() {
  const [q, setQ] = useState('');
  const { data, error, loading, retry } = useLoad(allEntries, []);
  const term = q.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!data || term.length < 2) return [];
    return data
      .filter((e) => e.body.trim() && (e.title.toLowerCase().includes(term) || e.body.toLowerCase().includes(term)))
      .sort((a, b) => a.chapter - b.chapter || a.num.localeCompare(b.num));
  }, [data, term]);
  if (error) return <Alert message="Search could not load your entries." onRetry={retry} />;
  return (
    <section>
      <p className="eyebrow">Search</p>
      <h1>Find a memory</h1>
      <div className="search-wrap">
        <SearchIcon size={18} />
        <input
          className="field"
          type="search"
          maxLength={MAX}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles and entries"
          aria-label="Search"
        />
      </div>
      {loading ? null : term.length < 2 ? (
        <p className="meta">Type at least 2 characters.</p>
      ) : hits.length === 0 ? (
        <p className="meta">No entries match.</p>
      ) : (
        <ul className="list">
          {hits.map((e) => <EntryRow key={e.key} e={e} extra={snippet(e.body, term)} />)}
        </ul>
      )}
    </section>
  );
}
