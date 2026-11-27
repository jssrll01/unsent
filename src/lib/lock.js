import { getMeta, setMeta } from './db.js';

const enc = new TextEncoder();
const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

async function derive(pin, saltHex) {
  const salt = Uint8Array.from(saltHex.match(/../g), (h) => parseInt(h, 16));
  const key = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' }, key, 256);
  return hex(bits);
}

export const hasPin = async () => !!(await getMeta('pin'));

export async function setPin(pin) {
  if (!/^\d{4,8}$/.test(pin)) throw new Error('The PIN must be 4 to 8 digits.');
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  await setMeta('pin', { salt, hash: await derive(pin, salt) });
}

export async function checkPin(pin) {
  const rec = await getMeta('pin');
  if (!rec) return true;
  return (await derive(pin, rec.salt)) === rec.hash;
}

export const clearPin = () => setMeta('pin', null);

export function isUnlocked() {
  try { return sessionStorage.getItem('unsent-unlocked') === '1'; } catch { return false; }
}
export function markUnlocked() {
  try { sessionStorage.setItem('unsent-unlocked', '1'); } catch { /* storage blocked */ }
}
export function lockNow() {
  try { sessionStorage.removeItem('unsent-unlocked'); } catch { /* storage blocked */ }
}
