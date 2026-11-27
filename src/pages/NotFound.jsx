import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="cover">
      <p className="eyebrow">Not found</p>
      <h1>This page does not exist</h1>
      <p className="meta" style={{ margin: '12px 0 20px' }}>The address may be mistyped.</p>
      <Link className="btn primary" to="/">Back to the cover</Link>
    </section>
  );
}
