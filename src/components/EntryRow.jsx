import { Link } from 'react-router-dom';

export default function EntryRow({ e, extra }) {
  return (
    <li>
      <Link className="row-item" to={`/chapter/${e.chapter}/entry/${e.num}`}>
        <span className="row-num">{e.num}</span>
        <span className="row-main">
          <strong className="serif">{e.title || 'Untitled'}</strong>
          {extra ? <span className="meta">{extra}</span> : null}
        </span>
      </Link>
    </li>
  );
}
