const stop = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

export function installGuard() {
  ['contextmenu', 'copy', 'cut', 'dragstart', 'selectstart'].forEach((t) => document.addEventListener(t, stop, true));
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((t) => document.addEventListener(t, stop, { passive: false }));
  document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener('wheel', (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  window.addEventListener(
    'keydown',
    (e) => {
      const mod = e.ctrlKey || e.metaKey;
      const fkey = /^F([1-9]|1[0-2])$/.test(e.code);
      const clip = mod && ['KeyC', 'KeyX', 'KeyA', 'KeyS', 'KeyP', 'KeyU'].includes(e.code);
      const tools =
        (mod && e.shiftKey && ['KeyI', 'KeyJ', 'KeyC', 'KeyK', 'KeyM'].includes(e.code)) ||
        (e.metaKey && e.altKey && ['KeyI', 'KeyJ', 'KeyC', 'KeyU'].includes(e.code));
      const zoom = mod && ['Equal', 'Minus', 'Digit0', 'NumpadAdd', 'NumpadSubtract', 'Numpad0'].includes(e.code);
      if (fkey || clip || tools || zoom) stop(e);
    },
    true
  );
}
