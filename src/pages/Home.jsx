import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { CHAPTERS, NOVEL_TITLE, TAGLINE } from '../lib/chapters.js';
import { writtenNums } from '../chapters/index.js';

export default function Home() {
  return (
    <section className="cover">
      <p className="eyebrow">A diary novel</p>
      <h1>{NOVEL_TITLE}</h1>
      <blockquote className="tagline">{TAGLINE}</blockquote>
      <h2 className="group-title">Chapters</h2>
      <ul className="list">
        {CHAPTERS.map((c, i) => (
          <li key={c.id} style={{ '--i': i }}>
            <Link className="row-item" to={`/chapter/${c.id}`}>
              <span className="row-num">{c.id}</span>
              <span className="row-main">
                <strong className="serif">{c.title}</strong>
                <span className="meta">{writtenNums(c.id).length} of {c.count} entries</span>
              </span>
              <ChevronRight size={18} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
