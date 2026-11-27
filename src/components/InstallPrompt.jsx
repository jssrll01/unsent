import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Share, X } from 'lucide-react';
import Alert from './Alert.jsx';
import { NOVEL_TITLE } from '../lib/chapters.js';

let deferred = null;
const subs = new Set();
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferred = e;
  subs.forEach((f) => f());
});

const isInstalled = () =>
  ['standalone', 'fullscreen', 'minimal-ui'].some((m) => matchMedia(`(display-mode: ${m})`).matches) ||
  navigator.standalone === true;
const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export default function InstallPrompt() {
  const [installed, setInstalled] = useState(isInstalled);
  const [hidden, setHidden] = useState(false);
  const [shown, setShown] = useState(false);
  const [err, setErr] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const sync = () => setTick((t) => t + 1);
    const done = () => { deferred = null; setInstalled(true); };
    const mq = matchMedia('(display-mode: standalone)');
    const mode = () => setInstalled(isInstalled());
    subs.add(sync);
    window.addEventListener('appinstalled', done);
    mq.addEventListener('change', mode);
    const t = setTimeout(() => setShown(true), 1200);
    return () => {
      subs.delete(sync);
      window.removeEventListener('appinstalled', done);
      mq.removeEventListener('change', mode);
      clearTimeout(t);
    };
  }, []);

  async function install() {
    setErr(false);
    try {
      deferred.prompt();
      const choice = await deferred.userChoice;
      deferred = null;
      if (choice.outcome === 'accepted') setInstalled(true);
      else setHidden(true);
    } catch {
      setErr(true);
    }
  }

  if (installed || hidden || !shown) return null;
  return createPortal(
    <div className="sheet-backdrop">
      <div className="sheet" role="dialog" aria-label="Install the app">
        <div className="sheet-head">
          <h2>Install {NOVEL_TITLE}</h2>
          <button className="icon-btn" onClick={() => setHidden(true)} aria-label="Close"><X size={20} /></button>
        </div>
        {deferred ? (
          <>
            <p className="meta">Add it to your home screen to open it like an app, with no browser bars.</p>
            {err && <Alert message="The install could not start." onRetry={install} />}
            <button className="btn primary" onClick={install}><Download size={18} /> Install</button>
          </>
        ) : isIos() ? (
          <p className="meta">
            In Safari, tap the Share button <Share size={14} className="inline-icon" /> then choose Add to Home Screen.
          </p>
        ) : (
          <p className="meta">Open your browser menu and choose Install app or Add to Home screen.</p>
        )}
        <button className="btn ghost" onClick={() => setHidden(true)}>Not now</button>
      </div>
    </div>,
    document.body
  );
}
