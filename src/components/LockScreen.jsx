import { useState } from 'react';
import { Lock } from 'lucide-react';
import { NOVEL_TITLE } from '../lib/chapters.js';
import { checkPin, markUnlocked } from '../lib/lock.js';

export default function LockScreen({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [msg, setMsg] = useState('');
  const [fails, setFails] = useState(0);
  const [until, setUntil] = useState(0);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (Date.now() < until) { setMsg('Too many attempts. Please wait a moment.'); return; }
    setBusy(true);
    try {
      if (await checkPin(pin)) { markUnlocked(); onUnlock(); return; }
      const f = fails + 1;
      setPin('');
      if (f >= 5) { setUntil(Date.now() + 30000); setFails(0); setMsg('Too many attempts. Wait 30 seconds.'); }
      else { setFails(f); setMsg('Incorrect PIN.'); }
    } catch {
      setMsg('The PIN could not be checked. Try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="lock">
      <Lock size={28} />
      <h1>{NOVEL_TITLE}</h1>
      <form onSubmit={submit}>
        <input className="field" type="password" inputMode="numeric" autoComplete="off" maxLength={8} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} aria-label="PIN" />
        {msg && <p className="meta" role="alert">{msg}</p>}
        <button className="btn primary" disabled={busy || pin.length < 4}>Unlock</button>
      </form>
    </div>
  );
}
