import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronLeft } from 'lucide-react';
import Alert from '../components/Alert.jsx';
import NotFound from './NotFound.jsx';
import { LIMITS, MOODS, chapterById, entryKey, validNum } from '../lib/chapters.js';
import { getEntry, saveEntry } from '../lib/db.js';
import { today, wordCount } from '../lib/format.js';
import { useLoad } from '../lib/useLoad.js';

const LABEL = { idle: 'Start writing', saving: 'Saving', saved: 'Saved', error: 'Not saved' };
const sigOf = (v) => JSON.stringify([v.title, v.body, v.date, v.mood]);

function Editor({ ch, num, initial }) {
  const nav = useNavigate();
  const key = entryKey(ch.id, num);
  const [v, setV] = useState({
    title: initial ? initial.title : '',
    body: initial ? initial.body : '',
    date: initial ? initial.date : today(),
    mood: initial ? initial.mood : '',
  });
  const [status, setStatus] = useState(initial ? 'saved' : 'idle');
  const latest = useRef(v);
  const savedSig = useRef(initial ? sigOf(v) : '');
  const pinned = useRef(!!(initial && initial.pinned));
  latest.current = v;

  const persist = useCallback(async () => {
    const cur = latest.current;
    if (!cur.title.trim() && !cur.body.trim()) { setStatus('idle'); return true; }
    const sig = sigOf(cur);
    if (sig === savedSig.current) { setStatus('saved'); return true; }
    setStatus('saving');
    try {
      await saveEntry({ key, chapter: ch.id, num, ...cur, pinned: pinned.current });
      savedSig.current = sig;
      setStatus('saved');
      return true;
    } catch {
      setStatus('error');
      return false;
    }
  }, [key, ch.id, num]);

  useEffect(() => {
    if (sigOf(v) === savedSig.current) return undefined;
    setStatus('saving');
    const t = setTimeout(persist, 800);
    return () => clearTimeout(t);
  }, [v, persist]);

  useEffect(() => () => { persist(); }, [persist]);

  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  async function done() {
    if (await persist()) nav(`/chapter/${ch.id}/entry/${num}`);
  }

  return (
    <div className="editor">
      <div className="editor-bar">
        <button className="icon-btn" onClick={done} aria-label="Back to entry"><ChevronLeft size={22} /></button>
        <span className="meta">Entry {num} · {LABEL[status]}</span>
        <button className="btn primary" onClick={done}><Check size={18} /> Done</button>
      </div>
      {status === 'error' && <Alert message="Autosave failed." onRetry={persist} />}
      <input className="title-input" placeholder="Title" maxLength={LIMITS.title} value={v.title} onChange={set('title')} aria-label="Title" />
      <div className="row">
        <input className="field" type="date" value={v.date} onChange={set('date')} aria-label="Date" />
        <select className="field" value={v.mood} onChange={set('mood')} aria-label="Mood">
          <option value="">Mood</option>
          {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <textarea className="body-input" placeholder="Write what you do not want to forget." maxLength={LIMITS.body} value={v.body} onChange={set('body')} aria-label="Entry text" />
      <p className="meta">{wordCount(v.body)} words · {v.body.length}/{LIMITS.body}</p>
    </div>
  );
}

export default function Write() {
  const { chapter, num } = useParams();
  const ch = chapterById(chapter);
  const ok = !!ch && validNum(ch, num);
  const key = ok ? entryKey(ch.id, num) : '';
  const { data, error, loading, retry } = useLoad(() => (ok ? getEntry(key) : Promise.resolve(null)), [key]);
  if (!ok) return <NotFound />;
  if (error) return <Alert message="This entry could not be opened." onRetry={retry} />;
  if (loading) return <div className="boot" aria-busy="true" />;
  return <Editor key={key} ch={ch} num={num} initial={data} />;
}
