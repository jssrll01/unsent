import { useState } from 'react';
import { Download, Lock, Moon, Sun } from 'lucide-react';
import Alert from '../components/Alert.jsx';
import { exportNovel } from '../lib/exporter.js';
import { checkPin, clearPin, hasPin, lockNow, setPin } from '../lib/lock.js';
import { getTheme, setTheme } from '../lib/theme.js';
import { useLoad } from '../lib/useLoad.js';

function PinForm({ mode, onDone, onCancel }) {
  const [cur, setCur] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [err, setErr] = useState('');
  const digits = (fn) => (e) => fn(e.target.value.replace(/\D/g, ''));
  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      if (mode !== 'set' && !(await checkPin(cur))) { setErr('The current PIN is incorrect.'); return; }
      if (mode === 'remove') { await clearPin(); onDone(); return; }
      if (a !== b) { setErr('The new PINs do not match.'); return; }
      await setPin(a);
      onDone();
    } catch (x) {
      setErr(x.message || 'The PIN could not be saved.');
    }
  }
  const input = (value, fn, label) => (
    <input className="field" type="password" inputMode="numeric" autoComplete="off" maxLength={8} value={value} onChange={digits(fn)} placeholder={label} aria-label={label} />
  );
  return (
    <form className="pin-form" onSubmit={submit}>
      {mode !== 'set' && input(cur, setCur, 'Current PIN')}
      {mode !== 'remove' && input(a, setA, 'New PIN (4 to 8 digits)')}
      {mode !== 'remove' && input(b, setB, 'Repeat new PIN')}
      {err && <p className="meta" role="alert">{err}</p>}
      <div className="row">
        <button className="btn primary">{mode === 'remove' ? 'Remove PIN' : 'Save PIN'}</button>
        <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function Settings() {
  const [tick, setTick] = useState(0);
  const [theme, setT] = useState(getTheme());
  const [mode, setMode] = useState(null);
  const [exp, setExp] = useState(null);
  const pin = useLoad(hasPin, [tick]);
  const pick = (t) => { setTheme(t); setT(t); };
  async function doExport(kind) {
    setExp(null);
    try { await exportNovel(kind); } catch (e) { setExp({ kind, msg: e.message || 'The export failed.' }); }
  }
  const finish = () => { setMode(null); setTick((t) => t + 1); };
  return (
    <section>
      <p className="eyebrow">Settings</p>
      <h1>Your private space</h1>
      <div className="panel">
        <h2>Appearance</h2>
        <div className="row">
          {['system', 'dark', 'light'].map((t) => (
            <button key={t} className="btn" aria-pressed={theme === t} onClick={() => pick(t)}>
              {t === 'dark' ? <Moon size={16} /> : t === 'light' ? <Sun size={16} /> : null}
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="panel">
        <h2>Lock</h2>
        <p className="meta">The PIN locks the app screen on this device. It does not encrypt stored entries.</p>
        {pin.error ? (
          <Alert message="The lock settings could not be read." onRetry={pin.retry} />
        ) : pin.loading ? null : mode ? (
          <PinForm mode={mode} onDone={finish} onCancel={() => setMode(null)} />
        ) : pin.data ? (
          <div className="row">
            <button className="btn" onClick={() => setMode('change')}>Change PIN</button>
            <button className="btn" onClick={() => setMode('remove')}>Remove PIN</button>
            <button className="btn primary" onClick={() => { lockNow(); window.location.assign('/'); }}><Lock size={16} /> Lock now</button>
          </div>
        ) : (
          <div className="row"><button className="btn primary" onClick={() => setMode('set')}><Lock size={16} /> Set a PIN</button></div>
        )}
      </div>
      <div className="panel">
        <h2>Backup</h2>
        <p className="meta">Entries are stored only in this browser. Export regularly to keep a copy.</p>
        <div className="row">
          <button className="btn" onClick={() => doExport('txt')}><Download size={16} /> Export .txt</button>
          <button className="btn" onClick={() => doExport('md')}><Download size={16} /> Export Markdown</button>
        </div>
        {exp && <Alert message={exp.msg} onRetry={() => doExport(exp.kind)} />}
      </div>
    </section>
  );
}
