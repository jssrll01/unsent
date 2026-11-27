import { SEED } from '../data/seed.js';
import { LIMITS } from './chapters.js';

let dbp = null;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    const req = indexedDB.open('unsent', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('entries', { keyPath: 'key' });
      req.result.createObjectStore('meta', { keyPath: 'k' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbp = null;
      reject(req.error || new Error('Storage unavailable'));
    };
  });
  return dbp;
}

function run(store, mode, fn) {
  return open().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(store, mode);
        const out = fn(tx.objectStore(store));
        tx.oncomplete = () => resolve(out ? out.result : undefined);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      })
  );
}

export const getEntry = (key) => run('entries', 'readonly', (s) => s.get(key));
export const allEntries = () => run('entries', 'readonly', (s) => s.getAll());
export const deleteEntry = (key) => run('entries', 'readwrite', (s) => { s.delete(key); });
export const getMeta = (k) => run('meta', 'readonly', (s) => s.get(k)).then((r) => (r ? r.v : null));
export const setMeta = (k, v) => run('meta', 'readwrite', (s) => { s.put({ k, v }); });

export async function saveEntry(e) {
  const rec = {
    key: e.key,
    chapter: e.chapter,
    num: e.num,
    title: String(e.title || '').slice(0, LIMITS.title),
    body: String(e.body || '').slice(0, LIMITS.body),
    date: /^\d{4}-\d{2}-\d{2}$/.test(e.date || '') ? e.date : '',
    mood: String(e.mood || '').slice(0, LIMITS.mood),
    pinned: !!e.pinned,
    updatedAt: Date.now(),
  };
  await run('entries', 'readwrite', (s) => { s.put(rec); });
  return rec;
}

export async function ensureSeed() {
  if (await getMeta('seeded')) return;
  for (const s of SEED) {
    if (!(await getEntry(s.key))) await saveEntry(s);
  }
  await setMeta('seeded', true);
}
