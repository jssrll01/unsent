import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import NotFound from './NotFound.jsx';
import { chapterById, validNum } from '../lib/chapters.js';
import { getEntry, writtenNums } from '../chapters/index.js';
import { fmtDate } from '../lib/format.js';

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
  const [fs, setFs] = useState(readFs);
  const data = ch && validNum(ch, num) ? getEntry(ch.id, num) : null;
  if (!data) return <NotFound />;

  const base = `/chapter/${ch.id}`;
  const nums = writtenNums(ch.id);
  const at = nums.indexOf(num);
  const prev = nums[at - 1];
  const next = nums[at + 1];
  const step = (d) => {
    const v = FS[Math.min(FS.length - 1, Math.max(0, FS.indexOf(fs) + d))];
    setFs(v);
    try { localStorage.setItem('unsent-fs', String(v)); } catch { /* storage blocked */ }
  };
  return (
    <article>
      <Link className="back" to={base}><ChevronLeft size={16} /> Chapter {ch.id}</Link>
      <header className="reader-head">
        <p className="eyebrow">Entry {num}</p>
        <h1>{data.title || 'Untitled'}</h1>
        <p className="meta">{[fmtDate(data.date), data.mood].filter(Boolean).join(' · ')}</p>
      </header>
      <div className="reader-tools">
        <button className="icon-btn" aria-label="Smaller text" onClick={() => step(-1)}><Minus size={18} /></button>
        <span className="meta">Text</span>
        <button className="icon-btn" aria-label="Larger text" onClick={() => step(1)}><Plus size={18} /></button>
      </div>
      <div className={`reader fs-${fs}`}>
        {data.paragraphs.map((p, i) => <p key={i} style={{ '--i': i }}>{p}</p>)}
      </div>
      <nav className="page-nav" aria-label="Entries">
        {prev ? <Link className="btn" to={`${base}/entry/${prev}`}><ChevronLeft size={18} /> {prev}</Link> : <span />}
        {next ? <Link className="btn" to={`${base}/entry/${next}`}>{next} <ChevronRight size={18} /></Link> : <span />}
      </nav>
    </article>
  );
}
