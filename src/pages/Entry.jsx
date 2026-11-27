import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight, Minus, Pencil, PenLine, Plus, Trash2 } from 'lucide-react';
import Alert from '../components/Alert.jsx';
import NotFound from './NotFound.jsx';
import { chapterById, entryKey, pad, validNum } from '../lib/chapters.js';
import { deleteEntry, getEntry, saveEntry } from '../lib/db.js';
import { fmtDate } from '../lib/format.js';
import { useLoad } from '../lib/useLoad.js';

const FS = [15, 17, 19, 21, 23, 25];

function readFs() {
  try {
    const v = Number(localStorage.getItem('unsent-fs'));
    return FS.includes(v) ? v : 19;
  } catch {
    return 19;
  }
}

export default function Entry() {
  const { chapter, num } = useParams();
  const ch = chapterById(chapter);
  const ok = !!ch && validNum(ch, num);
  const key = ok ? entryKey(ch.id, num) : '';
  const [fs, setFs] = useState(readFs);
  const [confirm, setConfirm] = useState(false);
  const [actErr, setActErr] = useState('');
  const last = useRef(null);
  const { data, error, loading, retry } = useLoad(() => (ok ? getEntry(key) : Promise.resolve(null)), [key]);
  if (!ok) return <NotFound />;
  if (error) return <Alert message="This entry could not be opened." onRetry={retry} />;
  if (loading) return <div className="boot" aria-busy="true" />;

  const base = `/chapter/${ch.id}/entry`;
  const n = Number(num);
  const written = !!(data && data.body.trim());

  async function act(fn) {
    last.current = fn;
    setActErr('');
    try {
      await fn();
      setConfirm(false);
      retry();
    } catch {
      setActErr('That action did not work.');
    }
  }
  const step = (d) => {
    const next = FS[Math.min(FS.length - 1, Math.max(0, FS.indexOf(fs) + d))];
    setFs(next);
    try { localStorage.setItem('unsent-fs', String(next)); } catch { /* storage blocked */ }
  };
  const pager = (
    <nav className="page-nav" aria-label="Entries">
      {n > 1 ? <Link className="btn" to={`${base}/${pad(n - 1)}`}><ChevronLeft size={18} /> {pad(n - 1)}</Link> : <span />}
      {n < ch.count ? <Link className="btn" to={`${base}/${pad(n + 1)}`}>{pad(n + 1)} <ChevronRight size={18} /></Link> : <span />}
    </nav>
  );

  if (!written) {
    return (
      <section className="empty">
        <p className="eyebrow">Chapter {ch.id} · Entry {num}</p>
        <h1>This page is still blank</h1>
        <p>Nothing has been written for entry {num} yet.</p>
        <Link className="btn primary" to={`${base}/${num}/write`}>
          <PenLine size={18} /> Write entry {num}
        </Link>
        {pager}
      </section>
    );
  }
  return (
    <article>
      <header className="reader-head">
        <p className="eyebrow">Chapter {ch.id} · Entry {num}</p>
        <h1>{data.title || 'Untitled'}</h1>
        <p className="meta">{[fmtDate(data.date), data.mood].filter(Boolean).join(' · ')}</p>
      </header>
      <div className="reader-tools">
        <button className="icon-btn" aria-label="Smaller text" onClick={() => step(-1)}><Minus size={18} /></button>
        <span className="meta">Text</span>
        <button className="icon-btn" aria-label="Larger text" onClick={() => step(1)}><Plus size={18} /></button>
        <button
          className="icon-btn"
          aria-label={data.pinned ? 'Remove from moments' : 'Add to moments'}
          onClick={() => act(() => saveEntry({ ...data, pinned: !data.pinned }))}
        >
          <Bookmark size={20} fill={data.pinned ? 'currentColor' : 'none'} />
        </button>
        <Link className="icon-btn" aria-label="Edit entry" to={`${base}/${num}/write`}><Pencil size={20} /></Link>
        <button className="icon-btn" aria-label="Delete entry" onClick={() => setConfirm(true)}><Trash2 size={20} /></button>
      </div>
      {confirm && (
        <div className="confirm">
          <span>Delete this entry? This cannot be undone.</span>
          <button className="btn danger" onClick={() => act(() => deleteEntry(key))}>Delete</button>
          <button className="btn ghost" onClick={() => setConfirm(false)}>Cancel</button>
        </div>
      )}
      {actErr && <Alert message={actErr} onRetry={() => act(last.current)} />}
      <div className={`reader fs-${fs}`}>
        {data.body.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {pager}
    </article>
  );
}
